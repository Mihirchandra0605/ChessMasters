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
import CProfile from "./components/CProfile.jsx"
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Dashboard from "./components/admin_dashboard.jsx";
import FileUpload  from "./components/fileupload.jsx";
import CoachesAvaialble from "./components/coachesavailable.jsx";
import AddCoachForm from "./components/AddDetails.jsx";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    function handleLogin(){
      setIsLoggedIn(true);
    };
    const router = createBrowserRouter([
      {path: '/', element:<Greeting onLoginSuccess={handleLogin} />},
      {path: '/AdminDashboard', element:<Dashboard/>},
      {path: '/CoachDashboard', element:<CoachDashboard/>},
      {path: '/PlayerDashboard', element:<Profile/>},
      {path: '/CoachProfiles', element:<Coachprofile/>},
      {path: '/CoachInfo', element:<Coachdash/>},
      {path: '/Profile', element:<Profile/>},
      {path: '/CoachProfile', element:<CProfile/>},
      {path: '/Index', element:<HomePage/>},
      {path: '/CoachesAvailable', element:<CoachesAvaialble/>},
      {path: '/AddData',element:<AddCoachForm/>},
      {path: '/Upload', element:<FileUpload/>}
    ])
                                                                // <StrictMode>
                                                                //   {!isLoggedIn ? (
                                                                //     <div className="section">
                                                                //       {/* Render Greeting, Coach, and Player before login */}
                                                                      // <Greeting onLoginSuccess={handleLogin} />
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
    return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(<App />);
