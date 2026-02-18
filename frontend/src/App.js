import FormComponent from "./EntryForm";
import DisplayEntryComponent from "./EntryDisplay";
import { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const [entries, setEntries] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("userToken"));

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setToken("");
    window.location.href = "/login";
  };

  async function fetchData() {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/api/entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await result.json();
      setEntries(data);
    } catch (err) {
      console.log(err.message);
    }
  }

  const [streak, setStreak] = useState(0);

  async function fetchStreak() {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_API_URL}/api/entries/streak`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await result.json();
      setStreak(data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    fetchData();
    fetchStreak();
  }, [token]);

  return (
    <div>
      <div className="Header-container">
        <nav>
          <Link to="/signup">Signup </Link>
          <Link to="/login">Login</Link>
          <button onClick={handleLogout}>Logout</button>
        </nav>
        <header className="Header">
          Learning Tracker! Current Streak: {streak}
        </header>
      </div>
      <div className="Container">
        <div className="Left-container">
          <FormComponent
            token={token}
            refetchData={fetchData}
            refetchStreak={fetchStreak}
          />
        </div>
        <div className="Right-container">
          <DisplayEntryComponent
            token={token}
            entries={entries}
            refetchData={fetchData}
            refetchStreak={fetchStreak}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
