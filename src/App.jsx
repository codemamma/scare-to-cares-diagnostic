import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Diagnostic from './pages/Diagnostic';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDiagnostic = () => {
    handleNavigate('diagnostic');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow">
        {currentPage === 'home' && <Home onStartDiagnostic={handleStartDiagnostic} />}
        {currentPage === 'diagnostic' && <Diagnostic />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
