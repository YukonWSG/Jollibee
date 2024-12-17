import React, { useEffect, useState } from "react";

function Signup() {

  useEffect(() => {
    document.title = "Signup Page";
  }, []);


  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      setErrorMessage(""); 
      alert("Signup successful!");

    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="title">Signup</h1>
      <br />
      <input
        type="text"
        placeholder="Username"
        className="input"
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Confirm Password"
        className="input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <br />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <center>
        <input type="submit" className="input" value="Sign Up" />
      </center>
      <a href="/login">Already have an account? Login</a>
    </form>
  );
}

export default Signup;
