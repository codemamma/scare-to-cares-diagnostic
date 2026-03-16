export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center">
        <p className="text-gray-400 mb-2">
          Inspired by the SCARE to CARES framework by Saby Waraich
        </p>
        <a
          href="https://sabywaraich.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-400 hover:text-primary-300 transition-colors"
        >
          Learn more at sabywaraich.com
        </a>
        <p className="text-gray-600 text-sm mt-4">
          © {new Date().getFullYear()} CARES Leadership Diagnostic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
