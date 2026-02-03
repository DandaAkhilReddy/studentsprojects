import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateReferralCode,
  codeExists,
  generateUniqueCode,
  registerReferrer,
  validateReferralCode,
  useReferralCode,
  getReferrerStats
} from '../referralService'

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'mockCollection'),
  doc: vi.fn(() => ({ id: 'mockDocId' })),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(() => 'mockQuery'),
  where: vi.fn(() => 'mockWhere'),
  updateDoc: vi.fn(),
  increment: vi.fn((n) => ({ _increment: n })),
  serverTimestamp: vi.fn(() => ({ _serverTimestamp: true }))
}))

vi.mock('../../config/firebase', () => ({
  db: {}
}))

// Import mocked functions
import { getDocs, setDoc, updateDoc, doc, collection, query, where } from 'firebase/firestore'

describe('Referral Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==================== generateReferralCode() ====================
  describe('generateReferralCode()', () => {
    it('returns a code with REF- prefix', () => {
      const code = generateReferralCode()
      expect(code.startsWith('REF-')).toBe(true)
    })

    it('returns a code with exactly 10 characters total', () => {
      const code = generateReferralCode()
      expect(code.length).toBe(10)
    })

    it('uses only allowed characters (no 0, O, 1, I)', () => {
      // Run multiple times to increase confidence
      // Note: L is allowed in the charset, only 0, O, 1, I are excluded
      for (let i = 0; i < 100; i++) {
        const code = generateReferralCode()
        const suffix = code.slice(4) // Remove REF- prefix
        expect(suffix).not.toMatch(/[0OI1]/)
      }
    })

    it('uses only uppercase letters and numbers 2-9', () => {
      for (let i = 0; i < 100; i++) {
        const code = generateReferralCode()
        const suffix = code.slice(4)
        expect(suffix).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/)
      }
    })

    it('generates different codes on subsequent calls (probabilistic)', () => {
      const codes = new Set()
      for (let i = 0; i < 50; i++) {
        codes.add(generateReferralCode())
      }
      // With 30+ character alphabet and 6 positions, collisions should be rare
      expect(codes.size).toBeGreaterThan(45)
    })
  })

  // ==================== codeExists() ====================
  describe('codeExists()', () => {
    it('returns true when code exists in database', async () => {
      getDocs.mockResolvedValue({ empty: false, docs: [{ id: 'doc1' }] })

      const result = await codeExists('REF-ABC123')

      expect(result).toBe(true)
      expect(query).toHaveBeenCalled()
      expect(where).toHaveBeenCalledWith('code', '==', 'REF-ABC123')
    })

    it('returns false when code does not exist', async () => {
      getDocs.mockResolvedValue({ empty: true, docs: [] })

      const result = await codeExists('REF-NOTFOUND')

      expect(result).toBe(false)
    })

    it('throws error when Firestore fails', async () => {
      getDocs.mockRejectedValue(new Error('Firestore error'))

      await expect(codeExists('REF-ERROR')).rejects.toThrow('Firestore error')
    })
  })

  // ==================== generateUniqueCode() ====================
  describe('generateUniqueCode()', () => {
    it('returns a unique code on first try', async () => {
      getDocs.mockResolvedValue({ empty: true })

      const code = await generateUniqueCode()

      expect(code).toMatch(/^REF-[A-Z0-9]{6}$/)
    })

    it('retries when code already exists', async () => {
      // First 2 calls: code exists, third call: code is unique
      getDocs
        .mockResolvedValueOnce({ empty: false })
        .mockResolvedValueOnce({ empty: false })
        .mockResolvedValueOnce({ empty: true })

      const code = await generateUniqueCode()

      expect(code).toMatch(/^REF-/)
      expect(getDocs).toHaveBeenCalledTimes(3)
    })

    it('falls back to timestamp after 10 attempts', async () => {
      // Always return code exists
      getDocs.mockResolvedValue({ empty: false })

      const code = await generateUniqueCode()

      // Should use timestamp-based fallback
      expect(code).toMatch(/^REF-[A-Z0-9]{6}$/)
      // Initial call + 10 retries = 11 total (or could be fewer depending on implementation)
      expect(getDocs.mock.calls.length).toBeGreaterThanOrEqual(10)
    })
  })

  // ==================== registerReferrer() ====================
  describe('registerReferrer()', () => {
    it('creates new referrer successfully', async () => {
      getDocs
        .mockResolvedValueOnce({ empty: true }) // No existing user
        .mockResolvedValueOnce({ empty: true }) // codeExists check
      setDoc.mockResolvedValue()

      const result = await registerReferrer('John Doe', 'john@example.com', '1234567890')

      expect(result.success).toBe(true)
      expect(result.isExisting).toBe(false)
      expect(result.data.name).toBe('John Doe')
      expect(result.data.email).toBe('john@example.com')
      expect(result.data.code).toMatch(/^REF-/)
      expect(setDoc).toHaveBeenCalled()
    })

    it('returns existing referrer if email already exists', async () => {
      const existingData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        code: 'REF-EXIST1',
        referralCount: 5
      }
      getDocs.mockResolvedValueOnce({
        empty: false,
        docs: [{ id: 'existingId', data: () => existingData }]
      })

      const result = await registerReferrer('Jane Doe', 'jane@example.com', '9876543210')

      expect(result.success).toBe(true)
      expect(result.isExisting).toBe(true)
      expect(result.data.code).toBe('REF-EXIST1')
      expect(setDoc).not.toHaveBeenCalled()
    })

    it('normalizes email to lowercase', async () => {
      getDocs.mockResolvedValue({ empty: true })
      setDoc.mockResolvedValue()

      await registerReferrer('Test User', 'TEST@EXAMPLE.COM', '1111111111')

      expect(where).toHaveBeenCalledWith('email', '==', 'test@example.com')
    })

    it('trims whitespace from inputs', async () => {
      getDocs.mockResolvedValue({ empty: true })
      setDoc.mockResolvedValue()

      const result = await registerReferrer('  John Doe  ', '  john@test.com  ', '  555-1234  ')

      expect(result.data.name).toBe('John Doe')
      expect(result.data.email).toBe('john@test.com')
      expect(result.data.phone).toBe('555-1234')
    })

    it('handles missing phone gracefully', async () => {
      getDocs.mockResolvedValue({ empty: true })
      setDoc.mockResolvedValue()

      const result = await registerReferrer('Test', 'test@test.com', undefined)

      expect(result.success).toBe(true)
      expect(result.data.phone).toBe('')
    })

    it('handles null phone gracefully', async () => {
      getDocs.mockResolvedValue({ empty: true })
      setDoc.mockResolvedValue()

      const result = await registerReferrer('Test', 'test@test.com', null)

      expect(result.success).toBe(true)
      expect(result.data.phone).toBe('')
    })

    it('sets correct initial values for new referrer', async () => {
      getDocs.mockResolvedValue({ empty: true })
      setDoc.mockResolvedValue()

      const result = await registerReferrer('New User', 'new@test.com', '1234')

      expect(result.data.referralCount).toBe(0)
      expect(result.data.earnings).toBe(0)
      expect(result.data.status).toBe('active')
    })

    it('returns error on Firestore failure', async () => {
      getDocs.mockResolvedValueOnce({ empty: true })
      getDocs.mockResolvedValueOnce({ empty: true })
      setDoc.mockRejectedValue(new Error('Database error'))

      const result = await registerReferrer('Error User', 'error@test.com', '999')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Database error')
    })
  })

  // ==================== validateReferralCode() ====================
  describe('validateReferralCode()', () => {
    it('returns valid for existing code', async () => {
      const referrerData = { name: 'Test Referrer', code: 'REF-VALID1' }
      getDocs.mockResolvedValue({
        empty: false,
        docs: [{ id: 'refId', data: () => referrerData }]
      })

      const result = await validateReferralCode('REF-VALID1')

      expect(result.valid).toBe(true)
      expect(result.referrer.name).toBe('Test Referrer')
      expect(result.referrer.code).toBe('REF-VALID1')
    })

    it('returns invalid for non-existent code', async () => {
      getDocs.mockResolvedValue({ empty: true })

      const result = await validateReferralCode('REF-NOTFOUND')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid referral code')
    })

    it('normalizes code to uppercase', async () => {
      getDocs.mockResolvedValue({ empty: true })

      await validateReferralCode('ref-abc123')

      expect(where).toHaveBeenCalledWith('code', '==', 'REF-ABC123')
    })

    it('trims whitespace from code', async () => {
      getDocs.mockResolvedValue({ empty: true })

      await validateReferralCode('  REF-ABC123  ')

      expect(where).toHaveBeenCalledWith('code', '==', 'REF-ABC123')
    })

    it('handles Firestore errors gracefully', async () => {
      getDocs.mockRejectedValue(new Error('Network error'))

      const result = await validateReferralCode('REF-ERROR')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  // ==================== useReferralCode() ====================
  describe('useReferralCode()', () => {
    const validReferrer = { name: 'Referrer', code: 'REF-VALID1' }

    it('successfully processes a referral', async () => {
      // Mock: code is valid
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        // Mock: friend email not used before
        .mockResolvedValueOnce({ empty: true })

      setDoc.mockResolvedValue()
      updateDoc.mockResolvedValue()

      const result = await useReferralCode('REF-VALID1', 'Friend Name', 'friend@test.com', '555-1234')

      expect(result.success).toBe(true)
      expect(result.data.referrerName).toBe('Referrer')
      expect(result.data.rewards.referrer).toBe(50)
      expect(result.data.rewards.friend).toBe(50)
    })

    it('fails for invalid referral code', async () => {
      getDocs.mockResolvedValue({ empty: true })

      const result = await useReferralCode('REF-INVALID', 'Friend', 'friend@test.com', '123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid referral code')
    })

    it('fails if email has already used a referral code', async () => {
      // Mock: code is valid
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        // Mock: friend email already used
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'existingReferral' }]
        })

      const result = await useReferralCode('REF-VALID1', 'Friend', 'used@test.com', '123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('This email has already used a referral code')
    })

    it('updates referrer referralCount', async () => {
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        .mockResolvedValueOnce({ empty: true })

      setDoc.mockResolvedValue()
      updateDoc.mockResolvedValue()

      await useReferralCode('REF-VALID1', 'Friend', 'friend@test.com', '123')

      expect(updateDoc).toHaveBeenCalled()
    })

    it('sets correct reward amounts ($50 each)', async () => {
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        .mockResolvedValueOnce({ empty: true })

      setDoc.mockResolvedValue()
      updateDoc.mockResolvedValue()

      const result = await useReferralCode('REF-VALID1', 'Friend', 'friend@test.com', '123')

      expect(result.data.rewards.referrer).toBe(50)
      expect(result.data.rewards.friend).toBe(50)
    })

    it('normalizes friend email to lowercase', async () => {
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        .mockResolvedValueOnce({ empty: true })

      setDoc.mockResolvedValue()
      updateDoc.mockResolvedValue()

      await useReferralCode('REF-VALID1', 'Friend', 'FRIEND@TEST.COM', '123')

      // Check that the check was done with lowercase
      expect(where).toHaveBeenCalledWith('friendEmail', '==', 'friend@test.com')
    })

    it('handles missing friend phone', async () => {
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        .mockResolvedValueOnce({ empty: true })

      setDoc.mockResolvedValue()
      updateDoc.mockResolvedValue()

      const result = await useReferralCode('REF-VALID1', 'Friend', 'friend@test.com', undefined)

      expect(result.success).toBe(true)
    })

    it('handles Firestore errors gracefully', async () => {
      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => validReferrer }]
        })
        .mockResolvedValueOnce({ empty: true })

      setDoc.mockRejectedValue(new Error('Write failed'))

      const result = await useReferralCode('REF-VALID1', 'Friend', 'friend@test.com', '123')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Write failed')
    })
  })

  // ==================== getReferrerStats() ====================
  describe('getReferrerStats()', () => {
    it('returns stats for existing referrer', async () => {
      const referrerData = {
        name: 'Test Referrer',
        email: 'test@test.com',
        code: 'REF-TEST01',
        referralCount: 3,
        earnings: 150
      }
      const referrals = [
        { id: 'ref1', data: () => ({ friendName: 'Friend 1', status: 'paid' }) },
        { id: 'ref2', data: () => ({ friendName: 'Friend 2', status: 'pending' }) }
      ]

      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'referrerId', data: () => referrerData }]
        })
        .mockResolvedValueOnce({ docs: referrals })

      const result = await getReferrerStats('test@test.com')

      expect(result.found).toBe(true)
      expect(result.data.name).toBe('Test Referrer')
      expect(result.data.referrals.length).toBe(2)
    })

    it('returns not found for non-existent email', async () => {
      getDocs.mockResolvedValue({ empty: true })

      const result = await getReferrerStats('notfound@test.com')

      expect(result.found).toBe(false)
    })

    it('normalizes email to lowercase', async () => {
      getDocs.mockResolvedValue({ empty: true })

      await getReferrerStats('TEST@EXAMPLE.COM')

      expect(where).toHaveBeenCalledWith('email', '==', 'test@example.com')
    })

    it('includes all referrals in response', async () => {
      const referrerData = { name: 'Referrer', email: 'ref@test.com' }
      const referrals = [
        { id: 'ref1', data: () => ({ friendName: 'A' }) },
        { id: 'ref2', data: () => ({ friendName: 'B' }) },
        { id: 'ref3', data: () => ({ friendName: 'C' }) },
        { id: 'ref4', data: () => ({ friendName: 'D' }) },
        { id: 'ref5', data: () => ({ friendName: 'E' }) }
      ]

      getDocs
        .mockResolvedValueOnce({
          empty: false,
          docs: [{ id: 'refId', data: () => referrerData }]
        })
        .mockResolvedValueOnce({ docs: referrals })

      const result = await getReferrerStats('ref@test.com')

      expect(result.data.referrals.length).toBe(5)
    })

    it('handles Firestore errors gracefully', async () => {
      getDocs.mockRejectedValue(new Error('Query failed'))

      const result = await getReferrerStats('error@test.com')

      expect(result.found).toBe(false)
      expect(result.error).toBe('Query failed')
    })
  })
})
