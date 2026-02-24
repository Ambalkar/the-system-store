import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminPage from './components/AdminPage';
import StorePage from './components/StorePage';
import Login from './components/Login';
import Signup from './components/Signup';

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar">
        <h1>The System Store</h1>
        <div className="nav-actions">
          <div className="nav-links">
            <Link to="/">Store</Link>
            <Link to="/admin">Admin</Link>
          </div>
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <button className="logout-btn" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/signup" className="auth-link signup-link">Sign Up</Link>
            </div>
          )}
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      
      <main>
        <Routes>
          <Route path="/" element={<StorePage darkMode={darkMode} />} />
          <Route path="/admin" element={<AdminPage darkMode={darkMode} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
