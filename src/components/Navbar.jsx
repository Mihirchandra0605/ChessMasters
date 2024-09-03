import React from 'react';
import '../styles/Navbar.css'

const Navbar = () => {
    return (
<nav className="navbar">
    <div className="navbar-buttons">
        <button onClick={() => window.location.href = "/"}>Home</button>
        <button onClick={() => window.location.href = "/coach-dashboard"}>Coach Dashboard</button>
        <button onClick={() => window.location.href = "/articles"}>Articles</button>
        <button onClick={() => window.location.href = "/videos"}>Videos</button>
        <button className="logout-button" onClick={() => window.location.href = "/logout"}>Logout</button>
    </div>
</nav>
    );
};

export default Navbar;