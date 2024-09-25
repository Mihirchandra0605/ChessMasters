import React from 'react';
import '../styles/Navbar.css'
import {Link} from 'react-router-dom'
const Navbar = () => {
    return (
<nav className="navbar">
    <div className="navbar-buttons">
        <Link to="/Index"><button>Home</button></Link>
        <Link to="/CoachDashboard"><button>Coach Dashboard</button></Link>
        {/* <button onClick={() => window.location.href = "/articles"}>Articles</button>
        <button onClick={() => window.location.href = "/videos"}>Videos</button> */}
        <Link to="/Profile"><button>Profile</button></Link>
        <Link to="/"><button>Logout</button></Link>
    </div>
</nav>
    );
};

export default Navbar;