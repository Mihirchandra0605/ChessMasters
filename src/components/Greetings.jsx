import React, { useState, useEffect } from "react";
import "../styles/Greetings.css";
import "../styles/FormStyles.css";

function Greeting({onLoginSuccess}) {
  const [view, setView] = useState("greeting");

  useEffect(() => {
    if (view === "login" || view === "signup") {
      document.body.classList.add("scroll-lock");
    } else {
      document.body.classList.remove("scroll-lock");
    }

    return () => {
      document.body.classList.remove("scroll-lock");
    };
  }, [view]);

  const handleLoginClick = () => setView("login");
  const handleSignupClick = () => setView("signup");
  const handleHomeClick = () => setView("greeting");

  return (
    <div id="greeting">
      {view === "greeting" && (
        <>
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
          
        </>
      )}
      {view === "login" && (
        <>
          <LoginForm onLoginSuccess={onLoginSuccess} />
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

function LoginForm({ onLoginSuccess }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onLoginSuccess(); // This calls handleLogin in App, changing isLoggedIn to true
  };


  return (
    <div className="form-block">
      <div className="form-block__header">
        <h1>Login</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-block__input-wrapper">
          <input
            type="text"
            placeholder="UserName"
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
  const [role, setRole] = useState("");

  return (
    <div className="form-block">
      <div className="form-block__header">
        <h1>Sign Up</h1>
      </div>
      <form>
        <div className="form-block__input-wrapper">
          <input
            type="text"
            placeholder="UserName"
            className="form-group__input"
            required
          />
        </div>

        <div className="form-block__input-wrapper">
          <select 
            className="form-group__input" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled hidden>
              UserType
            </option>
            <option value="player">Player</option>
            <option value="coach">Coach</option>
          </select>
        </div>

        {role === "coach" && (
          <div className="form-block__input-wrapper_FIDE_ID">
            <input
              type="text"
              placeholder="FIDE ID"
              className="form-group__input"
              required
            />
          </div>
        )}

        {role === "player" && (
          <div className="form-block__input-wrapper_FIDE_ID">
            <select 
              className="form-group__input"
              required
            >
              <option value="" disabled hidden selected>
                Level
              </option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        )}

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
