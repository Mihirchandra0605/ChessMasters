import React, { StrictMode, useState } from "react";
import axios from 'axios'; // Import axios
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
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Dashboard from "./components/admin_dashboard.jsx";
import FileUpload from "./components/fileupload.jsx";
import CoachesAvaialble from "./components/coachesavailable.jsx";
import AddCoachForm from "./components/AddDetails.jsx";
import ArticleDetail from "./components/ArticleDetails.jsx";
import ChessBoard from "./components/Chessboard.jsx";
import PricingPlans from "./components/PricingPlans.jsx";
import PaymentPage from "./components/PaymentPage.jsx";
import VideoDetail from "./components/VideoDetails.jsx";
import ArticleUpdate from "./components/ArticleUpdate.jsx";
import VideoUpdate from "./components/VideoUpdate.jsx";
import UpdateProfile from "./components/UpdateProfile.jsx";
import ViewGame from "./components/ViewGame.jsx";
import Rules from "./components/rules.jsx";

// Set up axios defaults
// axios.defaults.withCredentials = true;

// Intercept requests to add Authorization header
// axios.interceptors.request.use(
//     (config) => {
//         const token = document.cookie
//             .split('; ')
//             .find(row => row.startsWith('authorization='))
//             ?.split('=')[1];

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         console.error('Request error:', error); // Log request error for debugging
//         return Promise.reject(error);
//     }
// );

// Intercept responses for error handling
// axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             if (error.response.status === 401 || error.response.status === 403) {
//                 localStorage.removeItem('userId');
//                 window.location.href = '/login';
//             } else {
//                 alert(`Error: ${error.response.status} - ${error.response.statusText}`);
//             }
//         } else if (error.request) {
//             alert('Network error, please check your connection.');
//         } else {
//             alert(`Error: ${error.message}`);
//         }
//         return Promise.reject(error);
//     }
// );

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    function handleLogin() {
        setIsLoggedIn(true);
    }

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
        { path: '/coaches', element: <CoachesAvaialble/> },
        { path: '/Coachdash/:id', element: <Coachdash/> },
        { path: '/Upload', element: <FileUpload /> },
        { path: '/ArticleDetail/:id', element: <ArticleDetail /> },
        { path: '/VideoDetail/:id', element: <VideoDetail /> },
        { path: '/ChessBoard', element: <ChessBoard /> },
        { path: '/pricingplans', element: <PricingPlans /> },
        { path: '/payment', element: <PaymentPage /> },
        { path: '/article-update/:id', element: <ArticleUpdate /> },
        { path: '/video-update/:id', element: <VideoUpdate /> },
        { path: '/update-profile', element: <UpdateProfile /> },
        { path: '/ViewGame/:gameId', element: <ViewGame /> },
        { path: '/rules', element: <Rules /> },
        // { path: '*', element: <Navigate to="/404" /> }, // Handle undefined routes
    ]);

    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

// Error boundary to catch errors in any component tree
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary Caught an Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please try again later.</div>;
        }
        return this.props.children;
    }
}

// Wrapping App component with ErrorBoundary for catching errors
createRoot(document.getElementById("root")).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
