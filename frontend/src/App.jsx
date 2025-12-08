import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CowDetail from './pages/CowDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cow/:id" element={<CowDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
