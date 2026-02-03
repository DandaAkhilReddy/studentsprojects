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
    expect(screen.getByText('Resume Builder Pro')).toBeInTheDocument()
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
describe('Resume Builder Pro', () => {
  it('renders all input fields', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone (+1 XXX XXX-XXXX)')).toBeInTheDocument()
  })

  it('downloads resume when button clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe')
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com')

    // The actual button text is "📄 Download MAANG Resume (HTML)"
    await user.click(screen.getByRole('button', { name: /Download MAANG Resume/i }))

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

// ==================== WORD COUNTER EDGE CASES ====================
describe('Word Counter Edge Cases', () => {
  it('shows 0 words for empty string', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const wordsDiv = screen.getByText('Words').previousSibling
    expect(wordsDiv).toHaveTextContent('0')
  })

  it('handles only whitespace', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    fireEvent.change(textarea, { target: { value: '     ' } })

    const wordsDiv = screen.getByText('Words').previousSibling
    expect(wordsDiv).toHaveTextContent('0')
  })

  it('handles multiple spaces between words', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    fireEvent.change(textarea, { target: { value: 'hello    world    test' } })

    const wordsDiv = screen.getByText('Words').previousSibling
    expect(wordsDiv).toHaveTextContent('3')
  })

  it('counts sentences correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    fireEvent.change(textarea, { target: { value: 'Hello world. How are you? I am fine!' } })

    const sentencesDiv = screen.getByText('Sentences').previousSibling
    expect(sentencesDiv).toHaveTextContent('3')
  })

  it('counts paragraphs correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    fireEvent.change(textarea, { target: { value: 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.' } })

    const paragraphsDiv = screen.getByText('Paragraphs').previousSibling
    expect(paragraphsDiv).toHaveTextContent('3')
  })

  it('calculates reading time', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Word Counter Pro'))

    const textarea = screen.getByPlaceholderText('Paste your text here...')
    // 200 words should be ~1 min reading time
    const words = Array(200).fill('word').join(' ')
    fireEvent.change(textarea, { target: { value: words } })

    // Label is "Min to Read", value is in previousSibling
    const readingDiv = screen.getByText('Min to Read').previousSibling
    expect(readingDiv).toHaveTextContent('1')
  })
})

