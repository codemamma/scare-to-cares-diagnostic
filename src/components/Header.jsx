export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => onNavigate('home')}
            className="text-xl font-bold text-white hover:text-primary-400 transition-colors"
          >
            CARES Leadership Diagnostic
          </button>
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${
                currentPage === 'home' ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('diagnostic')}
              className={`transition-colors ${
                currentPage === 'diagnostic' ? 'text-white' : 'text-gray-300 hover:text-white'
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
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
        >
          Visit Saby's Website
        </a>
      </div>
    </header>
  );
}
