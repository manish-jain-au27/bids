import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import baseURL from '../baseUrl';
const UserLogin = () => {
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Update the backend URL to use HTTPS
      const response = await fetch(`${baseURL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNo, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        setSuccessMessage(null);
      } else {
        const data = await response.json();
        const token = data.token;
        console.log(data)
  
        // Save the token to local storage
        localStorage.setItem('userToken', token);
  
        // Successful login logic
        setError(null);
        setSuccessMessage('Login successful!');
        navigate('/userdashboard'); // Redirect to UserDashboard
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Internal Server Error');
      setSuccessMessage(null);
    }
  };
  

  return (
    <div style={{ marginTop: '80px' }}> {/* Add margin-top inline style */}
      <h2>User Login</h2>
      <div>
        <label htmlFor="mobileNo">Mobile Number:</label>
        <input
          type="text"
          id="mobileNo"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default UserLogin;
