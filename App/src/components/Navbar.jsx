// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import '../css/Navbar.css';
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";
import useSession from "../useSessions";

function Navbar() {
  const {currentUser} = useAuth();
  const navigate = useNavigate();
  const { session } = useSession();

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate("/login");  // redirect after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div onClick={() => { navigate("/") }} className="logo">CodePrep</div>
      <ul className="nav-links">
        {currentUser ? (<li><Link to="/Dashboard">Dashboard</Link></li>) : null}
        {currentUser ? (<li><Link to="/History">History</Link></li>) : null}
        
        {currentUser ? (
          <li><button onClick={handleSignOut} className="signout-btn">Sign Out</button></li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/SignUp">Sign Up</Link></li>
          </>
        ) }
      </ul>
    </nav>
  );
}

export default Navbar;
