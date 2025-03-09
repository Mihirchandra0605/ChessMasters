  import React from "react";
  import { BrowserRouter , Routes, Route} from "react-router-dom";
  import Navbar from "./components/Navbar";
  import Coachdash from "./components/Coachdash";
  import PricingPlans from "./components/PricingPlans";
  import './App.css';

  function App() {
    return (
     <BrowserRouter> 
          <Navbar /> {/* Navbar remains consistent across all pages */}
          <Routes>
            {/* Default route to Coachdash */}
            <Route path="/" element={<Coachdash />} />
            
          </Routes>
    </BrowserRouter>
    );
  }

  export default App;
