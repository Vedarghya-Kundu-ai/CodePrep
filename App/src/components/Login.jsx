import React, { useState } from "react";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";
import { Navigate, Link } from "react-router-dom";

function Login() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        setError("Invalid credentials, please try again.");
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithGoogle();
      } catch (err) {
        setError("Google sign-in failed.");
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4">
      {userLoggedIn ? <Navigate to="/Dashboard" /> : null}

      <div className="w-full max-w-md bg-[#161b22] rounded-xl shadow-xl p-8">
        {/* Title */}
        <h1 className="text-[#58a6ff] text-2xl font-semibold text-center mb-6">
          Login to your account
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8b949e] mb-1">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:outline-none focus:border-[#58a6ff] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8b949e] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-[#e6edf3] focus:outline-none focus:border-[#58a6ff] transition"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isSigningIn ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-4">
          <button
            onClick={onGoogleSignIn}
            className="w-full cursor-pointer bg-[#24292f] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] font-medium py-2 rounded-lg transition-transform transform hover:-translate-y-0.5"
          >
            Continue with Google
          </button>
        </div>

        {/* Signup Link */}
        <div className="mt-4 text-center">
          <Link
            to="/SignUp"
            className="text-sm text-[#58a6ff] hover:text-[#79c0ff] hover:underline"
          >
            create a new account?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