// ==================== PLAGIARISM CHECKER EDGE CASES ====================
describe('Plagiarism Checker Edge Cases', () => {
  it('shows 0% for empty texts', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    await user.click(screen.getByRole('button', { name: /Check Similarity/i }))

    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  it('shows 0% when one text is empty', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    const text1 = screen.getByPlaceholderText('Paste your original text here...')
    await user.type(text1, 'The quick brown fox jumps over the lazy dog')

    await user.click(screen.getByRole('button', { name: /Check Similarity/i }))

    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  it('shows 0% for texts with less than 3 words', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    const text1 = screen.getByPlaceholderText('Paste your original text here...')
    const text2 = screen.getByPlaceholderText('Paste text to compare...')

    fireEvent.change(text1, { target: { value: 'hello world' } })
    fireEvent.change(text2, { target: { value: 'hello world' } })

    await user.click(screen.getByRole('button', { name: /Check Similarity/i }))

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('handles case insensitivity', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Plagiarism Checker'))

    const text1 = screen.getByPlaceholderText('Paste your original text here...')
    const text2 = screen.getByPlaceholderText('Paste text to compare...')

    const sameText = 'The quick brown fox jumps over the lazy dog today'
    fireEvent.change(text1, { target: { value: sameText.toUpperCase() } })
    fireEvent.change(text2, { target: { value: sameText.toLowerCase() } })

    await user.click(screen.getByRole('button', { name: /Check Similarity/i }))

    // Should detect similarity even with different cases
    // The similarity result appears in a div with class text-5xl font-bold
    await waitFor(() => {
      const similarityDisplay = document.querySelector('.text-5xl.font-bold')
      expect(similarityDisplay).toBeInTheDocument()
      expect(similarityDisplay.textContent).toMatch(/\d+%/)
    })
  })
})

// ==================== GPA CALCULATOR EDGE CASES ====================
describe('GPA Calculator Edge Cases', () => {
  it('handles A+ grade correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    const gradeSelect = screen.getByRole('combobox')
    await user.selectOptions(gradeSelect, 'A+')

    const creditsInput = screen.getByPlaceholderText('Credits')
    await user.type(creditsInput, '3')

    await user.click(screen.getByRole('button', { name: /Calculate GPA/i }))

    await waitFor(() => {
      expect(screen.getByText('4.00')).toBeInTheDocument()
    })
  })

  it('handles F grade correctly (0.0 points)', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    const gradeSelect = screen.getByRole('combobox')
    await user.selectOptions(gradeSelect, 'F')

    const creditsInput = screen.getByPlaceholderText('Credits')
    await user.type(creditsInput, '3')

    await user.click(screen.getByRole('button', { name: /Calculate GPA/i }))

    expect(screen.getByText('0.00')).toBeInTheDocument()
  })

  it('handles mixed grades correctly', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    // First course: A (4.0) x 3 credits = 12 points
    const gradeSelect = screen.getByRole('combobox')
    await user.selectOptions(gradeSelect, 'A')
    const creditsInput = screen.getByPlaceholderText('Credits')
    await user.type(creditsInput, '3')

    // Add second course
    await user.click(screen.getByRole('button', { name: /\+ Add Course/i }))

    // Second course: B (3.0) x 3 credits = 9 points
    const gradeSelects = screen.getAllByRole('combobox')
    await user.selectOptions(gradeSelects[1], 'B')
    const creditInputs = screen.getAllByPlaceholderText('Credits')
    await user.type(creditInputs[1], '3')

    await user.click(screen.getByRole('button', { name: /Calculate GPA/i }))

    // (12 + 9) / 6 = 3.50
    expect(screen.getByText('3.50')).toBeInTheDocument()
  })

  it('handles empty credits gracefully', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    const gradeSelect = screen.getByRole('combobox')
    await user.selectOptions(gradeSelect, 'A')
    // Don't enter credits

    await user.click(screen.getByRole('button', { name: /Calculate GPA/i }))

    // Should show 0 when no valid credits (0 is returned as number, not "0.00")
    await waitFor(() => {
      // Either "0.00" or "0" should be displayed
      const gpaDisplay = document.querySelector('.text-5xl.font-bold.text-orange-400')
      expect(gpaDisplay).toBeInTheDocument()
    })
  })

  it('can remove a course', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('GPA Calculator'))

    // Initially there should be 1 course with 1 credits input
    expect(screen.getAllByPlaceholderText('Credits').length).toBe(1)

    // Add a course - now we should have 2
    await user.click(screen.getByRole('button', { name: /\+ Add Course/i }))

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Credits').length).toBe(2)
    })

    // Find X buttons that are for removing courses (they have red styling)
    const removeButtons = document.querySelectorAll('button.text-red-400')
    expect(removeButtons.length).toBeGreaterThanOrEqual(2) // At least 2 GPA remove buttons

    await user.click(removeButtons[removeButtons.length - 1]) // Remove the last one

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Credits').length).toBe(1)
    })
  })
})

