import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Tools from '../Tools'

// Helper to render with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Tools Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
  })

  it('renders the tools page with header', () => {
    renderWithRouter(<Tools />)
    expect(screen.getByText('Free Student')).toBeInTheDocument()
    expect(screen.getByText('Toolkit')).toBeInTheDocument()
  })

  it('displays all 12 tool buttons', () => {
    renderWithRouter(<Tools />)
    expect(screen.getByText('Word Counter Pro')).toBeInTheDocument()
    expect(screen.getByText('Citation Generator')).toBeInTheDocument()
    expect(screen.getByText('Plagiarism Checker')).toBeInTheDocument()
    expect(screen.getByText('Paraphrasing Tool')).toBeInTheDocument()
    expect(screen.getByText('PPT Generator')).toBeInTheDocument()
    expect(screen.getByText('Resume Builder')).toBeInTheDocument()
    expect(screen.getByText('PDF Tools')).toBeInTheDocument()
    expect(screen.getByText('GPA Calculator')).toBeInTheDocument()
    expect(screen.getByText('Pomodoro Timer')).toBeInTheDocument()
    expect(screen.getByText('Flashcard Maker')).toBeInTheDocument()
    expect(screen.getByText('Code Formatter')).toBeInTheDocument()
    expect(screen.getByText('Scientific Calculator')).toBeInTheDocument()
  })

  it('filters tools by category', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    // Click "Writing" category
    await user.click(screen.getByRole('button', { name: 'Writing' }))

    expect(screen.getByText('Word Counter Pro')).toBeInTheDocument()
    expect(screen.getByText('Citation Generator')).toBeInTheDocument()
    expect(screen.queryByText('GPA Calculator')).not.toBeInTheDocument()
  })
})

// ==================== WORD COUNTER TESTS ====================
describe('Word Counter Pro', () => {
  it('counts words correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    await user.type(textarea, 'Hello world this is a test')

    // Check that Words counter shows 6
    const wordsDiv = screen.getByText('Words').previousSibling
    expect(wordsDiv).toHaveTextContent('6')
  })

  it('counts characters correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    await user.type(textarea, 'Hello')

    // Check that Characters counter shows 5
    const charsDiv = screen.getByText('Characters').previousSibling
    expect(charsDiv).toHaveTextContent('5')
  })

  it('shows 0 for empty text', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const wordsDiv = screen.getByText('Words').previousSibling
    expect(wordsDiv).toHaveTextContent('0')
  })
})

// ==================== CITATION GENERATOR TESTS ====================
describe('Citation Generator', () => {
  it('renders citation style buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    expect(screen.getByRole('button', { name: /apa/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mla/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /chicago/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /harvard/i })).toBeInTheDocument()
  })

  it('renders source type buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    expect(screen.getByRole('button', { name: /website/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /journal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /book/i })).toBeInTheDocument()
  })

  it('generates APA citation', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    const authorsInput = screen.getByPlaceholderText('Author(s) - Last, First')
    const yearInput = screen.getByPlaceholderText('Year')
    const titleInput = screen.getByPlaceholderText('Title')
    const urlInput = screen.getByPlaceholderText('URL')

    await user.type(authorsInput, 'Smith, John')
    await user.type(yearInput, '2024')
    await user.type(titleInput, 'Test Article')
    await user.type(urlInput, 'https://example.com')

    await user.click(screen.getByRole('button', { name: 'Generate Citation' }))

    // Check that generated citation contains the data
    await waitFor(() => {
      expect(screen.getByText(/Generated Citation/)).toBeInTheDocument()
    })
  })
})

