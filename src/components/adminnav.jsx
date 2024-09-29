import React from 'react';
import '../styles/adminnav.css';
import { Link, useNavigate } from 'react-router-dom';

// Logout Button Component
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies for this request
      });

      if (response.ok) {
        // Redirect to the login page after successful logout
        navigate('/');
      } else {
        console.error('Error logging out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

// Navbar Component
const AdminNav = () => {
  return (
    <nav className="navbar">
      <div className="navbar-buttons">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default AdminNav;
