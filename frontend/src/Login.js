import "./App.css";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm.jsx";

function Login() {
  return (
    <div>
      <div className="Header-container">
        <nav>
          <Link to="/signup">Signup </Link>
        </nav>
        <header className="Header">Learning Tracker!</header>
      </div>
      <div className="header">Login</div>
      <div className="form">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}

export default Login;
