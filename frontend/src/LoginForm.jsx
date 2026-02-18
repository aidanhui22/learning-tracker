import React, { useState } from "react";

const FormComponent = ({ refetchData, refetchStreak }) => {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [error, setError] = useState("");

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPasswordHash(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: passwordHash,
        }),
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        requestOptions,
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.error + "Login failed");
        return;
      }
      const data = await response.json();
      localStorage.setItem("userToken", data.token);
      window.location.href = "/";
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="Form">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label style={{ padding: "2%" }}>
        <p>Email:</p>
        <input type="text" className="Input-size" onChange={handleEmail} />
      </label>
      <label style={{ padding: "2%" }}>
        <p>Password:</p>
        <input type="text" className="Input-size" onChange={handlePassword} />
      </label>
      <button
        className="Submit-button"
        type="submit"
        disabled={email.length < 6 || !email.includes("@")}
      >
        Submit
      </button>
    </form>
  );
};

export default FormComponent;
