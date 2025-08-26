import React, { useState } from "react";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import "../css/SignUp.css";
import { Link } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await doCreateUserWithEmailAndPassword(email, password);
      setIsSignedUp(true);
      navigate("/Login");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      setIsSignedUp(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-container">
        <div className="email-signup-form">
            {isSignedUp ? (
                navigate("/Dashboard")
            ) : (
                <>
                <h1>Create a new account</h1>
                {error && <p className="error">{error}</p>}

                <form onSubmit={onSubmit} className="form">
                    <label>Email</label>
                    <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    />

                    <label>Password</label>
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    />

                    <button type="submit" className="form-buttons">Sign Up</button>
                </form>
                </>
            )}
        </div>
        <div className="google-signup-form">
            <button onClick={handleGoogleSignIn} className="form-buttons">Sign Up with Google</button>
            <Link to="/Login">Login?</Link>
        </div>
    </div>
  );
}

export default SignUp;
