import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CowDetail from './pages/CowDetail';
import CowManagement from './pages/CowManagement';

function App() {
  const [language, setLanguage] = useState('en');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation language={language} setLanguage={setLanguage} />
        <Routes>
          <Route path="/" element={<Dashboard language={language} />} />
          <Route path="/cow/:id" element={<CowDetail language={language} />} />
          <Route path="/manage" element={<CowManagement language={language} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