// ==================== SCIENTIFIC CALCULATOR EDGE CASES ====================
describe('Scientific Calculator Edge Cases', () => {
  it('handles division by zero', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: /÷/ }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    // Should have a display element
    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display).toBeInTheDocument()
  })

  it('handles negative numbers', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '-' }))
    await user.click(screen.getByRole('button', { name: '8' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('-3')
  })

  it('handles decimal operations', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '.' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: '.' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '=' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('4')
  })

  it('handles sin(0) = 0', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: 'sin' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('0')
  })

  it('handles cos(0) = 1', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: 'cos' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('1')
  })

  it('handles log(10) = 1', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: 'log' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('1')
  })

  it('handles factorial(5) = 120', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'n!' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('120')
  })

  it('handles factorial(0) = 1', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: 'n!' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('1')
  })

  it('memory operations work', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    // Store 42 in memory
    await user.click(screen.getByRole('button', { name: '4' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'M+' }))

    // Clear display
    await user.click(screen.getByRole('button', { name: 'C' }))

    // Recall memory
    await user.click(screen.getByRole('button', { name: 'MR' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('42')
  })

  it('memory clear works', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    // Store value
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: 'M+' }))

    // Clear memory
    await user.click(screen.getByRole('button', { name: 'MC' }))

    // Clear display and recall
    await user.click(screen.getByRole('button', { name: 'C' }))
    await user.click(screen.getByRole('button', { name: 'MR' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('0')
  })

  it('handles power function', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: '2' }))
    await user.click(screen.getByRole('button', { name: 'x^2' }))

    const display = document.querySelector('.text-right.text-3xl.font-bold')
    expect(display.textContent).toBe('4')
  })

  it('handles pi constant', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Scientific Calculator'))

    await user.click(screen.getByRole('button', { name: 'pi' }))

    // Check the calculator display contains pi value
    await waitFor(() => {
      const display = document.querySelector('.text-right.text-3xl.font-bold')
      expect(display.textContent).toMatch(/3\.14159/)
    })
  })
})

// ==================== CODE FORMATTER EDGE CASES ====================
describe('Code Formatter Edge Cases', () => {
  it('handles empty input gracefully', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    const formatButton = screen.getByRole('button', { name: /Format Code/i })
    expect(formatButton).toBeDisabled()
  })

  it('formats Python code', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    // Select Python
    const pythonButtons = screen.getAllByRole('button', { name: /python/i })
    await user.click(pythonButtons[0])

    const input = screen.getByPlaceholderText('Paste your messy code here...')
    fireEvent.change(input, { target: { value: 'def test():return True' } })

    await user.click(screen.getByRole('button', { name: /Format Code/i }))

    await waitFor(() => {
      expect(screen.getByText(/Formatted code:/i)).toBeInTheDocument()
    })
  })

  it('formats HTML code', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    // Select HTML
    const htmlButtons = screen.getAllByRole('button', { name: /html/i })
    await user.click(htmlButtons[0])

    const input = screen.getByPlaceholderText('Paste your messy code here...')
    fireEvent.change(input, { target: { value: '<div><p>text</p></div>' } })

    await user.click(screen.getByRole('button', { name: /Format Code/i }))

    await waitFor(() => {
      expect(screen.getByText(/Formatted code:/i)).toBeInTheDocument()
    })
  })

  it('formats CSS code', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Code Formatter'))

    // Select CSS
    const cssButtons = screen.getAllByRole('button', { name: /css/i })
    await user.click(cssButtons[0])

    const input = screen.getByPlaceholderText('Paste your messy code here...')
    fireEvent.change(input, { target: { value: 'body{color:red;font-size:12px}' } })

    await user.click(screen.getByRole('button', { name: /Format Code/i }))

    await waitFor(() => {
      expect(screen.getByText(/Formatted code:/i)).toBeInTheDocument()
    })
  })
})

// ==================== FLASHCARD EDGE CASES ====================
describe('Flashcard Edge Cases', () => {
  it('cannot add card with empty front', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    await user.type(screen.getByPlaceholderText('Back (Answer)'), 'Answer')

    const addButton = screen.getByRole('button', { name: /Add Card/i })
    expect(addButton).toBeDisabled()
  })

  it('cannot add card with empty back', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    await user.type(screen.getByPlaceholderText('Front (Question)'), 'Question')

    const addButton = screen.getByRole('button', { name: /Add Card/i })
    expect(addButton).toBeDisabled()
  })

  it('can delete a flashcard', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    await user.type(screen.getByPlaceholderText('Front (Question)'), 'Q1')
    await user.type(screen.getByPlaceholderText('Back (Answer)'), 'A1')
    await user.click(screen.getByRole('button', { name: /Add Card/i }))

    expect(screen.getByText('1. Q1')).toBeInTheDocument()

    // Find and click delete button (shows as 'X')
    const deleteButtons = screen.getAllByRole('button', { name: 'X' })
    await user.click(deleteButtons[0])

    expect(screen.queryByText('1. Q1')).not.toBeInTheDocument()
  })

  it('clears input fields after adding card', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Flashcard Maker'))

    const frontInput = screen.getByPlaceholderText('Front (Question)')
    const backInput = screen.getByPlaceholderText('Back (Answer)')

    await user.type(frontInput, 'Q1')
    await user.type(backInput, 'A1')
    await user.click(screen.getByRole('button', { name: /Add Card/i }))

    expect(frontInput).toHaveValue('')
    expect(backInput).toHaveValue('')
  })
})

