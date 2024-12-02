import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
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
      className="flex-1 py-4 text-sm font-medium text-white bg-gradient-to-r from-red-400 to-red-700 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
    >
      Logout
    </button>
  );
};

const NavButton = ({ to, children }) => (
  <Link
    to={to}
    className="flex-1 py-4 text-sm font-medium text-white bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 transition duration-300 ease-in-out text-center transform hover:-translate-y-1 hover:scale-105 relative overflow-hidden group"
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-in-out"></span>
  </Link>
);

const Navbar = () => {
  const playerId = localStorage.getItem('userId');
  console.log(playerId);
  const logoSrc = "/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png";

  return (
    <nav className="bg-purple-600 shadow-lg">
      <div className="max-w-full mx-auto">
        <div className="flex items-stretch">
          <div className="flex-shrink-0 flex items-center px-4 bg-purple-700 hover:bg-purple-800 transition-all duration-300">
            <img
              className="h-12 w-12 rounded-full transform hover:rotate-180 transition-all duration-500"
              src={logoSrc}
              alt="Chess Logo"
            />
          </div>
          <NavButton to="/Index?role=player">Home</NavButton>
          <NavButton to="/CoachesAvailable">Coaches</NavButton>
          {playerId && <NavButton to={`/player/${playerId}/profile`}>Profile</NavButton>}
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
