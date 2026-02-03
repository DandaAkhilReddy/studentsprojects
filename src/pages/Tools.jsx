import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

const Tools = () => {
  const [activeTool, setActiveTool] = useState(null);

  // Tool States
  const [wordCountText, setWordCountText] = useState('');
  const [citationData, setCitationData] = useState({ type: 'website', authors: '', title: '', year: '', url: '', journal: '', volume: '', pages: '' });
  const [citationStyle, setCitationStyle] = useState('apa');
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [plagiarismText1, setPlagiarismText1] = useState('');
  const [plagiarismText2, setPlagiarismText2] = useState('');
  const [similarityResult, setSimilarityResult] = useState(null);
  const [paraphraseInput, setParaphraseInput] = useState('');
  const [paraphraseOutput, setParaphraseOutput] = useState('');
  const [pptOutline, setPptOutline] = useState('');
  const [gpaGrades, setGpaGrades] = useState([{ grade: '', credits: '' }]);
  const [gpaResult, setGpaResult] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [resumeData, setResumeData] = useState({ name: '', email: '', phone: '', summary: '', experience: '', education: '', skills: '' });
  const [pdfFiles, setPdfFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [pdfMerging, setPdfMerging] = useState(false);
  const fileInputRef = useRef(null);

  // Flashcard States
  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem('flashcards');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [flashcardMode, setFlashcardMode] = useState('create');

  // Code Formatter States
  const [codeInput, setCodeInput] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Calculator States
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcExpression, setCalcExpression] = useState('');
  const [calcHistory, setCalcHistory] = useState([]);
  const [calcMemory, setCalcMemory] = useState(0);

  const tools = [
    { id: 'wordcount', name: 'Word Counter Pro', icon: '📝', category: 'Writing', desc: 'Count words, characters, sentences, paragraphs & reading time' },
    { id: 'citation', name: 'Citation Generator', icon: '📚', category: 'Writing', desc: 'Generate APA, MLA, Chicago, Harvard citations instantly' },
    { id: 'plagiarism', name: 'Plagiarism Checker', icon: '🔍', category: 'Writing', desc: 'Compare texts for similarity percentage' },
    { id: 'paraphrase', name: 'Paraphrasing Tool', icon: '🔄', category: 'Writing', desc: 'Rewrite sentences with synonyms' },
    { id: 'pptgen', name: 'PPT Generator', icon: '📊', category: 'Documents', desc: 'Create PowerPoint from outline' },
    { id: 'resume', name: 'Resume Builder', icon: '📄', category: 'Documents', desc: 'Build professional resume instantly' },
    { id: 'pdftools', name: 'PDF Tools', icon: '📑', category: 'Documents', desc: 'Merge, split, compress PDFs' },
    { id: 'gpa', name: 'GPA Calculator', icon: '🎓', category: 'Study', desc: 'Calculate GPA/CGPA easily' },
    { id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏱️', category: 'Study', desc: '25/5 study technique timer' },
    { id: 'flashcards', name: 'Flashcard Maker', icon: '🃏', category: 'Study', desc: 'Create and study flashcards' },
    { id: 'codeformat', name: 'Code Formatter', icon: '💻', category: 'Coding', desc: 'Beautify Python, Java, JS code' },
    { id: 'calculator', name: 'Scientific Calculator', icon: '🔢', category: 'Utilities', desc: 'Advanced math calculations' },
  ];

  const categories = ['All', 'Writing', 'Documents', 'Study', 'Coding', 'Utilities'];
  const [activeCategory, setActiveCategory] = useState('All');

  // Word Counter Logic
  const getWordStats = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpace = text.replace(/\s/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 150);
    return { words, characters, charactersNoSpace, sentences, paragraphs, readingTime, speakingTime };
  };

  // Citation Generator Logic
  const generateCitation = () => {
    const { authors, title, year, url, journal, volume, pages } = citationData;
    let citation = '';

    if (citationStyle === 'apa') {
      if (citationData.type === 'website') {
        citation = `${authors} (${year}). ${title}. Retrieved from ${url}`;
      } else if (citationData.type === 'journal') {
        citation = `${authors} (${year}). ${title}. ${journal}, ${volume}, ${pages}.`;
      } else if (citationData.type === 'book') {
        citation = `${authors} (${year}). ${title}. Publisher.`;
      }
    } else if (citationStyle === 'mla') {
      if (citationData.type === 'website') {
        citation = `${authors}. "${title}." Web. ${year}. <${url}>.`;
      } else if (citationData.type === 'journal') {
        citation = `${authors}. "${title}." ${journal} ${volume} (${year}): ${pages}.`;
      } else if (citationData.type === 'book') {
        citation = `${authors}. ${title}. Publisher, ${year}.`;
      }
    } else if (citationStyle === 'chicago') {
      if (citationData.type === 'website') {
        citation = `${authors}. "${title}." Accessed ${year}. ${url}.`;
      } else if (citationData.type === 'journal') {
        citation = `${authors}. "${title}." ${journal} ${volume} (${year}): ${pages}.`;
      } else if (citationData.type === 'book') {
        citation = `${authors}. ${title}. Place: Publisher, ${year}.`;
      }
    } else if (citationStyle === 'harvard') {
      if (citationData.type === 'website') {
        citation = `${authors} (${year}) ${title}. Available at: ${url} (Accessed: ${new Date().toLocaleDateString()}).`;
      } else if (citationData.type === 'journal') {
        citation = `${authors} (${year}) '${title}', ${journal}, ${volume}, pp. ${pages}.`;
      } else if (citationData.type === 'book') {
        citation = `${authors} (${year}) ${title}. Place: Publisher.`;
      }
    }
    setGeneratedCitation(citation);
  };

  // Plagiarism/Similarity Checker Logic
  const checkSimilarity = () => {
    const text1Words = plagiarismText1.toLowerCase().split(/\s+/);
    const text2Words = plagiarismText2.toLowerCase().split(/\s+/);

    // Create n-grams (3-word phrases)
    const getNGrams = (words, n = 3) => {
      const ngrams = [];
      for (let i = 0; i <= words.length - n; i++) {
        ngrams.push(words.slice(i, i + n).join(' '));
      }
      return ngrams;
    };

    const ngrams1 = getNGrams(text1Words);
    const ngrams2 = getNGrams(text2Words);

    const set1 = new Set(ngrams1);
    const set2 = new Set(ngrams2);

    let matches = 0;
    const matchedPhrases = [];

    set1.forEach(ngram => {
      if (set2.has(ngram)) {
        matches++;
        matchedPhrases.push(ngram);
      }
    });

    const similarity = ngrams1.length > 0 ? Math.round((matches / ngrams1.length) * 100) : 0;
    setSimilarityResult({ similarity, matchedPhrases: matchedPhrases.slice(0, 10) });
  };

  // Paraphrasing Tool Logic (Simple synonym replacement)
  const synonyms = {
    'good': ['excellent', 'great', 'wonderful', 'superb', 'fine'],
    'bad': ['poor', 'terrible', 'awful', 'dreadful', 'inferior'],
    'big': ['large', 'huge', 'enormous', 'massive', 'substantial'],
    'small': ['tiny', 'little', 'minor', 'compact', 'modest'],
    'important': ['crucial', 'vital', 'essential', 'significant', 'critical'],
    'help': ['assist', 'aid', 'support', 'facilitate', 'enable'],
    'use': ['utilize', 'employ', 'apply', 'implement', 'leverage'],
    'show': ['demonstrate', 'illustrate', 'reveal', 'display', 'exhibit'],
    'make': ['create', 'produce', 'generate', 'develop', 'construct'],
    'get': ['obtain', 'acquire', 'receive', 'gain', 'secure'],
    'think': ['believe', 'consider', 'assume', 'suppose', 'reckon'],
    'said': ['stated', 'mentioned', 'noted', 'remarked', 'expressed'],
    'very': ['extremely', 'highly', 'incredibly', 'remarkably', 'exceptionally'],
    'many': ['numerous', 'several', 'various', 'multiple', 'countless'],
    'also': ['additionally', 'furthermore', 'moreover', 'likewise', 'besides'],
    'however': ['nevertheless', 'nonetheless', 'yet', 'still', 'though'],
    'because': ['since', 'as', 'due to', 'owing to', 'given that'],
    'but': ['however', 'yet', 'although', 'though', 'nevertheless'],
    'problem': ['issue', 'challenge', 'difficulty', 'obstacle', 'concern'],
    'result': ['outcome', 'consequence', 'effect', 'finding', 'conclusion'],
  };

  const paraphraseText = () => {
    let result = paraphraseInput;
    Object.keys(synonyms).forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        const replacement = synonyms[word.toLowerCase()][Math.floor(Math.random() * synonyms[word.toLowerCase()].length)];
        return match[0] === match[0].toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
      });
    });
    setParaphraseOutput(result);
  };

  // GPA Calculator Logic
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    gpaGrades.forEach(item => {
      if (item.grade && item.credits) {
        const points = gradePoints[item.grade.toUpperCase()] || 0;
        const credits = parseFloat(item.credits) || 0;
        totalPoints += points * credits;
        totalCredits += credits;
      }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setGpaResult({ gpa, totalCredits });
  };

  // Pomodoro Timer Logic
  React.useEffect(() => {
    let interval;
    if (pomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroRunning(false);
      alert('Pomodoro complete! Take a break!');
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning, pomodoroTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate Resume HTML
  const generateResumeHTML = () => {
    const { name, email, phone, summary, experience, education, skills } = resumeData;
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-bottom: 5px; }
    .contact { color: #666; margin-bottom: 20px; }
    h2 { color: #f97316; margin-top: 25px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .section { margin-bottom: 15px; }
    ul { margin: 10px 0; padding-left: 20px; }
  </style>
</head>
<body>
  <h1>${name || 'Your Name'}</h1>
  <div class="contact">${email || 'email@example.com'} | ${phone || '(123) 456-7890'}</div>

  <h2>Professional Summary</h2>
  <div class="section">${summary || 'Enter your professional summary...'}</div>

  <h2>Experience</h2>
  <div class="section">${experience?.replace(/\n/g, '<br>') || 'Enter your work experience...'}</div>

  <h2>Education</h2>
  <div class="section">${education?.replace(/\n/g, '<br>') || 'Enter your education...'}</div>

  <h2>Skills</h2>
  <div class="section">${skills || 'Enter your skills...'}</div>
</body>
</html>`;
  };

  const downloadResume = () => {
    const html = generateResumeHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name || 'resume'}_resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PPT Generator (Creates downloadable HTML presentation)
  const generatePPT = () => {
    const slides = pptOutline.split('\n').filter(line => line.trim());
    let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; }
    .slide { width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 60px; page-break-after: always; }
    .slide h1 { font-size: 3em; margin-bottom: 30px; text-align: center; }
    .slide p { font-size: 1.5em; text-align: center; opacity: 0.9; }
    .slide:nth-child(even) { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); }
    .slide-number { position: absolute; bottom: 20px; right: 30px; opacity: 0.5; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>
${slides.map((slide, i) => `
  <div class="slide">
    <h1>${slide}</h1>
    <p>Click to edit content</p>
    <div class="slide-number">${i + 1}</div>
  </div>
`).join('')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // PDF Merge Function
  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }

    setPdfMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please make sure all files are valid PDFs.');
    }
    setPdfMerging(false);
  };

  const handlePdfFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setPdfFiles(prev => [...prev, ...files]);
    setMergedPdfUrl(null);
  };

  const removePdfFile = (index) => {
    setPdfFiles(prev => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  // Flashcard Functions
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = () => {
    if (newCard.front.trim() && newCard.back.trim()) {
      setFlashcards([...flashcards, { ...newCard, id: Date.now() }]);
      setNewCard({ front: '', back: '' });
    }
  };

  const deleteFlashcard = (id) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
    if (currentCard >= flashcards.length - 1) {
      setCurrentCard(Math.max(0, flashcards.length - 2));
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  // Code Formatter Function
  const formatCode = () => {
    let formatted = codeInput;

    if (codeLanguage === 'javascript' || codeLanguage === 'java') {
      // Basic JS/Java formatting
      formatted = formatted
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n')
        .replace(/,\s*/g, ', ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Add indentation
      let indent = 0;
      formatted = formatted.split('\n').map(line => {
        line = line.trim();
        if (line.includes('}')) indent = Math.max(0, indent - 1);
        const indented = '  '.repeat(indent) + line;
        if (line.includes('{')) indent++;
        return indented;
      }).join('\n');
    } else if (codeLanguage === 'python') {
      // Basic Python formatting
      formatted = formatted
        .replace(/:\s*/g, ':\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Add indentation based on colons
      let indent = 0;
      formatted = formatted.split('\n').map(line => {
        line = line.trim();
        if (line.startsWith('return') || line.startsWith('break') || line.startsWith('continue') || line.startsWith('pass')) {
          // Keep current indent
        } else if (line.startsWith('elif') || line.startsWith('else') || line.startsWith('except') || line.startsWith('finally')) {
          indent = Math.max(0, indent - 1);
        }
        const indented = '    '.repeat(indent) + line;
        if (line.endsWith(':')) indent++;
        return indented;
      }).join('\n');
    } else if (codeLanguage === 'html') {
      // Basic HTML formatting
      formatted = formatted
        .replace(/></g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      let indent = 0;
      formatted = formatted.split('\n').map(line => {
        line = line.trim();
        if (line.startsWith('</')) indent = Math.max(0, indent - 1);
        const indented = '  '.repeat(indent) + line;
        if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.includes('</')) indent++;
        return indented;
      }).join('\n');
    } else if (codeLanguage === 'css') {
      // Basic CSS formatting
      formatted = formatted
        .replace(/\{/g, ' {\n')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      let indent = 0;
      formatted = formatted.split('\n').map(line => {
        line = line.trim();
        if (line.includes('}')) indent = Math.max(0, indent - 1);
        const indented = '  '.repeat(indent) + line;
        if (line.includes('{')) indent++;
        return indented;
      }).join('\n');
    }

    setCodeOutput(formatted);
  };

  // Calculator Functions
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const handleCalcInput = (value) => {
    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(value);
      setCalcExpression(value);
    } else {
      setCalcDisplay(calcDisplay + value);
      setCalcExpression(calcExpression + value);
    }
  };

  const handleCalcOperator = (op) => {
    setCalcDisplay(calcDisplay + op);
    setCalcExpression(calcExpression + op);
  };

  const handleCalcFunction = (func) => {
    try {
      const num = parseFloat(calcDisplay);
      let result;
      switch (func) {
        case 'sin': result = Math.sin(num * Math.PI / 180); break;
        case 'cos': result = Math.cos(num * Math.PI / 180); break;
        case 'tan': result = Math.tan(num * Math.PI / 180); break;
        case 'log': result = Math.log10(num); break;
        case 'ln': result = Math.log(num); break;
        case 'sqrt': result = Math.sqrt(num); break;
        case 'square': result = num * num; break;
        case 'factorial': result = factorial(Math.floor(num)); break;
        case 'pi': result = Math.PI; break;
        case 'e': result = Math.E; break;
        default: result = num;
      }
      setCalcDisplay(String(result));
      setCalcExpression(String(result));
    } catch {
      setCalcDisplay('Error');
    }
  };

  const calculateResult = () => {
    try {
      // Safe evaluation using Function constructor
      const sanitized = calcExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      const resultStr = String(result);
      setCalcHistory([...calcHistory, { expr: calcExpression, result: resultStr }]);
      setCalcDisplay(resultStr);
      setCalcExpression(resultStr);
    } catch {
      setCalcDisplay('Error');
    }
  };

  const clearCalc = () => {
    setCalcDisplay('0');
    setCalcExpression('');
  };

  const handleMemory = (action) => {
    const num = parseFloat(calcDisplay) || 0;
    switch (action) {
      case 'MC': setCalcMemory(0); break;
      case 'MR': setCalcDisplay(String(calcMemory)); setCalcExpression(String(calcMemory)); break;
      case 'M+': setCalcMemory(calcMemory + num); break;
      case 'M-': setCalcMemory(calcMemory - num); break;
    }
  };

  // Render Tool Content
  const renderToolContent = () => {
    switch (activeTool) {
      case 'wordcount':
        const stats = getWordStats(wordCountText);
        return (
          <div className="space-y-4">
            <textarea
              className="w-full h-48 bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500"
              placeholder="Paste your text here..."
              value={wordCountText}
              onChange={(e) => setWordCountText(e.target.value)}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-orange-400">{stats.words}</div>
                <div className="text-gray-400 text-sm">Words</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.characters}</div>
                <div className="text-gray-400 text-sm">Characters</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-green-400">{stats.sentences}</div>
                <div className="text-gray-400 text-sm">Sentences</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.paragraphs}</div>
                <div className="text-gray-400 text-sm">Paragraphs</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats.charactersNoSpace}</div>
                <div className="text-gray-400 text-sm">Chars (no space)</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-pink-400">{stats.readingTime}</div>
                <div className="text-gray-400 text-sm">Min to Read</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-cyan-400">{stats.speakingTime}</div>
                <div className="text-gray-400 text-sm">Min to Speak</div>
              </div>
            </div>
          </div>
        );

      case 'citation':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['apa', 'mla', 'chicago', 'harvard'].map(style => (
                <button
                  key={style}
                  onClick={() => setCitationStyle(style)}
                  className={`p-3 rounded-lg font-bold uppercase transition ${citationStyle === style ? 'bg-orange-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {style}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['website', 'journal', 'book'].map(type => (
                <button
                  key={type}
                  onClick={() => setCitationData({...citationData, type})}
                  className={`p-2 rounded-lg capitalize transition ${citationData.type === type ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Author(s) - Last, First"
                value={citationData.authors}
                onChange={(e) => setCitationData({...citationData, authors: e.target.value})}
              />
              <input
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Year"
                value={citationData.year}
                onChange={(e) => setCitationData({...citationData, year: e.target.value})}
              />
            </div>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Title"
              value={citationData.title}
              onChange={(e) => setCitationData({...citationData, title: e.target.value})}
            />
            {citationData.type === 'website' && (
              <input
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="URL"
                value={citationData.url}
                onChange={(e) => setCitationData({...citationData, url: e.target.value})}
              />
            )}
            {citationData.type === 'journal' && (
              <div className="grid grid-cols-3 gap-4">
                <input
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Journal Name"
                  value={citationData.journal}
                  onChange={(e) => setCitationData({...citationData, journal: e.target.value})}
                />
                <input
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Volume"
                  value={citationData.volume}
                  onChange={(e) => setCitationData({...citationData, volume: e.target.value})}
                />
                <input
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Pages (e.g., 1-10)"
                  value={citationData.pages}
                  onChange={(e) => setCitationData({...citationData, pages: e.target.value})}
                />
              </div>
            )}
            <button
              onClick={generateCitation}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition"
            >
              Generate Citation
            </button>
            {generatedCitation && (
              <div className="bg-gray-700 p-4 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Generated Citation ({citationStyle.toUpperCase()}):</div>
                <div className="text-white">{generatedCitation}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCitation)}
                  className="mt-3 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm transition"
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        );

      case 'plagiarism':
        return (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Original Text / Text 1</label>
                <textarea
                  className="w-full h-48 bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Paste your original text here..."
                  value={plagiarismText1}
                  onChange={(e) => setPlagiarismText1(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Text to Compare / Text 2</label>
                <textarea
                  className="w-full h-48 bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Paste text to compare..."
                  value={plagiarismText2}
                  onChange={(e) => setPlagiarismText2(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={checkSimilarity}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition"
            >
              Check Similarity
            </button>
            {similarityResult && (
              <div className="bg-gray-700 p-6 rounded-xl">
                <div className="text-center mb-4">
                  <div className={`text-5xl font-bold ${similarityResult.similarity > 50 ? 'text-red-400' : similarityResult.similarity > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {similarityResult.similarity}%
                  </div>
                  <div className="text-gray-400">Similarity Score</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${similarityResult.similarity > 50 ? 'bg-red-500/20 text-red-400' : similarityResult.similarity > 25 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                  {similarityResult.similarity > 50 ? 'High similarity detected! Consider rewriting.' : similarityResult.similarity > 25 ? 'Moderate similarity. Review highlighted sections.' : 'Low similarity. Looks good!'}
                </div>
                {similarityResult.matchedPhrases.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-400 mb-2">Matched Phrases:</div>
                    <div className="flex flex-wrap gap-2">
                      {similarityResult.matchedPhrases.map((phrase, i) => (
                        <span key={i} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm">"{phrase}"</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'paraphrase':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Original Text</label>
              <textarea
                className="w-full h-36 bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500"
                placeholder="Enter text to paraphrase..."
                value={paraphraseInput}
                onChange={(e) => setParaphraseInput(e.target.value)}
              />
            </div>
            <button
              onClick={paraphraseText}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition"
            >
              Paraphrase Text
            </button>
            {paraphraseOutput && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Paraphrased Text</label>
                <div className="bg-gray-700 p-4 rounded-xl">
                  <p className="text-white">{paraphraseOutput}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(paraphraseOutput)}
                    className="mt-3 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm transition"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
            <p className="text-gray-500 text-sm">Tip: This tool replaces common words with synonyms. Always review and edit the output for accuracy.</p>
          </div>
        );

      case 'pptgen':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Enter your slide titles (one per line)</label>
              <textarea
                className="w-full h-48 bg-gray-700 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-orange-500"
                placeholder="Introduction&#10;Problem Statement&#10;Our Solution&#10;Key Features&#10;Demo&#10;Conclusion&#10;Q&A"
                value={pptOutline}
                onChange={(e) => setPptOutline(e.target.value)}
              />
            </div>
            <button
              onClick={generatePPT}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition"
            >
              Generate Presentation
            </button>
            <p className="text-gray-500 text-sm">Downloads as HTML. Open in browser and print to PDF, or edit in any HTML editor.</p>
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Full Name"
                value={resumeData.name}
                onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
              />
              <input
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Email"
                value={resumeData.email}
                onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
              />
            </div>
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Phone Number"
              value={resumeData.phone}
              onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
            />
            <textarea
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded-xl p-4 focus:outline-none focus:border-orange-500"
              placeholder="Professional Summary (2-3 sentences about yourself)"
              value={resumeData.summary}
              onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
            />
            <textarea
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded-xl p-4 focus:outline-none focus:border-orange-500"
              placeholder="Work Experience (Job Title, Company, Dates, Responsibilities)"
              value={resumeData.experience}
              onChange={(e) => setResumeData({...resumeData, experience: e.target.value})}
            />
            <textarea
              className="w-full h-24 bg-gray-700 border border-gray-600 rounded-xl p-4 focus:outline-none focus:border-orange-500"
              placeholder="Education (Degree, University, Year)"
              value={resumeData.education}
              onChange={(e) => setResumeData({...resumeData, education: e.target.value})}
            />
            <input
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Skills (comma separated)"
              value={resumeData.skills}
              onChange={(e) => setResumeData({...resumeData, skills: e.target.value})}
            />
            <button
              onClick={downloadResume}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition"
            >
              Download Resume (HTML)
            </button>
            <p className="text-gray-500 text-sm">Open the downloaded file in browser, then use Ctrl+P to save as PDF.</p>
          </div>
        );

      case 'gpa':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {gpaGrades.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                    value={item.grade}
                    onChange={(e) => {
                      const newGrades = [...gpaGrades];
                      newGrades[index].grade = e.target.value;
                      setGpaGrades(newGrades);
                    }}
                  >
                    <option value="">Select Grade</option>
                    {Object.keys(gradePoints).map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                    placeholder="Credits"
                    value={item.credits}
                    onChange={(e) => {
                      const newGrades = [...gpaGrades];
                      newGrades[index].credits = e.target.value;
                      setGpaGrades(newGrades);
                    }}
                  />
                  {gpaGrades.length > 1 && (
                    <button
                      onClick={() => setGpaGrades(gpaGrades.filter((_, i) => i !== index))}
                      className="bg-red-500/20 text-red-400 px-3 rounded-lg hover:bg-red-500/30 transition"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setGpaGrades([...gpaGrades, { grade: '', credits: '' }])}
              className="w-full border border-gray-600 hover:border-orange-500 py-2 rounded-lg transition"
            >
              + Add Course
            </button>
            <button
              onClick={calculateGPA}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition"
            >
              Calculate GPA
            </button>
            {gpaResult && (
              <div className="bg-gray-700 p-6 rounded-xl text-center">
                <div className="text-5xl font-bold text-orange-400">{gpaResult.gpa}</div>
                <div className="text-gray-400">GPA out of 4.0</div>
                <div className="text-sm text-gray-500 mt-2">Total Credits: {gpaResult.totalCredits}</div>
              </div>
            )}
          </div>
        );

      case 'pomodoro':
        return (
          <div className="space-y-6 text-center">
            <div className="text-8xl font-bold text-orange-400">{formatTime(pomodoroTime)}</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                className={`px-8 py-3 rounded-xl font-bold transition ${pomodoroRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {pomodoroRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => { setPomodoroTime(25 * 60); setPomodoroRunning(false); }}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-bold transition"
              >
                Reset
              </button>
            </div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setPomodoroTime(25 * 60)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">25 min</button>
              <button onClick={() => setPomodoroTime(5 * 60)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">5 min</button>
              <button onClick={() => setPomodoroTime(15 * 60)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">15 min</button>
              <button onClick={() => setPomodoroTime(50 * 60)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition">50 min</button>
            </div>
            <p className="text-gray-500 text-sm">The Pomodoro Technique: 25 min work, 5 min break. After 4 pomodoros, take a 15-30 min break.</p>
          </div>
        );

      case 'pdftools':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePdfFileSelect}
                className="hidden"
                id="pdf-input"
              />
              <label htmlFor="pdf-input" className="cursor-pointer">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-gray-400">Click to select PDF files</p>
                <p className="text-gray-500 text-sm">Select multiple PDFs to merge</p>
              </label>
            </div>

            {pdfFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm text-gray-400">Selected Files ({pdfFiles.length}):</h4>
                {pdfFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      onClick={() => removePdfFile(index)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={mergePdfs}
              disabled={pdfFiles.length < 2 || pdfMerging}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition"
            >
              {pdfMerging ? 'Merging...' : 'Merge PDFs'}
            </button>

            {mergedPdfUrl && (
              <a
                href={mergedPdfUrl}
                download="merged.pdf"
                className="block w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold text-center transition"
              >
                Download Merged PDF
              </a>
            )}

            <button
              onClick={() => { setPdfFiles([]); setMergedPdfUrl(null); }}
              className="w-full border border-gray-600 hover:border-gray-500 py-2 rounded-lg text-sm transition"
            >
              Clear All
            </button>
          </div>
        );

      case 'flashcards':
        return (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFlashcardMode('create')}
                className={`flex-1 py-2 rounded-lg font-medium transition ${flashcardMode === 'create' ? 'bg-orange-500' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Create Cards
              </button>
              <button
                onClick={() => { setFlashcardMode('study'); setCurrentCard(0); setIsFlipped(false); }}
                disabled={flashcards.length === 0}
                className={`flex-1 py-2 rounded-lg font-medium transition ${flashcardMode === 'study' ? 'bg-orange-500' : 'bg-gray-700 hover:bg-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Study ({flashcards.length})
              </button>
            </div>

            {flashcardMode === 'create' ? (
              <div className="space-y-4">
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                  placeholder="Front (Question)"
                  value={newCard.front}
                  onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                />
                <input
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
                  placeholder="Back (Answer)"
                  value={newCard.back}
                  onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                />
                <button
                  onClick={addFlashcard}
                  disabled={!newCard.front.trim() || !newCard.back.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition"
                >
                  Add Card
                </button>

                {flashcards.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <h4 className="text-sm text-gray-400">Your Cards:</h4>
                    {flashcards.map((card, i) => (
                      <div key={card.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <span className="text-sm truncate">{i + 1}. {card.front}</span>
                        <button
                          onClick={() => deleteFlashcard(card.id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {flashcards.length > 0 ? (
                  <>
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="bg-gray-700 rounded-xl p-8 min-h-48 flex items-center justify-center cursor-pointer hover:bg-gray-650 transition"
                    >
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">{isFlipped ? 'ANSWER' : 'QUESTION'}</p>
                        <p className="text-xl font-medium">
                          {isFlipped ? flashcards[currentCard]?.back : flashcards[currentCard]?.front}
                        </p>
                        <p className="text-xs text-gray-500 mt-4">Click to flip</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={prevCard}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
                      >
                        Previous
                      </button>
                      <span className="text-gray-400">{currentCard + 1} / {flashcards.length}</span>
                      <button
                        onClick={nextCard}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-400 py-8">No cards yet. Create some first!</p>
                )}
              </div>
            )}
            <p className="text-gray-500 text-sm text-center">Cards are saved automatically in your browser.</p>
          </div>
        );

      case 'codeformat':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              {['javascript', 'python', 'java', 'html', 'css'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setCodeLanguage(lang)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize transition ${codeLanguage === lang ? 'bg-orange-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Paste your code:</label>
              <textarea
                className="w-full h-40 bg-gray-700 border border-gray-600 rounded-xl p-4 font-mono text-sm focus:outline-none focus:border-orange-500"
                placeholder="Paste your messy code here..."
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
              />
            </div>
            <button
              onClick={formatCode}
              disabled={!codeInput.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition"
            >
              Format Code
            </button>
            {codeOutput && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Formatted code:</label>
                <div className="relative">
                  <pre className="w-full h-40 bg-gray-700 border border-gray-600 rounded-xl p-4 font-mono text-sm overflow-auto whitespace-pre">
                    {codeOutput}
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeOutput)}
                    className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs transition"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
            <p className="text-gray-500 text-sm">Basic formatting with proper indentation. For advanced formatting, use specialized tools.</p>
          </div>
        );

      case 'calculator':
        return (
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-xl">
              <div className="text-right text-gray-400 text-sm h-6 overflow-hidden">{calcExpression || ' '}</div>
              <div className="text-right text-3xl font-bold text-white overflow-hidden">{calcDisplay}</div>
            </div>

            {/* Memory buttons */}
            <div className="grid grid-cols-4 gap-2">
              {['MC', 'MR', 'M+', 'M-'].map(btn => (
                <button
                  key={btn}
                  onClick={() => handleMemory(btn)}
                  className="bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-sm font-medium transition"
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Scientific functions */}
            <div className="grid grid-cols-5 gap-2">
              {['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'square', 'factorial', 'pi', 'e'].map(func => (
                <button
                  key={func}
                  onClick={() => handleCalcFunction(func)}
                  className="bg-gray-600 hover:bg-gray-500 py-2 rounded-lg text-xs font-medium transition"
                >
                  {func === 'square' ? 'x^2' : func === 'factorial' ? 'n!' : func === 'pi' ? 'pi' : func}
                </button>
              ))}
            </div>

            {/* Number pad and operators */}
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '^', '+'].map(btn => (
                <button
                  key={btn}
                  onClick={() => ['÷', '×', '-', '+', '^'].includes(btn) ? handleCalcOperator(btn) : handleCalcInput(btn)}
                  className={`py-3 rounded-lg font-bold text-lg transition ${['÷', '×', '-', '+', '^'].includes(btn) ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {btn}
                </button>
              ))}
              <button
                onClick={clearCalc}
                className="bg-red-500 hover:bg-red-600 py-3 rounded-lg font-bold transition"
              >
                C
              </button>
              <button
                onClick={() => setCalcDisplay(calcDisplay.slice(0, -1) || '0')}
                className="bg-gray-600 hover:bg-gray-500 py-3 rounded-lg font-bold transition"
              >
                DEL
              </button>
              <button
                onClick={() => handleCalcInput('(')}
                className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition"
              >
                (
              </button>
              <button
                onClick={() => handleCalcInput(')')}
                className="bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition"
              >
                )
              </button>
            </div>

            <button
              onClick={calculateResult}
              className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold text-xl transition"
            >
              =
            </button>

            {calcHistory.length > 0 && (
              <div className="bg-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-xs text-gray-400 mb-2">History:</p>
                {calcHistory.slice(-5).reverse().map((item, i) => (
                  <div key={i} className="text-sm text-gray-300">{item.expr} = {item.result}</div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-400 py-20">
            <div className="text-6xl mb-4">👆</div>
            <p>Select a tool from above to get started</p>
          </div>
        );
    }
  };

  const filteredTools = activeCategory === 'All' ? tools : tools.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⛓️</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">AgentChains.ai</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Home</Link>
            <span className="text-orange-400 text-sm font-medium">Free Tools</span>
            <Link to="/referral" className="text-green-400 hover:text-green-300 text-sm font-medium transition">💰 Earn $100</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">100% FREE</span>
            <Link to="/" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 px-5 py-2 rounded-lg font-semibold text-sm transition">Get Project Help</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 text-center border-b border-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Free Student <span className="text-orange-400">Toolkit</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          All the tools you need for academic success — 100% free, no login required, works offline!
        </p>
      </section>

      {/* Category Filter */}
      <section className="py-4 px-4 border-b border-gray-800 bg-gray-800/30">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeCategory === cat ? 'bg-orange-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {filteredTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`p-4 rounded-xl border text-center transition-all hover:scale-105 ${activeTool === tool.id ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
              >
                <span className="text-3xl block mb-2">{tool.icon}</span>
                <span className="font-bold text-sm block">{tool.name}</span>
              </button>
            ))}
          </div>

          {/* Active Tool Panel */}
          {activeTool && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tools.find(t => t.id === activeTool)?.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{tools.find(t => t.id === activeTool)?.name}</h2>
                    <p className="text-gray-400 text-sm">{tools.find(t => t.id === activeTool)?.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTool(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  X
                </button>
              </div>
              {renderToolContent()}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-4 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Help With Your Project?</h2>
          <p className="opacity-90 mb-6">We build complete course projects — Code, Documentation, PPT, everything!</p>
          <Link to="/" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
            Get Complete Package — $399
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 AgentChains.ai — Free Student Toolkit | <Link to="/" className="text-orange-400 hover:underline">Need Project Help?</Link></p>
        </div>
      </footer>
    </div>
  );
};

export default Tools;
