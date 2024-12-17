import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Import Navigate
import { jwtDecode } from 'jwt-decode';  // Importing jwt-decode correctly
import Login from './login.jsx';
import Dashboard from './dashboard.jsx';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there is a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the JWT to extract the user data
        const decoded = jwtDecode(token);
        setUser(decoded);  // Set the user data from the decoded token
      } catch (error) {
        console.error("Token is invalid", error);
        setUser(null);  // If decoding fails, set user to null
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
