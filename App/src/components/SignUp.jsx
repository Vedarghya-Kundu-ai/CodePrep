import React, { useState } from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";

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
      setError("Sign up failed. Try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await doSignInWithGoogle();
      setIsSignedUp(true);
      navigate("/Dashboard");
    } catch (err) {
      setError("Google sign up failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {isSignedUp ? null : (
        <div className="w-full max-w-md bg-[#161b22] rounded-xl shadow-xl p-8">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-[#58a6ff] mb-6">
            Create a new account
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
              className=" cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-transform transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </form>

          {/* Google Sign Up */}
          <div className="mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="cursor-pointer w-full bg-[#24292f] hover:bg-[#30363d] text-[#e6edf3] border border-[#30363d] font-medium py-2 rounded-lg transition-transform transform hover:-translate-y-0.5"
            >
              Sign Up with Google
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <Link
              to="/Login"
              className="text-sm text-[#58a6ff] hover:text-[#79c0ff] hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
