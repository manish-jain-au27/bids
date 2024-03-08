// CompanyLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FaUserLock } from 'react-icons/fa';
import baseURL from '../baseUrl';
const CompanyLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ mobileNo: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleLogin = async () => {
      try {
        setLoading(true);
        setError('');
  
        const response = await fetch(`${baseURL}/company/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const { company, token } = await response.json();
          console.log('Company logged in successfully:', company);
          console.log('Token:', token);
  
          // Save the token to local storage
          localStorage.setItem('companyToken', token);
  
          // Redirect to company dashboard after successful login
          navigate('/companydashboard'); // Remove the '*' from the path
          console.log('Redirecting...');
        } else {
          const { error } = await response.json();
          setError(`Company login failed: ${error}`);
          console.error('Company login failed:', error);
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Error during company login:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Company Login</h2>
      <Form>
        <Form.Group controlId="formMobileNo">
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your mobile number"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : <FaUserLock className="mr-1" />} Login
        </Button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </Form>
    </div>
  );
};

export default CompanyLogin;
