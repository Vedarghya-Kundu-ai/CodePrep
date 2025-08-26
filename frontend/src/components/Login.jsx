import React, { useState } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/Login.css";


function Login() {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
            // doSendEmailVerification()
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }
    return (
        <div className="form-container">
            <div className="email-login-form">
                    <h1>Login to your account</h1>
                    {userLoggedIn ? <Navigate to="/Dashboard" /> : null }
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

                        <button type="submit" className="form-buttons">Log In</button>
                    </form>
            </div>
            <div className="google-login-form">
                <button onClick={onGoogleSignIn} className="form-buttons">Continue with Google</button>
                <Link to='/SignUp'>create a new account?</Link>
            </div>
        </div>
    );
}

export default Login;