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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLoginSuccess(); // This calls handleLogin in App, changing isLoggedIn to true
      } else {
        alert(data.message); // Display error message
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
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
            placeholder="Username"
            className="form-group__input"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-block__input-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="form-group__input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
  const [username, setUsername] = useState("");
  const [email,  setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level,  setLevel] = useState("");
  const [Fide_id, setFide_id] =  useState("");




  // States 
  const handleSubmit = (e) => {
        e.preventDefault();
        const userInfo = document.querySelector("#user-info");
        console.log(userInfo);
        
        // body:  JSON.stringify(data),

        const formData = new FormData(userInfo);
        console.log("formData : ", formData);
        formData.append("name","mihir");
        // fetch request 
        if(role == 'coach'){
          const data = {
            role: role,
            UserName: username,
            Email: email,
            Password: password,
            Fide_id: Fide_id,
            Status:  "active"
  
            // All other states
          }
          fetch('http://localhost:5000/auth/coachregistration',{
              method:"POST",
              body: JSON.stringify(data),// create a formBody
              headers: {
                "Content-Type": "application/json",
              },
          })
          .then((res)=>{
            const  data = res.json();
            return data;
          })
          .then((data)=>{
            console.log(data);
            // {coachData: id}
          })
          .catch((err)=>{
            console.error(err);
            // Later change this to alters 
          });
        }else{
          const data = {
            role: role,
            UserName: username,
            Email: email,
            Password: password,
            Level: level,
            Status:  "active",


  
            // All other states
          }
          fetch('http://localhost:5000/auth/playerregistration',{
            method:"POST",
            body: JSON.stringify(data),// create a formBody
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res)=>{                              
            const  data = res.json();
            return data;
          })
          .then((data)=>{
            console.log(data);
            // {playerData: id}
          })
          .catch((err)=>{
            console.error(err);
            // Later change this to alters 
          });
        } 
  }
  return (
    <div className="form-block">
      <div className="form-block__header">
        <h1>Sign Up</h1>
      </div>
      <form id="user-info" onSubmit={handleSubmit}>

        <div className="form-block__input-wrapper">
          <input
            type="text"
            placeholder="UserName"
            className="form-group__input"
            onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setFide_id(e.target.value)}
              required
            />
          </div>
        )}

        {role === "player" && (
          <div className="form-block__input-wrapper_FIDE_ID">
            <select 
              className="form-group__input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-block__input-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="form-group__input"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-block__input-wrapper">
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-group__input"
            onChange={(e) => setPassword(e.target.value)}
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
