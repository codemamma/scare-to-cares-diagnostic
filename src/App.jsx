import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Diagnostic from './pages/Diagnostic';
import AdminAssessments from './pages/AdminAssessments';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin/assessments') {
      setCurrentPage('admin');
    } else if (path === '/diagnostic') {
      setCurrentPage('diagnostic');
    } else {
      setCurrentPage('home');
    }
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);

    if (page === 'admin') {
      window.history.pushState({}, '', '/admin/assessments');
    } else if (page === 'diagnostic') {
      window.history.pushState({}, '', '/diagnostic');
    } else {
      window.history.pushState({}, '', '/');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDiagnostic = () => {
    handleNavigate('diagnostic');
  };

  const showHeaderFooter = currentPage !== 'admin';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {showHeaderFooter && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className="flex-grow">
        {currentPage === 'home' && <Home onStartDiagnostic={handleStartDiagnostic} />}
        {currentPage === 'diagnostic' && <Diagnostic />}
        {currentPage === 'admin' && <AdminAssessments />}
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
