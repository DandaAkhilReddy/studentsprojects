import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFormSubmit } from '../useFormSubmit'
import toast from 'react-hot-toast'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock fetch
global.fetch = vi.fn()

describe('useFormSubmit Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==================== Initial State Tests ====================
  describe('Initial State', () => {
    it('starts with isSubmitting as false', () => {
      const { result } = renderHook(() => useFormSubmit())

      expect(result.current.isSubmitting).toBe(false)
    })

    it('provides submitForm function', () => {
      const { result } = renderHook(() => useFormSubmit())

      expect(typeof result.current.submitForm).toBe('function')
    })
  })

  // ==================== Submission State Tests ====================
  describe('Submission State', () => {
    it('sets isSubmitting to true during request', async () => {
      let resolvePromise
      fetch.mockImplementation(() => new Promise(resolve => {
        resolvePromise = resolve
      }))

      const { result } = renderHook(() => useFormSubmit())

      act(() => {
        result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(result.current.isSubmitting).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise({
          json: () => Promise.resolve({ success: true })
        })
      })
    })

    it('sets isSubmitting to false after successful submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(result.current.isSubmitting).toBe(false)
    })

    it('sets isSubmitting to false after failed submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'Error' })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(result.current.isSubmitting).toBe(false)
    })

    it('sets isSubmitting to false after network error', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(result.current.isSubmitting).toBe(false)
    })
  })

  // ==================== Return Value Tests ====================
  describe('Return Values', () => {
    it('returns true on successful submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())
      let returnValue

      await act(async () => {
        returnValue = await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(returnValue).toBe(true)
    })

    it('returns false on failed submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'Submission failed' })
      })

      const { result } = renderHook(() => useFormSubmit())
      let returnValue

      await act(async () => {
        returnValue = await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(returnValue).toBe(false)
    })

    it('returns false on network error', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useFormSubmit())
      let returnValue

      await act(async () => {
        returnValue = await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(returnValue).toBe(false)
    })
  })

  // ==================== Callback Tests ====================
  describe('onSuccess Callback', () => {
    it('calls onSuccess callback on successful submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })
      const onSuccess = vi.fn()

      const { result } = renderHook(() => useFormSubmit(onSuccess))

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(onSuccess).toHaveBeenCalled()
    })

    it('does not call onSuccess callback on failed submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false })
      })
      const onSuccess = vi.fn()

      const { result } = renderHook(() => useFormSubmit(onSuccess))

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('does not call onSuccess callback on network error', async () => {
      fetch.mockRejectedValue(new Error('Network error'))
      const onSuccess = vi.fn()

      const { result } = renderHook(() => useFormSubmit(onSuccess))

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('handles undefined onSuccess callback gracefully', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit(undefined))

      await act(async () => {
        const returnValue = await result.current.submitForm({ name: 'Test', serviceType: 'project' })
        expect(returnValue).toBe(true)
      })
    })
  })

  // ==================== Toast Notification Tests ====================
  describe('Toast Notifications', () => {
    it('shows success toast on successful submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(toast.success).toHaveBeenCalledWith(
        'Thank you! We will contact you within 24 hours.',
        expect.objectContaining({ duration: 5000 })
      )
    })

    it('shows error toast on failed submission', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'Server error' })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(toast.error).toHaveBeenCalled()
    })

    it('shows error toast on network error', async () => {
      fetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      expect(toast.error).toHaveBeenCalled()
    })
  })

  // ==================== Request Format Tests ====================
  describe('Request Format', () => {
    it('sends correct request format', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({
          name: 'John Doe',
          email: 'john@test.com',
          serviceType: 'project'
        })
      })

      expect(fetch).toHaveBeenCalledWith(
        'https://api.web3forms.com/submit',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      )
    })

    it('includes all form fields in request body', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())
      const formData = {
        name: 'John Doe',
        email: 'john@test.com',
        phone: '555-1234',
        whatsapp: '555-5678',
        university: 'Test University',
        courseName: 'Computer Science',
        serviceType: 'project',
        projectPackage: 'complete',
        deadline: '2024-12-31',
        message: 'Test message'
      }

      await act(async () => {
        await result.current.submitForm(formData)
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody['Full Name']).toBe('John Doe')
      expect(callBody['Email']).toBe('john@test.com')
      expect(callBody['Phone']).toBe('555-1234')
      expect(callBody['WhatsApp']).toBe('555-5678')
      expect(callBody['University']).toBe('Test University')
      expect(callBody['Course Name']).toBe('Computer Science')
      expect(callBody['Service Type']).toBe('Project')
      expect(callBody['Package']).toBe('complete')
      expect(callBody['Deadline']).toBe('2024-12-31')
      expect(callBody['Details']).toBe('Test message')
    })

    it('sets correct subject for project service type', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test User', serviceType: 'project' })
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody.subject).toContain('Project')
    })

    it('sets correct subject for assignment service type', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test User', serviceType: 'assignment' })
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody.subject).toContain('Assignment')
    })

    it('handles missing optional fields with defaults', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({
          name: 'Test',
          email: 'test@test.com',
          serviceType: 'project'
        })
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody['WhatsApp']).toBe('Not provided')
      expect(callBody['University']).toBe('Not provided')
      expect(callBody['Package']).toBe('N/A')
      expect(callBody['Deadline']).toBe('Not specified')
      expect(callBody['Details']).toBe('No additional details')
    })

    it('includes access key in request', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody.access_key).toBeDefined()
    })

    it('includes from_name in request', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody.from_name).toBe('AgentChains.ai Website')
    })

    it('includes submission timestamp', async () => {
      fetch.mockResolvedValue({
        json: () => Promise.resolve({ success: true })
      })

      const { result } = renderHook(() => useFormSubmit())

      await act(async () => {
        await result.current.submitForm({ name: 'Test', serviceType: 'project' })
      })

      const callBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(callBody['Submitted At']).toBeDefined()
    })
  })
})
