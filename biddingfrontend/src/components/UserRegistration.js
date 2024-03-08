import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsPerson, BsFillHouseDoorFill, BsCreditCard, BsEnvelope, BsKey, BsPlusSquare } from 'react-icons/bs';
import baseURL from '../baseUrl';

const states = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const UserRegistration = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    address: '',
    gstNo: '',
    mobileNo: '',
    email: '',
    password: '',
    bankDetails: {
      accName: '',
      accNo: '',
      ifscCode: '',
      bankName: '',
      city: '',
    },
    registerAddress: {
      address: '',
      pincode: '',
      state: '',
    },
    shippingAddress: {
      address: '',
      pincode: '',
      state: '',
    },
    products: [
      {
        quality: '',
        count: '',
        monthlyBagRequirement: 0,
      },
    ],
    registeredProducts: [], // State to store registered products
  });

  const [registeredProductsLoading, setRegisteredProductsLoading] = useState(false);

  useEffect(() => {
    const fetchRegisteredProducts = async () => {
      try {
        setRegisteredProductsLoading(true);
        const response = await axios.get('http://localhost:3001/api/product/products');
        console.log('Registered Products:', response.data);
        setUserData((prevData) => ({
          ...prevData,
          registeredProducts: response.data,
        }));
      } catch (error) {
        console.error('Failed to fetch registered products:', error.message);
      } finally {
        setRegisteredProductsLoading(false);
      }
    };

    fetchRegisteredProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      bankDetails: {
        ...userData.bankDetails,
        [name]: value,
      },
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    setUserData((prevData) => {
      const updatedProducts = [...prevData.products];
      updatedProducts[index] = {
        ...updatedProducts[index],
        [name]: value,
      };
      return {
        ...prevData,
        products: updatedProducts,
      };
    });
  };

  const handleAddProduct = () => {
    setUserData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        {
          quality: '',
          count: '',
          monthlyBagRequirement: 0,
        },
      ],
    }));
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post(`${baseURL}/user/register`, userData);
      console.log(response.data); // Log the response from the backend

      // Navigate to another page after successful registration
      navigate('/UserLogin'); // Change the path as needed
    } catch (error) {
      console.error('Error during user registration:', error.response?.data || error.message);
      // Handle registration error (display a message to the user or log the error)
    }
  };

  return (
    <div className="container mt-4">
      <h2>User Registration</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name <BsPerson />
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address <BsFillHouseDoorFill />
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="gstNo" className="form-label">
            GST Number <BsCreditCard />
          </label>
          <input
            type="text"
            className="form-control"
            id="gstNo"
            name="gstNo"
            value={userData.gstNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobileNo" className="form-label">
            Mobile Number <BsCreditCard />
          </label>
          <input
            type="text"
            className="form-control"
            id="mobileNo"
            name="mobileNo"
            value={userData.mobileNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email <BsEnvelope />
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password <BsKey />
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Products</label>
          {userData.products.map((product, index) => (
            <div key={index}>
              <div className="mb-3">
                <label htmlFor={`productQuality${index}`} className="form-label">
                  Quality
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`productQuality${index}`}
                  name="quality"
                  value={product.quality}
                  onChange={(e) => handleProductChange(index, e)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor={`productCount${index}`} className="form-label">
                  Count
                </label>
                <select
                  className="form-select"
                  id={`productCount${index}`}
                  name="count"
                  value={product.count}
                  onChange={(e) => handleProductChange(index, e)}
                  required
                >
                  <option value="">Select Count</option>
                  {userData.registeredProducts.map((registeredProduct) => (
                    <option key={registeredProduct._id} value={registeredProduct.count}>
                      {registeredProduct.count}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor={`monthlyBagRequirement${index}`} className="form-label">
                  Monthly Bag Requirement
                </label>
                <input
                  type="number"
                  className="form-control"
                  id={`monthlyBagRequirement${index}`}
                  name="monthlyBagRequirement"
                  value={product.monthlyBagRequirement}
                  onChange={(e) => handleProductChange(index, e)}
                  required
                />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
            <BsPlusSquare /> Add Product
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Register Address</label>
          <div className="mb-3">
            <label htmlFor="registerAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="registerAddress"
              name="address"
              value={userData.registerAddress.address}
              onChange={(e) => setUserData({ ...userData, registerAddress: { ...userData.registerAddress, address: e.target.value } })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registerPincode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="registerPincode"
              name="pincode"
              value={userData.registerAddress.pincode}
              onChange={(e) => setUserData({ ...userData, registerAddress: { ...userData.registerAddress, pincode: e.target.value } })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registerState" className="form-label">
              State
            </label>
            <select
              className="form-select"
              id="registerState"
              name="state"
              value={userData.registerAddress.state}
              onChange={(e) => setUserData({ ...userData, registerAddress: { ...userData.registerAddress, state: e.target.value } })}
              required
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Shipping Address</label>
          <div className="mb-3">
            <label htmlFor="shippingAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="shippingAddress"
              name="address"
              value={userData.shippingAddress.address}
              onChange={(e) => setUserData({ ...userData, shippingAddress: { ...userData.shippingAddress, address: e.target.value } })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="shippingPincode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="shippingPincode"
              name="pincode"
              value={userData.shippingAddress.pincode}
              onChange={(e) => setUserData({ ...userData, shippingAddress: { ...userData.shippingAddress, pincode: e.target.value } })}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="shippingState" className="form-label">
              State
            </label>
            <select
              className="form-select"
              id="shippingState"
              name="state"
              value={userData.shippingAddress.state}
              onChange={(e) => setUserData({ ...userData, shippingAddress: { ...userData.shippingAddress, state: e.target.value } })}
              required
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Bank Details</label>
          <div className="mb-3">
            <label htmlFor="accName" className="form-label">
              Account Name
            </label>
            <input
              type="text"
              className="form-control"
              id="accName"
              name="accName"
              value={userData.bankDetails.accName}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="accNo" className="form-label">
              Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="accNo"
              name="accNo"
              value={userData.bankDetails.accNo}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ifscCode" className="form-label">
              IFSC Code
            </label>
            <input
              type="text"
              className="form-control"
              id="ifscCode"
              name="ifscCode"
              value={userData.bankDetails.ifscCode}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bankName" className="form-label">
              Bank Name
            </label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              name="bankName"
              value={userData.bankDetails.bankName}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              name="city"
              value={userData.bankDetails.city}
              onChange={handleBankDetailsChange}
              required
            />
          </div>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleRegistration}>
          Register User
        </button>
      </form>
    </div>
  );
};

export default UserRegistration;
