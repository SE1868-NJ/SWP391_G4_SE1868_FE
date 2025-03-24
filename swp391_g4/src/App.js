import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ShipperLeaderboard from './components/pages/ShipperLeaderboard';
import { useNavigate } from 'react-router-dom';
import Button from './components/buttons/Button';

const App = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Điều hướng sang trang login
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/leaderboard" element={<ShipperLeaderboard />} />
        </Routes>
        <div>
          <h1>Welcome to the Homepage</h1>
          <Button onClick={handleLoginClick}>Login</Button>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;