import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Login from "./components/Login";
import InterviewSpace from "./components/InterviewSpace";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={< Dashboard/>} />
          <Route path="/SignUp" element={< SignUp/>} />
          <Route path="/Login" element={< Login/>} />
          <Route path="/Dashboard" element={< Dashboard/>} />
          <Route path="/interviewSpace" element={< InterviewSpace/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