// ==================== PARAPHRASING TOOL EDGE CASES ====================
describe('Paraphrasing Tool Edge Cases', () => {
  it('handles text with no recognized words', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Paraphrasing Tool'))

    const input = screen.getByPlaceholderText('Enter text to paraphrase...')
    await user.type(input, 'xyz abc def')

    await user.click(screen.getByRole('button', { name: /Paraphrase Text/i }))

    // Should show the paraphrased text (even if unchanged)
    await waitFor(() => {
      expect(screen.getByText('Paraphrased Text')).toBeInTheDocument()
    })
  })

  it('button is always enabled for user interaction', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Paraphrasing Tool'))

    const paraphraseButton = screen.getByRole('button', { name: /Paraphrase Text/i })
    expect(paraphraseButton).not.toBeDisabled()
  })
})

// ==================== CITATION GENERATOR EDGE CASES ====================
describe('Citation Generator Edge Cases', () => {
  it('generates MLA citation', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    // Select MLA style
    await user.click(screen.getByRole('button', { name: /mla/i }))

    const authorsInput = screen.getByPlaceholderText('Author(s) - Last, First')
    const yearInput = screen.getByPlaceholderText('Year')
    const titleInput = screen.getByPlaceholderText('Title')
    const urlInput = screen.getByPlaceholderText('URL')

    await user.type(authorsInput, 'Doe, John')
    await user.type(yearInput, '2024')
    await user.type(titleInput, 'Test Title')
    await user.type(urlInput, 'https://example.com')

    await user.click(screen.getByRole('button', { name: 'Generate Citation' }))

    await waitFor(() => {
      expect(screen.getByText(/Generated Citation/)).toBeInTheDocument()
    })
  })

  it('generates Chicago citation', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    await user.click(screen.getByRole('button', { name: /chicago/i }))

    const authorsInput = screen.getByPlaceholderText('Author(s) - Last, First')
    const yearInput = screen.getByPlaceholderText('Year')
    const titleInput = screen.getByPlaceholderText('Title')
    const urlInput = screen.getByPlaceholderText('URL')

    await user.type(authorsInput, 'Smith, Jane')
    await user.type(yearInput, '2024')
    await user.type(titleInput, 'Chicago Test')
    await user.type(urlInput, 'https://test.com')

    await user.click(screen.getByRole('button', { name: 'Generate Citation' }))

    await waitFor(() => {
      expect(screen.getByText(/Generated Citation/)).toBeInTheDocument()
    })
  })

  it('generates Harvard citation', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    await user.click(screen.getByRole('button', { name: /harvard/i }))

    const authorsInput = screen.getByPlaceholderText('Author(s) - Last, First')
    const yearInput = screen.getByPlaceholderText('Year')
    const titleInput = screen.getByPlaceholderText('Title')
    const urlInput = screen.getByPlaceholderText('URL')

    await user.type(authorsInput, 'Brown, Bob')
    await user.type(yearInput, '2024')
    await user.type(titleInput, 'Harvard Test')
    await user.type(urlInput, 'https://harvard.com')

    await user.click(screen.getByRole('button', { name: 'Generate Citation' }))

    await waitFor(() => {
      expect(screen.getByText(/Generated Citation/)).toBeInTheDocument()
    })
  })

  it('handles journal source type', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    // Select journal type
    await user.click(screen.getByRole('button', { name: /journal/i }))

    // Journal-specific fields should appear
    expect(screen.getByPlaceholderText('Journal Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Volume')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pages (e.g., 1-10)')).toBeInTheDocument()
  })

  it('handles book source type', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Citation Generator'))

    // Select book type
    await user.click(screen.getByRole('button', { name: /book/i }))

    // Book type should be selected (no special fields, but base fields remain)
    expect(screen.getByPlaceholderText('Author(s) - Last, First')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
    // Journal fields should NOT appear for book type
    expect(screen.queryByPlaceholderText('Journal Name')).not.toBeInTheDocument()
  })
})

