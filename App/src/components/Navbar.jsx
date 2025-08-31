import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";
import useSession from "../useSessions";

function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { session } = useSession();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0d1117] border-b border-[#222] px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="text-[#58a6ff] text-2xl font-bold">{`</>`}</span>
        <span className="text-3xl font-bold bg-gradient-to-r from-[#58a6ff] to-[#22d3ee] bg-clip-text text-transparent">
          CodePrep
        </span>
      </div>

      {/* Nav Links */}
      <ul className="flex items-center gap-6 text-[#c9d1d9] font-medium text-xl">
        {currentUser && (
          <>
            <li>
              <Link
                to="/Dashboard"
                className="hover:text-[#58a6ff] transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/History"
                className="hover:text-[#58a6ff] transition-colors"
              >
                History
              </Link>
            </li>
          </>
        )}

        {currentUser ? (
          <li>
            <button
              onClick={handleSignOut}
              className="cursor-pointer bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold px-4 py-2 rounded-md transition-transform transform hover:scale-105"
            >
              Sign Out
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="hover:text-[#58a6ff] transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/SignUp"
                className="hover:text-[#58a6ff] transition-colors"
              >
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
