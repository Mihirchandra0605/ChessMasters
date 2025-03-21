import { StrictMode, useState } from "react";
import axios from 'axios'; // Add this import
import { createRoot } from "react-dom/client";
import "./main.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Greeting from "./components/Greetings.jsx";
import Coach from "./components/coach.jsx";
import Player from "./components/player.jsx";
import HomePage from "./components/index.jsx";
import CoachDashboard from "./components/CoachDashboard.jsx";
import Coachprofile from "./components/Coachprofile.jsx";
import Coachdash from "./components/Coachdash.jsx";
import Profile from "./components/Profile.jsx";
import CProfile from "./components/CProfile.jsx";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from "./components/admin_dashboard.jsx";
import FileUpload from "./components/fileupload.jsx";
import CoachesAvaialble from "./components/coachesavailable.jsx";
import AddCoachForm from "./components/AddDetails.jsx";
import ArticleDetail from "./components/ArticleDetails.jsx";
import ChessBoard from "./components/Chessboard.jsx";
import PricingPlans from "./components/PricingPlans.jsx"
import PaymentPage from "./components/PaymentPage.jsx";
import VideoDetail from "./components/VideoDetails.jsx";
// Import our new update components
import ArticleUpdate from "./components/ArticleUpdate.jsx";
import VideoUpdate from "./components/VideoUpdate.jsx";
axios.defaults.withCredentials = true; // Add this line

axios.interceptors.request.use(
    (config) => {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('authorization='))
        ?.split('=')[1];
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    function handleLogin() {
        setIsLoggedIn(true);
    };
    
    const router = createBrowserRouter([
        { path: '/', element: <Greeting onLoginSuccess={handleLogin} /> },
        { path: '/AdminDashboard', element: <Dashboard /> },
        { path: '/coach/:coachId/CoachDashboard', element: <CoachDashboard /> },
        { path: '/PlayerDashboard', element: <Profile /> },
        { path: '/CoachProfiles', element: <Coachprofile /> },
        { path: '/CoachInfo/:id', element: <Coachdash /> },
        { path: '/player/:id/profile', element: <Profile /> },
        { path: '/coach/:coachId/CoachProfile', element: <CProfile /> },
        { path: '/Index', element: <HomePage /> },
        { path: '/CoachesAvailable', element: <CoachesAvaialble /> },
        { path: '/AddData', element: <AddCoachForm /> },
        { path: '/coaches', element: <CoachesAvaialble/>},
        { path: '/Coachdash/:id', element: <Coachdash/>},
        { path: '/Upload', element: <FileUpload /> },
        { path: '/ArticleDetail/:id', element: <ArticleDetail /> },
        { path: '/VideoDetail/:id', element: <VideoDetail/>},
        { path: '/ChessBoard', element: <ChessBoard /> },
        { path: '/pricingplans', element: <PricingPlans /> },
        { path: '/payment', element: <PaymentPage /> },
        // Add these new routes for update functionality
        { path: '/article-update/:id', element: <ArticleUpdate /> },
        { path: '/video-update/:id', element: <VideoUpdate /> },
    ]);

    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

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

createRoot(document.getElementById("root")).render(<App />);
