import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import Greeting from "./components/Greetings.jsx";
import Coach from "./components/coach.jsx";
import Player from "./components/player.jsx";
import HomePage from "./components/index.jsx";
import CoachDashboard from "./components/CoachDashboard.jsx";
import Coachprofile from "./components/Coachprofile.jsx";
import Coachdash from "./components/Coachdash.jsx";
import Profile from "./components/Profile.jsx";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Dashboard from "./components/admin_dashboard.jsx";
import FileUpload  from "./components/fileupload.jsx";
import CoachesAvaialble from "./components/coachesavailable.jsx";


const router = createBrowserRouter([
  {path: '/', element:<Greeting/>},
  {path: '/AdminDashboard', element:<Dashboard/>},
  {path: '/CoachDashboard', element:<CoachDashboard/>},
  {path: '/PlayerDashboard', element:<Profile/>},
  {path: '/CoachProfiles', element:<Coachprofile/>},
  {path: '/CoachInfo', element:<Coachdash/>},
  {path: '/Profile', element:<Profile/>},
  {path: '/Index', element:<HomePage/>},
  {path: '/CoachesAvailable', element:<CoachesAvaialble/>},
  {path: '/Upload', element:<FileUpload/>}
])

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

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

//     <StrictMode>

// <Coachdash/>


//       </StrictMode>
//     <StrictMode>

// <Profile/>


//       </StrictMode>
    return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(<App />);
