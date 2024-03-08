import React, { useState } from 'react';
import { FaBuilding, FaUser, FaGlobe, FaMobileAlt, FaEnvelope, FaKey, FaHome, FaUniversity, FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import baseURL from '../baseUrl';
const CompanySignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    shortName: '',
    registerAddress: {
      address: '',
      state: '', // Added state field for registerAddress
      pincode: '',
    },
    factoryAddress: {
      address: '',
      state: '', // Added state field for factoryAddress
      pincode: '',
    },
    gstNo: '',
    mobileNo: '',
    accManagerName: '',
    accManagerNo: '',
    dispatchManagerName: '',
    dispatchManagerMobileNo: '',
    email: '',
    password: '',
    bankDetails: {
      accName: '',
      accNo: '',
      ifscCode: '',
      bankName: '',
      city: '',
    },
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (type, e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [type]: {
        ...prevData[type],
        [name]: value,
      },
    }));
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      bankDetails: {
        ...prevData.bankDetails,
        [name]: value,
      },
    }));
  };

  const handleCopyAddress = () => {
    setFormData((prevData) => ({
      ...prevData,
      factoryAddress: {
        address: prevData.registerAddress.address,
        pincode: prevData.registerAddress.pincode,
        state: prevData.registerAddress.state,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/company/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
        console.log('Company registered successfully!');
        navigate('/CompanyLogin');
      } else {
        console.error('Company registration failed.');
      }
    } catch (error) {
      console.error('Error during company registration:', error.message || 'Unknown error');
    }
  };
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Company Signup</h2>
      {registrationSuccess && (
        <div className="alert alert-success" role="alert">
          Company registered successfully! You can now log in.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <FaBuilding /> Company Name:
          </label>
          <input
            type="text"
            className="form-control"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaBuilding /> Short Name:
          </label>
          <input
            type="text"
            className="form-control"
            name="shortName"
            value={formData.shortName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaBuilding /> Register Address:
          </label>
          <div>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.registerAddress.address}
              onChange={(e) => handleAddressChange('registerAddress', e)}
            />
          </div>
          <div className="form-group">
  <label htmlFor="registerState">State:</label>
  <select
    className="form-control"
    id="registerState"
    name="state"
    value={formData.registerAddress.state}
    onChange={(e) => handleAddressChange('registerAddress', e)}
  >
    <option value="">Select State</option>
    {states.map((state) => (
      <option key={state} value={state}>
        {state}
      </option>
    ))}
  </select>
</div>

          <div>
            <label>Pincode:</label>
            <input
              type="text"
              className="form-control"
              name="pincode"
              value={formData.registerAddress.pincode}
              onChange={(e) => handleAddressChange('registerAddress', e)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <FaBuilding /> Factory Address:
          </label>
          <div>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.factoryAddress.address}
              onChange={(e) => handleAddressChange('factoryAddress', e)}
            />
          </div>
          <div className="form-group">
  <label htmlFor="factoryState">State:</label>
  <select
    className="form-control"
    id="factoryState"
    name="state"
    value={formData.factoryAddress.state}
    onChange={(e) => handleAddressChange('factoryAddress', e)}
  >
    <option value="">Select State</option>
    {states.map((state) => (
      <option key={state} value={state}>{state}</option>
    ))}
  </select>
</div>

          <div>
            <label>Pincode:</label>
            <input
              type="text"
              className="form-control"
              name="pincode"
              value={formData.factoryAddress.pincode}
              onChange={(e) => handleAddressChange('factoryAddress', e)}
            />
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="copyAddress"
              onChange={handleCopyAddress}
            />
            <label className="form-check-label" htmlFor="copyAddress">
              Copy register address and pincode
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            <FaGlobe /> GST Number:
          </label>
          <input
            type="text"
            className="form-control"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaMobileAlt /> Mobile Number:
          </label>
          <input
            type="text"
            className="form-control"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaUser /> Account Manager Name:
          </label>
          <input
            type="text"
            className="form-control"
            name="accManagerName"
            value={formData.accManagerName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaMobileAlt /> Account Manager Number:
          </label>
          <input
            type="text"
            className="form-control"
            name="accManagerNo"
            value={formData.accManagerNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaUser /> Dispatch Manager Name:
          </label>
          <input
            type="text"
            className="form-control"
            name="dispatchManagerName"
            value={formData.dispatchManagerName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaMobileAlt /> Dispatch Manager Mobile Number:
          </label>
          <input
            type="text"
            className="form-control"
            name="dispatchManagerMobileNo"
            value={formData.dispatchManagerMobileNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <FaEnvelope /> Email:
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaKey /> Password:
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>
            <FaUniversity /> Bank Details:
          </label>
          <div>
            <label>Account Name:</label>
            <input
              type="text"
              className="form-control"
              name="accName"
              value={formData.bankDetails.accName}
              onChange={handleBankDetailsChange}
            />
          </div>
          <div>
            <label>Account Number:</label>
            <input
              type="text"
              className="form-control"
              name="accNo"
              value={formData.bankDetails.accNo}
              onChange={handleBankDetailsChange}
            />
          </div>
          <div>
            <label>IFSC Code:</label>
            <input
              type="text"
              className="form-control"
              name="ifscCode"
              value={formData.bankDetails.ifscCode}
              onChange={handleBankDetailsChange}
            />
          </div>
          <div>
            <label>Bank Name:</label>
            <input
              type="text"
              className="form-control"
              name="bankName"
              value={formData.bankDetails.bankName}
              onChange={handleBankDetailsChange}
            />
          </div>
          <div>
            <label>City:</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.bankDetails.city}
              onChange={handleBankDetailsChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default CompanySignup;
