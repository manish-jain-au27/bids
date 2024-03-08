import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import baseURL from '../baseUrl';
const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    gstNo: '',
    mobileNo: '',
    email: '',
    password: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    city: '',
    quality: '',
    registerAddress: '',
    registerPincode: '',
    registerState: '',
    shippingAddress: '',
    shippingPincode: '',
    shippingState: '',
    market: 'domestic',
    productDetails: [],
  });

  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  const states = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Lakshadweep',
    'Delhi',
    'Puducherry',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${baseURL}/product/products`);
        setProducts(response.data.products);
        console.log('Fetched products:', response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductDetailsChange = (index, e) => {
    const newProductDetails = [...formData.productDetails];
    newProductDetails[index][e.target.name] = e.target.value;
    setFormData({ ...formData, productDetails: newProductDetails });
  };

  const addProductDetails = () => {
    setFormData({
      ...formData,
      productDetails: [...formData.productDetails, { count: '', monthlyBagRequirement: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/user/register', {
        name: formData.name,
        gstNo: formData.gstNo,
        mobileNo: formData.mobileNo,
        email: formData.email,
        password: formData.password,
        bankDetails: {
          bankName: formData.bankName,
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          city: formData.city,
        },
        quality: formData.quality,
        registerAddress: {
          address: formData.registerAddress,
          pincode: formData.registerPincode,
          state: formData.registerState,
        },
        shippingAddress: {
          address: formData.shippingAddress,
          pincode: formData.shippingPincode,
          state: formData.shippingState,
        },
        market: formData.market,
        productDetails: formData.productDetails,
      });
      alert('User signed up successfully');
      setFormData({
        name: '',
        gstNo: '',
        mobileNo: '',
        email: '',
        password: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        city: '',
        quality: '',
        registerAddress: '',
        registerPincode: '',
        registerState: '',
        shippingAddress: '',
        shippingPincode: '',
        shippingState: '',
        market: 'domestic',
        productDetails: [],
      });
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to sign up user');
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3">
        <h2 className="text-center mb-4">User Signup</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {/* GST No. */}
          <div className="form-group">
            <label htmlFor="gstNo">GST No.</label>
            <input
              type="text"
              className="form-control"
              id="gstNo"
              name="gstNo"
              value={formData.gstNo}
              onChange={handleChange}
              required
            />
          </div>
          {/* Mobile No. */}
          <div className="form-group">
            <label htmlFor="mobileNo">Mobile No.</label>
            <input
              type="text"
              className="form-control"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              required
            />
          </div>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* Bank Name */}
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />
          </div>
          {/* Account Name */}
          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input
              type="text"
              className="form-control"
              id="accountName"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
            />
          </div>
          {/* Account Number */}
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </div>
          {/* IFSC Code */}
          <div className="form-group">
            <label htmlFor="ifscCode">IFSC Code</label>
            <input
              type="text"
              className="form-control"
              id="ifscCode"
              name="ifscCode"
              value={formData.ifscCode}
              onChange={handleChange}
            />
          </div>
          {/* City */}
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          {/* Quality */}
          <div className="form-group">
            <label htmlFor="quality">Quality</label>
            <input
              type="text"
              className="form-control"
              id="quality"
              name="quality"
              value={formData.quality}
              onChange={handleChange}
            />
          </div>
          {/* Register Address */}
          <div className="form-group">
            <label htmlFor="registerAddress">Register Address</label>
            <input
              type="text"
              className="form-control"
              id="registerAddress"
              name="registerAddress"
              value={formData.registerAddress}
              onChange={handleChange}
            />
          </div>
          {/* Register Pincode */}
          <div className="form-group">
            <label htmlFor="registerPincode">Register Pincode</label>
            <input
              type="text"
              className="form-control"
              id="registerPincode"
              name="registerPincode"
              value={formData.registerPincode}
              onChange={handleChange}
            />
          </div>
          {/* Register State */}
          <div className="form-group">
            <label htmlFor="registerState">Register State</label>
            <select
              className="form-control"
              id="registerState"
              name="registerState"
              value={formData.registerState}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          {/* Shipping Address */}
          <div className="form-group">
            <label htmlFor="shippingAddress">Shipping Address</label>
            <input
              type="text"
              className="form-control"
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
            />
          </div>
          {/* Shipping Pincode */}
          <div className="form-group">
            <label htmlFor="shippingPincode">Shipping Pincode</label>
            <input
              type="text"
              className="form-control"
              id="shippingPincode"
              name="shippingPincode"
              value={formData.shippingPincode}
              onChange={handleChange}
            />
          </div>
          {/* Shipping State */}
          <div className="form-group">
            <label htmlFor="shippingState">Shipping State</label>
            <select
              className="form-control"
              id="shippingState"
              name="shippingState"
              value={formData.shippingState}
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          {/* Market */}
          <div className="form-group">
            <label htmlFor="market">Market</label>
            <select
              className="form-control"
              id="market"
              name="market"
              value={formData.market}
              onChange={handleChange}
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
          </div>
          {/* Product Details */}
          {formData.productDetails.map((product, index) => (
            <div key={index}>
              <div className="form-group">
                <label htmlFor={`count${index}`}>Count</label>
                <select
                  className="form-control"
                  id={`count${index}`}
                  name="count"
                  value={product.count}
                  onChange={(e) => handleProductDetailsChange(index, e)}
                  required
                >
                  <option value="">Select Count</option>
                  {products.map((product) => (
                    <option key={product._id} value={product.count}>
                      {product.count}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`monthlyBagRequirement${index}`}>Monthly Bag Requirement</label>
                <input
                  type="text"
                  className="form-control"
                  id={`monthlyBagRequirement${index}`}
                  name="monthlyBagRequirement"
                  value={product.monthlyBagRequirement}
                  onChange={(e) => handleProductDetailsChange(index, e)}
                  required
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addProductDetails}>
            Add Product
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
