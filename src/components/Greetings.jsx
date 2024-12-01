import React, { useState, useEffect } from "react";
import "../styles/Greetings.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import "../styles/FormStyles.css";

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

// function LoginForm({ onLoginSuccess }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/auth/signin', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         onLoginSuccess(); // This calls handleLogin in App, changing isLoggedIn to true
//         console.log("Success");
//         const role = data.userType;
//         if(role == "Player"){
//           navigate("/PlayerDashboard?role=player");
//         }else{
//           navigate("/CoachDashboard?role=coach");
//         }
//       } else {
//         alert(data.message); // Display error message
//       }
//     } catch (error) {
//       console.error('Error during sign-in:', error);
//     }
//   };

//   return (
//     <div className="form-block">
//       <div className="form-block__header">
//         <h1>Login</h1>
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div className="form-block__input-wrapper">
//           <input
//             type="text"
//             placeholder="Username"
//             className="form-group__input"
//             required
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>

//         <div className="form-block__input-wrapper">
//           <input
//             type="password"
//             placeholder="Password"
//             className="form-group__input"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         <button type="submit" className="button button--primary full-width">
//           Log In
//         </button>
//       </form>
//     </div>
//   );
// }

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authResponse, setAuthResponse] = useState(null); // Store the API response
  const [isSubmitting, setIsSubmitting] = useState(false); // Manage submit state
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true); // Trigger the API call in useEffect
  };

  useEffect(() => {
    // Only trigger the API call when isSubmitting is true
    if (isSubmitting) {
      const login = async () => {
        try {
          const response = await fetch('http://localhost:3000/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),

          });
          const data = await response.json();
          setAuthResponse({ data, ok: response.ok });
        } catch (error) {
          console.error('Error during sign-in:', error);
          setAuthResponse({ data: null, ok: false, error });
        } finally {
          setIsSubmitting(false); // Reset submission state
        }
      };

      login();
    }
  }, [isSubmitting, username, password]);

  useEffect(() => {
    if (authResponse) {
      const { data, ok } = authResponse;

      if (ok) {
        if (username == 'admin' && password == 'secret'){
          onLoginSuccess();
          navigate("/AdminDashboard");
        }
        else {
        onLoginSuccess(); // This calls handleLogin in App, changing isLoggedIn to true
        console.log("Success");
        const role = data.userType;
        if (role === "player") {
          navigate("/PlayerDashboard?role=player");
        } else {
          navigate("/CoachDashboard?role=coach");
        }
      }
      } else {
        alert(data?.message || 'Login failed'); // Display error message
      }
    }
  }, [authResponse, onLoginSuccess, navigate]);

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
            disabled={isSubmitting} // Disable input while submitting
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
            disabled={isSubmitting} // Disable input while submitting
          />
        </div>

        <button type="submit" className="button button--primary full-width" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

function SignupForm() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [level, setLevel] = useState("");
  const [fideId, setFideId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure password and confirm password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Set up the data object to match the backend structure
    const data = {
      UserName: username,
      Email: email,
      Password: password,
      Role: role,
      Status: "Active",
      ...(role === "player" && { Level: level }), // Only include Level if the role is player
      ...(role === "coach" && { Fide_id: fideId }) // Only include Fide_id if the role is coach
    };

    // Perform the fetch request
    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Handle successful registration (e.g., redirect or display success message)
      })
      .catch((err) => {
        console.error(err);
        // Display error message
      });
  };

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
            value={username}
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
          <div className="form-block__input-wrapper">
            <input
              type="text"
              placeholder="FIDE ID"
              className="form-group__input"
              value={fideId}
              onChange={(e) => setFideId(e.target.value)}
              required
            />
          </div>
        )}

        {role === "player" && (
          <div className="form-block__input-wrapper">
            <select
              className="form-group__input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="" disabled hidden>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-block__input-wrapper">
          <input
            type="password"
            placeholder="Password"
            className="form-group__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-block__input-wrapper">
          <input
            type="password"
            placeholder="Confirm Password"
            className="form-group__input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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