import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Logout Button Component
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate('/');
      } else {
        console.error('Error logging out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-pink-600 
                 text-white text-sm sm:text-base font-medium rounded-lg 
                 hover:from-red-600 hover:to-pink-700 transition-all duration-300 
                 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 
                 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Logout
    </button>
  );
};

// Navbar Component
const AdminNav = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 
                    shadow-lg backdrop-blur-sm backdrop-filter">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold 
                       bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-4">
            <span className="text-white/90 text-sm sm:text-base">
              Welcome, Admin
            </span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
