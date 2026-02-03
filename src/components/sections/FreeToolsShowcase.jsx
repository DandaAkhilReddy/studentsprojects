import { Link } from 'react-router-dom';

const tools = [
  { id: 'resume', name: 'Resume Builder Pro', icon: '📄', category: 'Documents', desc: 'MAANG-approved format with JD matching', featured: true },
  { id: 'wordcount', name: 'Word Counter Pro', icon: '📝', category: 'Writing', desc: 'Count words, characters, sentences & reading time' },
  { id: 'citation', name: 'Citation Generator', icon: '📚', category: 'Writing', desc: 'Generate APA, MLA, Chicago, Harvard citations' },
  { id: 'plagiarism', name: 'Plagiarism Checker', icon: '🔍', category: 'Writing', desc: 'Compare texts for similarity percentage' },
  { id: 'paraphrase', name: 'Paraphrasing Tool', icon: '🔄', category: 'Writing', desc: 'Rewrite sentences with smart synonyms' },
  { id: 'pptgen', name: 'PPT Generator', icon: '📊', category: 'Documents', desc: 'Create PowerPoint from outline instantly' },
  { id: 'pdftools', name: 'PDF Tools', icon: '📑', category: 'Documents', desc: 'Merge, split, and compress PDFs' },
  { id: 'gpa', name: 'GPA Calculator', icon: '🎓', category: 'Study', desc: 'Calculate GPA/CGPA easily' },
  { id: 'pomodoro', name: 'Pomodoro Timer', icon: '⏱️', category: 'Study', desc: '25/5 study technique timer' },
  { id: 'flashcards', name: 'Flashcard Maker', icon: '🃏', category: 'Study', desc: 'Create and study flashcards' },
  { id: 'codeformat', name: 'Code Formatter', icon: '💻', category: 'Coding', desc: 'Beautify Python, Java, JS code' },
  { id: 'calculator', name: 'Scientific Calculator', icon: '🔢', category: 'Utilities', desc: 'Advanced math calculations' },
];

const categoryColors = {
  Documents: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Writing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Study: 'bg-green-500/20 text-green-400 border-green-500/30',
  Coding: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Utilities: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const FreeToolsShowcase = () => {
  const featured = tools.find((t) => t.featured);
  const others = tools.filter((t) => !t.featured);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-4">
            100% Free - No Sign Up Required
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Free Student{' '}
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Tools
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            12 powerful tools built for students. From resume building to code formatting — everything you need, completely free.
          </p>
        </div>

        {/* Featured Tool - Resume Builder */}
        {featured && (
          <Link
            to="/tools"
            className="block mb-8 group"
          >
            <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-800/60 rounded-2xl border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 p-6 md:p-8 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                  {featured.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {featured.name}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-gray-300 text-base">{featured.desc}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                    <span>ATS Optimized</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>JD Matching</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>One-Page Format</span>
                  </div>
                </div>
                <div className="text-orange-400 group-hover:translate-x-1 transition-transform duration-300 text-2xl hidden md:block">
                  →
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {others.map((tool) => (
            <Link
              key={tool.id}
              to="/tools"
              className="group bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 hover:border-orange-500/30 rounded-xl p-5 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-700/80 group-hover:bg-gray-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm group-hover:text-orange-300 transition-colors truncate">
                    {tool.name}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">
                    {tool.desc}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full border ${categoryColors[tool.category]}`}
                  >
                    {tool.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105"
          >
            Explore All 12 Tools
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreeToolsShowcase;
