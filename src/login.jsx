import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from './Api.jsx';
import { jwtDecode } from 'jwt-decode'; 

import logo from './assets/jollibeelogoderp.png';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous error

    try {
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, { username, password });

      const { token } = response.data;

      // Decode the token to extract user information
      const decodedToken = jwtDecode(token);

      // Save the token to localStorage
      localStorage.setItem("token", token);

      // Optionally, you can also save the decoded token in localStorage for easy access
      localStorage.setItem("user", JSON.stringify(decodedToken));

      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid username or password"); // Set error message
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <form onSubmit={handleSubmit}>
     <h1 className="title">
  <img
    src={logo} alt="Jollibee Logo"
    style={{ width: '50px', height: 'auto', verticalAlign: 'middle', marginRight: '10px' }} 
  />
  Employee Database
</h1>
<h5>Login as admin</h5>
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="custom-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        className="custom-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <center>
        <input type="submit" className="input" value="Enter" />
      </center>
    </form>
  );
}

export default Login;
