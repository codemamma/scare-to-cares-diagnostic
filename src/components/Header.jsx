export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="border-b border-gray-800/50 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
              CARES Diagnostic
            </span>
          </button>
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('diagnostic')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'diagnostic'
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Diagnostic
            </button>
          </nav>
        </div>
        <a
          href="https://sabywaraich.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 bg-gray-900/50 backdrop-blur-sm text-white rounded-xl hover:bg-gray-800/50 transition-all border border-gray-700/50 hover:border-gray-600 font-medium text-sm"
        >
          Visit Saby's Website
        </a>
      </div>
    </header>
  );
}
