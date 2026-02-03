import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ReferralProgram from '../ReferralProgram'

// Helper to render with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ReferralProgram Component', () => {
  // ==================== Rendering Tests ====================
  describe('Rendering', () => {
    it('renders the section', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/Referral Program/)).toBeInTheDocument()
    })

    it('displays $50 reward amounts', () => {
      renderWithRouter(<ReferralProgram />)
      const fiftyDollarElements = screen.getAllByText('$50')
      expect(fiftyDollarElements.length).toBeGreaterThanOrEqual(2)
    })

    it('renders the main heading', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/You Get \$50 \+ Friend Gets \$50/)).toBeInTheDocument()
    })

    it('renders the "POPULAR" badge', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/POPULAR/)).toBeInTheDocument()
    })
  })

  // ==================== Info Cards Tests ====================
  describe('Info Cards', () => {
    it('renders 3 info cards', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText('You Get')).toBeInTheDocument()
      expect(screen.getByText('Friend Gets')).toBeInTheDocument()
      expect(screen.getByText('Unlimited Referrals')).toBeInTheDocument()
    })

    it('displays "No Limit" text', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText('No Limit')).toBeInTheDocument()
    })

    it('shows earnings example (10 friends = $500)', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/10 friends = \$500/)).toBeInTheDocument()
    })
  })

  // ==================== CTA Button Tests ====================
  describe('CTA Button', () => {
    it('renders "Get Your Referral Code" button', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/Get Your Referral Code/)).toBeInTheDocument()
    })

    it('button links to /referral page', () => {
      renderWithRouter(<ReferralProgram />)
      const link = screen.getByRole('link', { name: /Get Your Referral Code/ })
      expect(link).toHaveAttribute('href', '/referral')
    })
  })

  // ==================== Content Tests ====================
  describe('Content', () => {
    it('displays description text', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/Share your unique code/)).toBeInTheDocument()
    })

    it('displays "no customer needed" text', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText(/Don't even need to be a customer/)).toBeInTheDocument()
    })

    it('displays emoji icons', () => {
      renderWithRouter(<ReferralProgram />)
      expect(screen.getByText('💵')).toBeInTheDocument()
      expect(screen.getByText('🎁')).toBeInTheDocument()
      expect(screen.getByText('♾️')).toBeInTheDocument()
    })
  })
})
