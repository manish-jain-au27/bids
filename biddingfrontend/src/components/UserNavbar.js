// UserNavbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const UserNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-5">
      <div className="container">
        <Link className="navbar-brand" to="/userdashboard" style={{ color: '#007BFF', fontWeight: 'bold' }}>
          User Dashboard
        </Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/wishlist" style={{ color: '#28a745' }}>Wishlist</Link>
            </li>
            {/* <li className="nav-item">
              <Link className="nav-link" to="/add-product" style={{ color: '#007BFF' }}>Add Product</Link>
            </li> */}
            {/* Add this part for "ProductDetails" */}
            <li className="nav-item">
              <Link className="nav-link" to="/product-details/:productId" style={{ color: '#007BFF' }}>Product Details</Link>
            </li>
            {/* Add more navigation links as needed */}
            <li className="nav-item">
              <Link className="nav-link" to="/accepted-bids" style={{ color: '#dc3545' }}>Accepted Bids</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/performa" style={{ color: '#6610f2' }}>Performa</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/update-payment" style={{ color: '#007BFF' }}>Update Payment</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/invoice" style={{ color: '#e83e8c' }}>Invoice</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
