import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pricing from '../Pricing'

describe('Pricing Component', () => {
  const mockOnGetStarted = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==================== Rendering Tests ====================
  describe('Rendering', () => {
    it('renders section title', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText('Simple, Transparent Pricing')).toBeInTheDocument()
    })

    it('renders subtitle', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText('No hidden fees. No surprises. Just results.')).toBeInTheDocument()
    })

    it('renders all 3 project packages', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText('Code Only')).toBeInTheDocument()
      expect(screen.getByText('Docs Only')).toBeInTheDocument()
      expect(screen.getByText('Complete Package')).toBeInTheDocument()
    })

    it('renders "Most Popular" badge on Complete Package', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText(/MOST POPULAR/)).toBeInTheDocument()
    })
  })

  // ==================== Price Display Tests ====================
  describe('Price Display', () => {
    it('displays package prices correctly', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      // Use getAllByText since some prices appear multiple times (as original and discounted)
      expect(screen.getAllByText('$299').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('$349').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('$399').length).toBeGreaterThanOrEqual(1)
    })

    it('displays original prices with strikethrough styling', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      // Original prices should be in the document
      const strikethroughElements = document.querySelectorAll('.line-through')
      expect(strikethroughElements.length).toBeGreaterThanOrEqual(3)
    })

    it('displays assignment price range', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText('$25–$50')).toBeInTheDocument()
    })
  })

  // ==================== Assignment Card Tests ====================
  describe('Assignment Card', () => {
    it('renders assignment card', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText('Individual Assignments')).toBeInTheDocument()
    })

    it('displays assignment description', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText(/Any subject, any topic/)).toBeInTheDocument()
    })

    it('displays subject-wise pricing text', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByText('subject-wise pricing')).toBeInTheDocument()
    })

    it('renders Order Now button for assignments', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      expect(screen.getByRole('button', { name: 'Order Now' })).toBeInTheDocument()
    })
  })

  // ==================== Button Click Tests ====================
  describe('Button Clicks', () => {
    it('calls onGetStarted when Get Started buttons are clicked', async () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      const user = userEvent.setup()

      const getStartedButtons = screen.getAllByRole('button', { name: 'Get Started' })
      await user.click(getStartedButtons[0])

      expect(mockOnGetStarted).toHaveBeenCalled()
    })

    it('calls onGetStarted when Order Now button is clicked', async () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: 'Order Now' }))

      expect(mockOnGetStarted).toHaveBeenCalled()
    })

    it('has 4 total CTA buttons (3 packages + 1 assignment)', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      const getStartedButtons = screen.getAllByRole('button', { name: 'Get Started' })
      const orderNowButton = screen.getByRole('button', { name: 'Order Now' })

      expect(getStartedButtons.length).toBe(3)
      expect(orderNowButton).toBeInTheDocument()
    })
  })

  // ==================== Features Tests ====================
  describe('Package Features', () => {
    it('displays checkmarks for features', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      const checkmarks = screen.getAllByText('✓')
      expect(checkmarks.length).toBeGreaterThan(0)
    })

    it('displays package icons', () => {
      render(<Pricing onGetStarted={mockOnGetStarted} />)
      // Icons from packages.js
      expect(screen.getByText('💻')).toBeInTheDocument()
      expect(screen.getByText('📄')).toBeInTheDocument()
      expect(screen.getByText('🚀')).toBeInTheDocument()
    })
  })
})