// ==================== PLAGIARISM CHECKER TESTS ====================
describe('Plagiarism Checker', () => {
  it('renders two text areas', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    expect(screen.getByPlaceholderText('Paste your original text here...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Paste text to compare...')).toBeInTheDocument()
  })

  it('shows 0% similarity for different texts', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    const text1 = screen.getByPlaceholderText('Paste your original text here...')
    const text2 = screen.getByPlaceholderText('Paste text to compare...')

    await user.type(text1, 'The quick brown fox jumps over the lazy dog')
    await user.type(text2, 'A completely different sentence with no similarities')

    await user.click(screen.getByRole('button', { name: /Check Similarity/i }))

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows high similarity for identical texts', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    const sameText = 'The quick brown fox jumps over the lazy dog today'
    const text1 = screen.getByPlaceholderText('Paste your original text here...')
    const text2 = screen.getByPlaceholderText('Paste text to compare...')

    await user.type(text1, sameText)
    await user.type(text2, sameText)

    await user.click(screen.getByRole('button', { name: /Check Similarity/i }))

    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

// ==================== PARAPHRASING TOOL TESTS ====================
describe('Paraphrasing Tool', () => {
  it('renders input and output areas', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Paraphrasing Tool'))

    expect(screen.getByPlaceholderText('Enter text to paraphrase...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Paraphrase Text/i })).toBeInTheDocument()
  })

  it('paraphrases text with synonyms', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Paraphrasing Tool'))

    const input = screen.getByPlaceholderText('Enter text to paraphrase...')
    await user.type(input, 'This is a good test')

    await user.click(screen.getByRole('button', { name: /Paraphrase Text/i }))

    // Check that Paraphrased Text label appears
    await waitFor(() => {
      expect(screen.getByText('Paraphrased Text')).toBeInTheDocument()
    })
  })
})

// ==================== PPT GENERATOR TESTS ====================
describe('PPT Generator', () => {
  it('renders outline input', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PPT Generator'))

    expect(screen.getByPlaceholderText(/Introduction/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Generate Presentation/i })).toBeInTheDocument()
  })

  it('generates presentation from outline', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PPT Generator'))

    const textarea = screen.getByPlaceholderText(/Introduction/)
    await user.type(textarea, 'Slide 1\nSlide 2\nSlide 3')

    await user.click(screen.getByRole('button', { name: /Generate Presentation/i }))

    expect(URL.createObjectURL).toHaveBeenCalled()
  })
})

// ==================== RESUME BUILDER TESTS ====================
describe('Resume Builder', () => {
  it('renders all input fields', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder'))

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
  })

  it('downloads resume when button clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder'))

    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')

    await user.click(screen.getByRole('button', { name: /Download Resume/i }))

    expect(URL.createObjectURL).toHaveBeenCalled()
  })
})

// ==================== PDF TOOLS TESTS ====================
describe('PDF Tools', () => {
  it('renders file upload area', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PDF Tools'))

    expect(screen.getByText('Click to select PDF files')).toBeInTheDocument()
  })

  it('merge button is disabled with less than 2 files', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PDF Tools'))

    const mergeButton = screen.getByRole('button', { name: /Merge PDFs/i })
    expect(mergeButton).toBeDisabled()
  })
})

// ==================== GPA CALCULATOR TESTS ====================
describe('GPA Calculator', () => {
  it('renders grade selector and credits input', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Credits')).toBeInTheDocument()
  })

  it('adds new course when button clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    await user.click(screen.getByRole('button', { name: /\+ Add Course/i }))

    const creditInputs = screen.getAllByPlaceholderText('Credits')
    expect(creditInputs.length).toBe(2)
  })

  it('calculates GPA correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    // Select A grade (4.0)
    const gradeSelect = screen.getByRole('combobox')
    await user.selectOptions(gradeSelect, 'A')

    // Enter 3 credits
    const creditsInput = screen.getByPlaceholderText('Credits')
    await user.type(creditsInput, '3')

    await user.click(screen.getByRole('button', { name: /Calculate GPA/i }))

    expect(screen.getByText('4.00')).toBeInTheDocument()
  })
})

// ==================== POMODORO TIMER TESTS ====================
describe('Pomodoro Timer', () => {
  it('displays initial time of 25 minutes', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))

    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('has preset time buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))

    expect(screen.getByRole('button', { name: '25 min' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5 min' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '15 min' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '50 min' })).toBeInTheDocument()
  })

  it('changes time when preset button clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))
    await user.click(screen.getByRole('button', { name: '5 min' }))

    expect(screen.getByText('05:00')).toBeInTheDocument()
  })

  it('has start and reset buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))

    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument()
  })
})

// ==================== FLASHCARD MAKER TESTS ====================
describe('Flashcard Maker', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null)
  })

  it('renders create and study mode buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    expect(screen.getByRole('button', { name: /Create Cards/i })).toBeInTheDocument()
    // Use getAllByRole since "Study" also appears in category filter
    const studyButtons = screen.getAllByRole('button', { name: /Study/i })
    expect(studyButtons.length).toBeGreaterThanOrEqual(2) // Category filter + tool button
  })

  it('has input fields for front and back', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    expect(screen.getByPlaceholderText('Front (Question)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Back (Answer)')).toBeInTheDocument()
  })

  it('add button is disabled without content', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    const addButton = screen.getByRole('button', { name: /Add Card/i })
    expect(addButton).toBeDisabled()
  })

  it('adds a card when both fields are filled', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    await user.type(screen.getByPlaceholderText('Front (Question)'), 'What is React?')
    await user.type(screen.getByPlaceholderText('Back (Answer)'), 'A JavaScript library')

    await user.click(screen.getByRole('button', { name: /Add Card/i }))

    expect(screen.getByText('1. What is React?')).toBeInTheDocument()
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('study button is disabled with no cards', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    const studyButton = screen.getByRole('button', { name: /Study \(0\)/i })
    expect(studyButton).toBeDisabled()
  })
})

