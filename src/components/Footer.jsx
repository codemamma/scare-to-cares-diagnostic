export default function Footer() {
  return (
    <footer className="border-t border-gray-800/50 bg-black/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-bold text-white">CARES Diagnostic</span>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              Inspired by the SCARE to CARES framework by{' '}
              <a
                href="https://sabywaraich.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
              >
                Saby Waraich
              </a>
            </p>
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} CARES Leadership Diagnostic. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <a
              href="https://sabywaraich.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
            >
              About
            </a>
            <span className="text-gray-800">•</span>
            <a
              href="https://sabywaraich.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
            >
              Contact
            </a>
            <span className="text-gray-800">•</span>
            <a
              href="https://sabywaraich.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-primary-400 transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
