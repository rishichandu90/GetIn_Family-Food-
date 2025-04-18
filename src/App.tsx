
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadForm from './UploadForm';
import FoodList from './FoodList';
import Admin from './Admin';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h1>🍲 Culinary Simple App</h1>
        <nav>
          <Link to="/admin">Admin</Link> |{" "}
          <Link to="/foods">All Food Items</Link> |{" "}
          <Link to="/rishi">Rishi's Food</Link> |{" "}
          <Link to="/atthamma">Atthamma's Food</Link> |{" "}
          <Link to="/amma">Amma's Food</Link>
        </nav>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/foods" element={<FoodList />} />
          <Route path="/amma" element={<FoodList role="amma" />} />
          <Route path="/rishi" element={<FoodList role="rishi" />} />
          <Route path="/atthamma" element={<FoodList role="atthamma" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
