import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Referral from '../Referral'
import toast from 'react-hot-toast'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock referral service
vi.mock('../../services/referralService', () => ({
  registerReferrer: vi.fn(),
  validateReferralCode: vi.fn(),
  useReferralCode: vi.fn(),
  getReferrerStats: vi.fn()
}))

import { registerReferrer, validateReferralCode, useReferralCode, getReferrerStats } from '../../services/referralService'

// Create a proper clipboard mock variable
let clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined)

// Helper to render with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Referral Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset and re-mock clipboard for each test
    clipboardWriteTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: clipboardWriteTextMock,
      },
      writable: true,
      configurable: true,
    })
  })

  // ==================== Rendering Tests ====================
  describe('Rendering', () => {
    it('renders navbar with logo', () => {
      renderWithRouter(<Referral />)
      expect(screen.getAllByText('AgentChains.ai').length).toBeGreaterThanOrEqual(1)
    })

    it('renders hero section with $50 amounts', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      // Check for $50 text
      const headingText = screen.getByRole('heading', { level: 1 }).textContent
      expect(headingText).toContain('$50')
    })

    it('renders "Become a Referrer" tab button', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByRole('button', { name: /Become a Referrer/i })).toBeInTheDocument()
    })

    it('renders "I Have a Code" tab button', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByRole('button', { name: /I Have a Code/i })).toBeInTheDocument()
    })

    it('renders FAQ section with 5 items', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      expect(screen.getByText('How does the referral program work?')).toBeInTheDocument()
      expect(screen.getByText('Do I need to be a customer to earn referral money?')).toBeInTheDocument()
      expect(screen.getByText('When do we get paid?')).toBeInTheDocument()
      expect(screen.getByText('Is there a limit to how many people I can refer?')).toBeInTheDocument()
      expect(screen.getByText('What about weekly projects?')).toBeInTheDocument()
    })

    it('renders earnings calculator', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByText('Calculate Your Earnings')).toBeInTheDocument()
      // Some amounts appear multiple times, so use getAllByText
      expect(screen.getAllByText('$50').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('$150').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('$250').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('$500').length).toBeGreaterThanOrEqual(1)
    })

    it('renders footer with copyright', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByText(/© 2024 AgentChains.ai/)).toBeInTheDocument()
    })

    it('renders How It Works section', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByText('How It Works')).toBeInTheDocument()
      expect(screen.getByText('Register')).toBeInTheDocument()
      expect(screen.getByText('Share')).toBeInTheDocument()
      expect(screen.getByText('Friend Signs Up')).toBeInTheDocument()
      expect(screen.getByText('Both Get $50!')).toBeInTheDocument()
    })
  })

  // ==================== Tab Switching Tests ====================
  describe('Tab Switching', () => {
    it('shows become referrer form by default', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByText('Become a Referral Partner')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    })

    it('switches to use code tab when clicked', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: /I Have a Code/i }))

      expect(screen.getByText('Have a Referral Code?')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('REF-XXXXXX')).toBeInTheDocument()
    })

    it('switches back to become referrer tab', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: /I Have a Code/i }))
      await user.click(screen.getByRole('button', { name: /Become a Referrer/i }))

      expect(screen.getByText('Become a Referral Partner')).toBeInTheDocument()
    })

    it('active tab button has different styling', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      const becomeButton = screen.getByRole('button', { name: /Become a Referrer/i })
      const useCodeButton = screen.getByRole('button', { name: /I Have a Code/i })

      // Initially "Become a Referrer" is active
      expect(becomeButton.className).toContain('bg-green-500')

      await user.click(useCodeButton)

      expect(useCodeButton.className).toContain('bg-green-500')
    })
  })

  // ==================== Registration Form Tests ====================
  describe('Registration Form', () => {
    it('renders all registration fields', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('john@university.edu')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('+1 (555) 123-4567')).toBeInTheDocument()
    })

    it('shows "Get My Referral Code" button', () => {
      renderWithRouter(<Referral />)
      expect(screen.getByRole('button', { name: /Get My Referral Code/i })).toBeInTheDocument()
    })

    it('shows loading state during submission', async () => {
      // Make registerReferrer hang to test loading state
      registerReferrer.mockImplementation(() => new Promise(() => {}))

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      expect(screen.getByText('Generating Your Code...')).toBeInTheDocument()
    })

    it('calls registerReferrer with correct data', async () => {
      registerReferrer.mockResolvedValue({
        success: true,
        isExisting: false,
        data: { code: 'REF-TEST01', name: 'Test User' }
      })

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.type(screen.getByPlaceholderText('+1 (555) 123-4567'), '555-1234')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(registerReferrer).toHaveBeenCalledWith('Test User', 'test@test.com', '555-1234')
      })
    })

    it('shows success code after registration', async () => {
      registerReferrer.mockResolvedValue({
        success: true,
        isExisting: false,
        data: { code: 'REF-ABC123', name: 'Test User' }
      })

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(screen.getByText('REF-ABC123')).toBeInTheDocument()
        expect(screen.getByText("You're In!")).toBeInTheDocument()
      })
    })

    it('shows welcome back message for existing user', async () => {
      registerReferrer.mockResolvedValue({
        success: true,
        isExisting: true,
        data: { code: 'REF-EXIST1', name: 'Existing User' }
      })

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Existing User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'existing@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Welcome back! Here's your existing referral code.")
      })
    })

    it('shows new referrer message for new user', async () => {
      registerReferrer.mockResolvedValue({
        success: true,
        isExisting: false,
        data: { code: 'REF-NEW001', name: 'New User' }
      })

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'New User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'new@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("You're now a referral partner! Share your code to earn $50 per referral.")
      })
    })

    it('shows error toast on failure', async () => {
      registerReferrer.mockResolvedValue({
        success: false,
        error: 'Something went wrong'
      })

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Something went wrong')
      })
    })

    it('shows network error toast on exception', async () => {
      registerReferrer.mockRejectedValue(new Error('Network error'))

      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error. Please check your connection and try again.')
      })
    })
  })

  // ==================== Generated Code Display Tests ====================
  describe('Generated Code Display', () => {
    beforeEach(async () => {
      registerReferrer.mockResolvedValue({
        success: true,
        isExisting: false,
        data: { code: 'REF-DISP01', name: 'Display User' }
      })
    })

    it('displays generated code', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(screen.getByText('REF-DISP01')).toBeInTheDocument()
      })
    })

    it('copy button copies code to clipboard', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(screen.getByText('REF-DISP01')).toBeInTheDocument()
      })

      const copyButton = screen.getByRole('button', { name: /^Copy$/i })
      await user.click(copyButton)

      // Verify the copy action by checking toast was called
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Code copied to clipboard!')
      })
    })

    it('copy share message button works', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(screen.getByText('REF-DISP01')).toBeInTheDocument()
      })

      const shareButton = screen.getByRole('button', { name: /Copy Share Message/i })
      await user.click(shareButton)

      // Verify the copy action by checking toast was called
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Share message copied!')
      })
    })

    it('new button resets form', async () => {
      renderWithRouter(<Referral />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      await user.click(screen.getByRole('button', { name: /Get My Referral Code/i }))

      await waitFor(() => {
        expect(screen.getByText('REF-DISP01')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /New/i }))

      expect(screen.getByText('Become a Referral Partner')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('John Doe')).toHaveValue('')
    })
  })

  // ==================== Use Referral Code Form Tests ====================
  describe('Use Referral Code Form', () => {
    beforeEach(async () => {
      const { container } = renderWithRouter(<Referral />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /I Have a Code/i }))
    })

    it('renders code input', () => {
      expect(screen.getByPlaceholderText('REF-XXXXXX')).toBeInTheDocument()
    })

    it('check button validates code', async () => {
      validateReferralCode.mockResolvedValue({
        valid: true,
        referrer: { name: 'Test Referrer', code: 'REF-VALID1' }
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-VALID1')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(validateReferralCode).toHaveBeenCalledWith('REF-VALID1')
      })
    })

    it('check button disabled without code', () => {
      const checkButton = screen.getByRole('button', { name: /Check/i })
      expect(checkButton).toBeDisabled()
    })

    it('shows loading state during validation', async () => {
      validateReferralCode.mockImplementation(() => new Promise(() => {}))

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-TEST01')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('shows valid code message', async () => {
      validateReferralCode.mockResolvedValue({
        valid: true,
        referrer: { name: 'John Referrer', code: 'REF-VALID1' }
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-VALID1')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(screen.getByText(/Valid code from John Referrer/)).toBeInTheDocument()
      })
    })

    it('shows invalid code message', async () => {
      validateReferralCode.mockResolvedValue({
        valid: false,
        error: 'Invalid referral code'
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-INVALID')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(screen.getByText(/Invalid referral code/)).toBeInTheDocument()
      })
    })

    it('shows additional fields after valid code', async () => {
      validateReferralCode.mockResolvedValue({
        valid: true,
        referrer: { name: 'Test Referrer', code: 'REF-VALID1' }
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-VALID1')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('jane@university.edu')).toBeInTheDocument()
      })
    })

    it('submit button processes referral', async () => {
      validateReferralCode.mockResolvedValue({
        valid: true,
        referrer: { name: 'Test Referrer', id: 'ref123', code: 'REF-VALID1' }
      })
      useReferralCode.mockResolvedValue({
        success: true,
        data: { referrerName: 'Test Referrer', rewards: { referrer: 50, friend: 50 } }
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-VALID1')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText('Jane Smith'), 'Friend Name')
      await user.type(screen.getByPlaceholderText('jane@university.edu'), 'friend@test.com')
      await user.click(screen.getByRole('button', { name: /Claim My \$50 Reward/i }))

      await waitFor(() => {
        expect(useReferralCode).toHaveBeenCalledWith('REF-VALID1', 'Friend Name', 'friend@test.com', '')
      })
    })

    it('shows success message after using code', async () => {
      validateReferralCode.mockResolvedValue({
        valid: true,
        referrer: { name: 'Test Referrer', id: 'ref123', code: 'REF-VALID1' }
      })
      useReferralCode.mockResolvedValue({
        success: true,
        data: { referrerName: 'Test Referrer', rewards: { referrer: 50, friend: 50 } }
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-VALID1')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText('Jane Smith'), 'Friend')
      await user.type(screen.getByPlaceholderText('jane@university.edu'), 'friend@test.com')
      await user.click(screen.getByRole('button', { name: /Claim My \$50 Reward/i }))

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Awesome! You and Test Referrer will both receive $50!')
      })
    })

    it('shows error for already used email', async () => {
      validateReferralCode.mockResolvedValue({
        valid: true,
        referrer: { name: 'Test Referrer', id: 'ref123', code: 'REF-VALID1' }
      })
      useReferralCode.mockResolvedValue({
        success: false,
        error: 'This email has already used a referral code'
      })

      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('REF-XXXXXX'), 'REF-VALID1')
      await user.click(screen.getByRole('button', { name: /Check/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument()
      })

      await user.type(screen.getByPlaceholderText('Jane Smith'), 'Used')
      await user.type(screen.getByPlaceholderText('jane@university.edu'), 'used@test.com')
      await user.click(screen.getByRole('button', { name: /Claim My \$50 Reward/i }))

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('This email has already used a referral code')
      })
    })

    it('code input converts to uppercase', async () => {
      const user = userEvent.setup()

      const codeInput = screen.getByPlaceholderText('REF-XXXXXX')
      await user.type(codeInput, 'ref-abc123')

      expect(codeInput).toHaveValue('REF-ABC123')
    })
  })

  // ==================== Navigation Tests ====================
  describe('Navigation', () => {
    it('home link goes to /', () => {
      renderWithRouter(<Referral />)
      const homeLinks = screen.getAllByRole('link', { name: /Home/i })
      expect(homeLinks[0]).toHaveAttribute('href', '/')
    })

    it('tools link goes to /tools', () => {
      renderWithRouter(<Referral />)
      const toolsLink = screen.getByRole('link', { name: /Free Tools/i })
      expect(toolsLink).toHaveAttribute('href', '/tools')
    })

    it('logo link goes to /', () => {
      renderWithRouter(<Referral />)
      const logoLink = screen.getByRole('link', { name: /AgentChains\.ai/i })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('get project help button goes to /', () => {
      renderWithRouter(<Referral />)
      const helpLink = screen.getByRole('link', { name: /Get Project Help/i })
      expect(helpLink).toHaveAttribute('href', '/')
    })
  })
})
