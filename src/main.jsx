import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Greeting from "./components/Greetings.jsx";
import Coach from "./components/coach.jsx";
import Player from "./components/player.jsx";
import HomePage from "./components/index.jsx";
import AdminDashboard from "./components/admin_dashboard.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    // <StrictMode>
    //   {!isLoggedIn ? (
    //     <div className="section">
    //       {/* Render Greeting, Coach, and Player before login */}
    //       <Greeting onLoginSuccess={handleLogin} />
    //       <Coach />
    //       <Player />
    //     </div>
    //   ) : (
    //     <div className="section">
    //       {/* Render HomePage after login */}
    //       <HomePage />
    //     </div>
    //   )}
    // </StrictMode>

    <StrictMode>

      <AdminDashboard />


      </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
