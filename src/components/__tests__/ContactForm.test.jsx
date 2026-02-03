import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../ContactForm'

// Mock useFormSubmit hook
const mockSubmitForm = vi.fn()
vi.mock('../../hooks/useFormSubmit', () => ({
  useFormSubmit: vi.fn((onSuccess) => ({
    submitForm: mockSubmitForm.mockImplementation(async (data) => {
      onSuccess?.()
      return true
    }),
    isSubmitting: false
  }))
}))

import { useFormSubmit } from '../../hooks/useFormSubmit'

describe('ContactForm Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useFormSubmit.mockImplementation((onSuccess) => ({
      submitForm: mockSubmitForm.mockImplementation(async (data) => {
        onSuccess?.()
        return true
      }),
      isSubmitting: false
    }))
  })

  // ==================== Rendering Tests ====================
  describe('Rendering', () => {
    it('renders modal overlay', () => {
      render(<ContactForm onClose={mockOnClose} />)
      // Check for the overlay div
      const overlay = document.querySelector('.fixed.inset-0')
      expect(overlay).toBeInTheDocument()
    })

    it('renders form title "Get Started"', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByText('Get Started')).toBeInTheDocument()
    })

    it('renders close button', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByText('×')).toBeInTheDocument()
    })

    it('renders service type buttons', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByText('Project')).toBeInTheDocument()
      expect(screen.getByText('Assignment')).toBeInTheDocument()
    })

    it('renders all form fields', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('john@university.edu')).toBeInTheDocument()
      // Phone and WhatsApp both have same placeholder, so use getAllBy
      expect(screen.getAllByPlaceholderText('+1 234 567 8900').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByPlaceholderText('University of Kansas')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Software Engineering')).toBeInTheDocument()
    })

    it('renders submit button', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByRole('button', { name: /Submit Request/i })).toBeInTheDocument()
    })

    it('renders security notice', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByText(/Your information is secure/)).toBeInTheDocument()
    })
  })

  // ==================== Close Button Tests ====================
  describe('Close Button', () => {
    it('calls onClose when X button clicked', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('×'))

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  // ==================== Service Type Selection Tests ====================
  describe('Service Type Selection', () => {
    it('project button selects project service', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const projectButton = screen.getByText('Project').closest('button')
      await user.click(projectButton)

      expect(projectButton.className).toContain('border-orange-500')
    })

    it('assignment button selects assignment service', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const assignmentButton = screen.getByText('Assignment').closest('button')
      await user.click(assignmentButton)

      expect(assignmentButton.className).toContain('border-green-500')
    })

    it('shows package selection for project', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const projectButton = screen.getByText('Project').closest('button')
      await user.click(projectButton)

      expect(screen.getByText('Code Only')).toBeInTheDocument()
      expect(screen.getByText('Docs Only')).toBeInTheDocument()
      expect(screen.getByText('Complete')).toBeInTheDocument()
    })

    it('hides package selection for assignment', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      // First select project to show packages
      const projectButton = screen.getByText('Project').closest('button')
      await user.click(projectButton)
      expect(screen.getByText('Code Only')).toBeInTheDocument()

      // Then select assignment
      const assignmentButton = screen.getByText('Assignment').closest('button')
      await user.click(assignmentButton)

      expect(screen.queryByText('Code Only')).not.toBeInTheDocument()
    })
  })

  // ==================== Package Selection Tests ====================
  describe('Package Selection', () => {
    it('code package can be selected', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Project').closest('button'))
      await user.click(screen.getByText('Code Only').closest('button'))

      const codeButton = screen.getByText('Code Only').closest('button')
      expect(codeButton.className).toContain('border-blue-500')
    })

    it('docs package can be selected', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Project').closest('button'))
      await user.click(screen.getByText('Docs Only').closest('button'))

      const docsButton = screen.getByText('Docs Only').closest('button')
      expect(docsButton.className).toContain('border-blue-500')
    })

    it('complete package can be selected', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Project').closest('button'))
      await user.click(screen.getByText('Complete').closest('button'))

      const completeButton = screen.getByText('Complete').closest('button')
      expect(completeButton.className).toContain('border-orange-500')
    })
  })

  // ==================== Form Input Tests ====================
  describe('Form Inputs', () => {
    it('name field accepts input', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const nameInput = screen.getByPlaceholderText('John Doe')
      await user.type(nameInput, 'Test User')

      expect(nameInput).toHaveValue('Test User')
    })

    it('email field accepts input', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const emailInput = screen.getByPlaceholderText('john@university.edu')
      await user.type(emailInput, 'test@test.com')

      expect(emailInput).toHaveValue('test@test.com')
    })

    it('phone field accepts input', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 8900')
      await user.type(phoneInputs[0], '555-1234')

      expect(phoneInputs[0]).toHaveValue('555-1234')
    })

    it('course name field accepts input', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const courseInput = screen.getByPlaceholderText('Software Engineering')
      await user.type(courseInput, 'Computer Science')

      expect(courseInput).toHaveValue('Computer Science')
    })

    it('message field accepts input', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const messageInput = screen.getByPlaceholderText(/Tell us about your requirements/)
      await user.type(messageInput, 'Test message')

      expect(messageInput).toHaveValue('Test message')
    })
  })

  // ==================== Form Submission Tests ====================
  describe('Form Submission', () => {
    it('calls submitForm with form data on submit', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      // Fill required fields
      await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 8900')
      await user.type(phoneInputs[0], '555-1234')
      await user.type(screen.getByPlaceholderText('Software Engineering'), 'CS 101')

      // Select service type
      await user.click(screen.getByText('Assignment').closest('button'))

      // Submit
      await user.click(screen.getByRole('button', { name: /Submit Request/i }))

      await waitFor(() => {
        expect(mockSubmitForm).toHaveBeenCalled()
        const submittedData = mockSubmitForm.mock.calls[0][0]
        expect(submittedData.name).toBe('Test User')
        expect(submittedData.email).toBe('test@test.com')
        expect(submittedData.serviceType).toBe('assignment')
      })
    })

    it('clears form on successful submission', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      const nameInput = screen.getByPlaceholderText('John Doe')
      await user.type(nameInput, 'Test User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 8900')
      await user.type(phoneInputs[0], '555-1234')
      await user.type(screen.getByPlaceholderText('Software Engineering'), 'CS 101')
      await user.click(screen.getByText('Assignment').closest('button'))

      await user.click(screen.getByRole('button', { name: /Submit Request/i }))

      await waitFor(() => {
        expect(nameInput).toHaveValue('')
      })
    })

    it('closes modal on successful submission', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      await user.type(screen.getByPlaceholderText('John Doe'), 'Test User')
      await user.type(screen.getByPlaceholderText('john@university.edu'), 'test@test.com')
      const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 8900')
      await user.type(phoneInputs[0], '555-1234')
      await user.type(screen.getByPlaceholderText('Software Engineering'), 'CS 101')
      await user.click(screen.getByText('Assignment').closest('button'))

      await user.click(screen.getByRole('button', { name: /Submit Request/i }))

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })
  })

  // ==================== Loading State Tests ====================
  describe('Loading State', () => {
    it('shows submitting text when isSubmitting is true', () => {
      useFormSubmit.mockReturnValue({
        submitForm: mockSubmitForm,
        isSubmitting: true
      })

      render(<ContactForm onClose={mockOnClose} />)

      expect(screen.getByText('Submitting...')).toBeInTheDocument()
    })

    it('submit button is disabled when isSubmitting is true', () => {
      useFormSubmit.mockReturnValue({
        submitForm: mockSubmitForm,
        isSubmitting: true
      })

      render(<ContactForm onClose={mockOnClose} />)

      const submitButton = screen.getByRole('button', { name: /Submitting/i })
      expect(submitButton).toBeDisabled()
    })

    it('submit button is enabled when not submitting', () => {
      render(<ContactForm onClose={mockOnClose} />)

      const submitButton = screen.getByRole('button', { name: /Submit Request/i })
      expect(submitButton).not.toBeDisabled()
    })
  })

  // ==================== Required Fields Tests ====================
  describe('Required Fields', () => {
    it('name field is required', () => {
      render(<ContactForm onClose={mockOnClose} />)
      const nameInput = screen.getByPlaceholderText('John Doe')
      expect(nameInput).toHaveAttribute('required')
    })

    it('email field is required', () => {
      render(<ContactForm onClose={mockOnClose} />)
      const emailInput = screen.getByPlaceholderText('john@university.edu')
      expect(emailInput).toHaveAttribute('required')
    })

    it('phone field is required', () => {
      render(<ContactForm onClose={mockOnClose} />)
      const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 8900')
      expect(phoneInputs[0]).toHaveAttribute('required')
    })

    it('course name field is required', () => {
      render(<ContactForm onClose={mockOnClose} />)
      const courseInput = screen.getByPlaceholderText('Software Engineering')
      expect(courseInput).toHaveAttribute('required')
    })

    it('whatsapp field is optional', () => {
      render(<ContactForm onClose={mockOnClose} />)
      const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 8900')
      // Second phone input is WhatsApp
      expect(phoneInputs[1]).not.toHaveAttribute('required')
    })

    it('university field is optional', () => {
      render(<ContactForm onClose={mockOnClose} />)
      const universityInput = screen.getByPlaceholderText('University of Kansas')
      expect(universityInput).not.toHaveAttribute('required')
    })
  })

  // ==================== Price Display Tests ====================
  describe('Price Display', () => {
    it('shows project price as "From $199"', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByText('From $199')).toBeInTheDocument()
    })

    it('shows assignment price as "Only $49"', () => {
      render(<ContactForm onClose={mockOnClose} />)
      expect(screen.getByText('Only $49')).toBeInTheDocument()
    })

    it('shows package prices when project is selected', async () => {
      render(<ContactForm onClose={mockOnClose} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Project').closest('button'))

      expect(screen.getByText('$199')).toBeInTheDocument()
      expect(screen.getByText('$299')).toBeInTheDocument()
    })
  })
})