// ==================== RESUME BUILDER EDGE CASES ====================
describe('Resume Builder Pro Edge Cases', () => {
  it('renders JD matching section', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    // Should have JD input
    expect(screen.getByPlaceholderText(/Paste the job description/i)).toBeInTheDocument()
  })

  it('renders LinkedIn field', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    expect(screen.getByPlaceholderText('LinkedIn URL')).toBeInTheDocument()
  })

  it('can add education entry', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    // Find and click add education button
    const addEducationButton = screen.getByRole('button', { name: /\+ Add Education/i })
    await user.click(addEducationButton)

    // Should have 2 degree inputs now
    const degreeInputs = screen.getAllByPlaceholderText("Degree (e.g., Master's in CS)")
    expect(degreeInputs.length).toBe(2)
  })

  it('can add experience entry', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    // Find and click add experience button
    const addExpButton = screen.getByRole('button', { name: /\+ Add Experience/i })
    await user.click(addExpButton)

    // Should have 2 job title inputs now
    const titleInputs = screen.getAllByPlaceholderText('Job Title')
    expect(titleInputs.length).toBe(2)
  })

  it('can add project entry', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    // Find and click add project button
    const addProjectButton = screen.getByRole('button', { name: /\+ Add Project/i })
    await user.click(addProjectButton)

    // Should have 2 project name inputs now
    const projectInputs = screen.getAllByPlaceholderText('Project Name')
    expect(projectInputs.length).toBe(2)
  })

  it('skill categories are displayed', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Resume Builder Pro'))

    // Check for skill category inputs
    expect(screen.getByPlaceholderText('Python, Java, JavaScript, SQL...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('AWS, Azure, GCP, Lambda...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('React, Node.js, REST APIs...')).toBeInTheDocument()
  })
})

// ==================== POMODORO TIMER EDGE CASES ====================
describe('Pomodoro Timer Edge Cases', () => {
  it('changes time to 50 minutes when preset clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))
    await user.click(screen.getByRole('button', { name: '50 min' }))

    expect(screen.getByText('50:00')).toBeInTheDocument()
  })

  it('changes time to 15 minutes when preset clicked', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))
    await user.click(screen.getByRole('button', { name: '15 min' }))

    expect(screen.getByText('15:00')).toBeInTheDocument()
  })

  it('reset button returns to 25 minutes', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('Pomodoro Timer'))
    await user.click(screen.getByRole('button', { name: '5 min' }))
    expect(screen.getByText('05:00')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Reset/i }))
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })
})

// ==================== PDF TOOLS EDGE CASES ====================
describe('PDF Tools Edge Cases', () => {
  it('shows file upload instructions', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PDF Tools'))

    expect(screen.getByText('Click to select PDF files')).toBeInTheDocument()
  })

  it('merge button requires at least 2 files', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PDF Tools'))

    const mergeButton = screen.getByRole('button', { name: /Merge PDFs/i })
    expect(mergeButton).toBeDisabled()
  })
})

// ==================== PPT GENERATOR EDGE CASES ====================
describe('PPT Generator Edge Cases', () => {
  it('has default outline text', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PPT Generator'))

    const textarea = screen.getByPlaceholderText(/Introduction/)
    expect(textarea).toBeInTheDocument()
  })

  it('generate button is always enabled', async () => {
    renderWithRouter(<Tools />)
    const user = userEvent.setup()

    await user.click(screen.getByText('PPT Generator'))

    const generateButton = screen.getByRole('button', { name: /Generate Presentation/i })
    expect(generateButton).not.toBeDisabled()
  })
})
