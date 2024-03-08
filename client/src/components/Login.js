import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaUser } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();

  const handleLoginType = (loginType) => {
    if (loginType === 'company') {
      navigate('/login/company');
    } else if (loginType === 'user') {
      navigate('/login/user');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h2>Login</h2>
        <div className="mb-4">
          <p>Select login type:</p>
          <button
            className="btn btn-primary mr-2"
            onClick={() => handleLoginType('company')}
          >
            <FaBuilding className="mr-1" /> Company Login
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleLoginType('user')}
          >
            <FaUser className="mr-1" /> Buyer Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
