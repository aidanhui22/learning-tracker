import "./App.css";
import { Link } from "react-router-dom";
import SignupForm from "./SignupForm.jsx";

function Signup() {
  return (
    <div>
      <div className="Header-container">
        <nav>
          <Link to="/login">Login </Link>
        </nav>
        <header className="Header">Learning Tracker!</header>
      </div>
      Signup
      <div className="form">
        <SignupForm></SignupForm>
      </div>
    </div>
  );
}

export default Signup;
