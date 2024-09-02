import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Greeting from "./Greetings.jsx";
import Coach from "./coach.jsx";
import Player from "./player.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="section">
      <Greeting />
    </div>
    <div className="section">
      <Coach />
    </div>
    <div className="section">
      <Player />
    </div>
  </StrictMode>
);