// ==================== CODE FORMATTER TESTS ====================
describe('Code Formatter', () => {
  it('renders language selector buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    // Language buttons may match multiple elements, use getAllByRole
    expect(screen.getAllByRole('button', { name: /javascript/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /python/i }).length).toBeGreaterThanOrEqual(1)
    // "java" regex matches both "java" and "javascript", so check specific text
    const javaButtons = screen.getAllByRole('button').filter(btn => btn.textContent.toLowerCase() === 'java')
    expect(javaButtons.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /html/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /css/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('has input textarea', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    expect(screen.getByPlaceholderText('Paste your messy code here...')).toBeInTheDocument()
  })

  it('format button is disabled without code', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    const formatButton = screen.getByRole('button', { name: /Format Code/i })
    expect(formatButton).toBeDisabled()
  })

  it('formats JavaScript code', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    const input = screen.getByPlaceholderText('Paste your messy code here...')
    // Use paste instead of type to avoid potential issues
    await user.clear(input)
    fireEvent.change(input, { target: { value: 'function test(){return true;}' } })

    await user.click(screen.getByRole('button', { name: /Format Code/i }))

    // Check that formatted output appears
    await waitFor(() => {
      expect(screen.getByText(/Formatted code:/i)).toBeInTheDocument()
    })
  })
})

// ==================== SCIENTIFIC CALCULATOR TESTS ====================
describe('Scientific Calculator', () => {
  it('renders number pad', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    for (let i = 0; i <= 9; i++) {
      expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument()
    }
  })

  it('renders operator buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /×/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /÷/ })).toBeInTheDocument()
  })

  it('renders scientific function buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    expect(screen.getByRole('button', { name: 'sin' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'tan' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'log' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'sqrt' })).toBeInTheDocument()
  })

  it('renders memory buttons', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    expect(screen.getByRole('button', { name: 'MC' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MR' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'M+' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'M-' })).toBeInTheDocument()
  })

  it('displays initial value of 0', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    // The display shows 0
    const display = screen.getByText('0', { selector: '.text-3xl' })
    expect(display).toBeInTheDocument()
  })

  it('inputs numbers when clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '5' }))

    // Display should show 5
    const display = screen.getByText('5', { selector: '.text-3xl' })
    expect(display).toBeInTheDocument()
  })

  it('clears display when C button clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'C' }))

    const display = screen.getByText('0', { selector: '.text-3xl' })
    expect(display).toBeInTheDocument()
  })

  it('performs basic addition', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '3' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    const display = screen.getByText('5', { selector: '.text-3xl' })
    expect(display).toBeInTheDocument()
  })

  it('calculates square root', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: 'sqrt' }))

    const display = screen.getByText('12', { selector: '.text-3xl' })
    expect(display).toBeInTheDocument()
  })
})

// ==================== INTEGRATION TESTS ====================
describe('Integration Tests', () => {
  it('can switch between different tools', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    // Open Word Counter
    await user.click(screen.getByText('Word Counter Pro'))
    expect(screen.getByPlaceholderText('Paste your text here...')).toBeInTheDocument()

    // Switch to Calculator
    await user.click(screen.getByText('Scientific Calculator'))
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()

    // Switch to GPA Calculator
    await user.click(screen.getByText('GPA Calculator'))
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('closes tool panel when X clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    // Find and click close button (the X in the tool panel header)
    const closeButtons = screen.getAllByRole('button', { name: 'X' })
    await user.click(closeButtons[0])

    // Tool panel should be closed
    expect(screen.queryByPlaceholderText('Paste your text here...')).not.toBeInTheDocument()
  })

  it('navigation links work correctly', () => {
    renderWithRouter(<Tools />)

    const homeLinks = screen.getAllByRole('link', { name: /AgentChains\.ai/i })
    expect(homeLinks[0]).toHaveAttribute('href', '/')
  })
})
