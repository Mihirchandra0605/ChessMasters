import React, { useState } from "react";
import "./Greetings.css";
import "./FormStyles.css";
function Greeting() {
    const [view, setView] = useState("greeting"); // State to manage view
  
    // Handlers to change view
    const handleLoginClick = () => setView("login");
    const handleSignupClick = () => setView("signup");
    const handleHomeClick = () => setView("greeting");
  
    return (
      <div id="greeting">
        {view === "greeting" && (
          <div className="content">
          <div className="header-with-rooks">
            <img
              className="rook"
              src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
              alt="rook"
            />
            <h1>Welcome to ChessMasters</h1>
            <img
              className="rook"
              src="/public/pngtree-chess-rook-front-view-png-image_7505306-2460555070.png"
              alt="rook"
            />
          </div>
          <div className="buttons">
            <button className="button button--primary" onClick={handleLoginClick}>
              Log In
            </button>
            <button className="button button--primary" onClick={handleSignupClick}>
              Sign Up
            </button>
          </div>
          <img className="arrow" src="/public/down.png" alt="down arrow" />
        </div>
        )}
        {view === "login" && (
          <>
            <LoginForm />
            <div className="buttons">
              <button className="button button--primary" onClick={handleHomeClick}>
                Home
              </button>
              <button className="button button--primary" onClick={handleSignupClick}>
                Sign Up
              </button>
            </div>
          </>
        )}
        {view === "signup" && (
          <>
            <SignupForm />
            <div className="buttons">
              <button className="button button--primary" onClick={handleHomeClick}>
                Home
              </button>
              <button className="button button--primary" onClick={handleLoginClick}>
                Log In
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
  
  function LoginForm() {
    return (
      <div className="form-block">
        <div className="form-block__header">
          <h1>Login</h1>
        </div>
        <form>
          <div className="form-block__input-wrapper">
            <input
              type="email"
              placeholder="Email"
              className="form-group__input"
              required
            />
          </div>
          <div className="form-block__input-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="form-group__input"
              required
            />
          </div>
          <button type="submit" className="button button--primary full-width">
            Log In
          </button>
        </form>
      </div>
    );
  }
  
  function SignupForm() {
    return (
      <div className="form-block">
        <div className="form-block__header">
          <h1>Sign Up</h1>
        </div>
        <form>
          <div className="form-block__input-wrapper">
            <input
              type="email"
              placeholder="Email"
              className="form-group__input"
              required
            />
          </div>
          <div className="form-block__input-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="form-group__input"
              required
            />
          </div>
          <div className="form-block__input-wrapper">
            <input
              type="password"
              placeholder="Confirm Password"
              className="form-group__input"
              required
            />
          </div>
          <button type="submit" className="button button--primary full-width">
            Sign Up
          </button>
        </form>
      </div>
    );
  }
  
  export default Greeting;
  export { LoginForm, SignupForm };
