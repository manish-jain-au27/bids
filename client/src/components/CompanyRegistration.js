import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaBuilding,
  FaUser,
  FaGlobe,
  FaMobileAlt,
  FaEnvelope,
  FaKey,
  FaHome,
  FaUniversity,
} from 'react-icons/fa';
import baseURL from '../baseUrl';
const CompanyRegistration = () => {
  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState({
    companyName: '',
    shortName: '',
    registerAddress: {
      address: '',
      city: '',
      pincode: '',
      state: '',
    },
    factoryAddress: {
      address: '',
      city: '',
      pincode: '',
      state: '',
    },
    gstNo: '',
    mobileNo: '',
    accManagerName: '',
    accManagerMobileNo: '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [name]: value,
    });
  };

  const handleAddressChange = (type, e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      [type]: {
        ...companyData[type],
        [name]: value,
      },
    });
  };

  const handleBankDetailsChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({
      ...companyData,
      bankDetails: {
        ...companyData.bankDetails,
        [name]: value,
      },
    });
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post(`${baseURL}/company/register`, companyData);
      
      if (response && response.data) {
        console.log(response.data); // Log the response from the backend
        // Navigate to another page after successful registration
        navigate('/CompanyLogin');
      } else {
        console.error('Empty or undefined response data');
        // Handle the case where response data is empty or undefined
      }
    } catch (error) {
      console.error('Error during company registration:', error.response?.data || error.message);
      // Handle registration error (display a message to the user or log the error)
    }
  };

  return (
    <div className="container mt-4">
      <h2>Company Registration</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">
            Company Name <FaBuilding />
          </label>
          <input
            type="text"
            className="form-control"
            id="companyName"
            name="companyName"
            value={companyData.companyName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="shortName" className="form-label">
            Short Name <FaUser />
          </label>
          <input
            type="text"
            className="form-control"
            id="shortName"
            name="shortName"
            value={companyData.shortName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Registered Address</label>
          <div className="mb-3">
            <label htmlFor="registeredAddress" className="form-label">
              Address <FaHome />
            </label>
            <input
              type="text"
              className="form-control"
              id="registeredAddress"
              name="address"
              value={companyData.registeredAddress.address}
              onChange={(e) => handleAddressChange('registeredAddress', e)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registeredCity" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="registeredCity"
              name="city"
              value={companyData.registeredAddress.city}
              onChange={(e) => handleAddressChange('registeredAddress', e)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registeredPincode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="registeredPincode"
              name="pincode"
              value={companyData.registeredAddress.pincode}
              onChange={(e) => handleAddressChange('registeredAddress', e)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="registeredState" className="form-label">
              State
            </label>
            <input
              type="text"
              className="form-control"
              id="registeredState"
              name="state"
              value={companyData.registeredAddress.state}
              onChange={(e) => handleAddressChange('registeredAddress', e)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Factory Address</label>
          <div className="mb-3">
            <label htmlFor="factoryAddress" className="form-label">
              Address <FaHome />
            </label>
            <input
              type="text"
              className="form-control"
              id="factoryAddress"
              name="address"
              value={companyData.factoryAddress.address}
              onChange={(e) => handleAddressChange('factoryAddress', e)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="factoryCity" className="form-label">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="factoryCity"
              name="city"
              value={companyData.factoryAddress.city}
              onChange={(e) => handleAddressChange('factoryAddress', e)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="factoryPincode" className="form-label">
              Pincode
            </label>
            <input
              type="text"
              className="form-control"
              id="factoryPincode"
              name="pincode"
              value={companyData.factoryAddress.pincode}
              onChange={(e) => handleAddressChange('factoryAddress', e)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="factoryState" className="form-label">
              State
            </label>
            <input
              type="text"
              className="form-control"
              id="factoryState"
              name="state"
              value={companyData.factoryAddress.state}
              onChange={(e) => handleAddressChange('factoryAddress', e)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="gstNo" className="form-label">
            GST Number <FaGlobe />
          </label>
          <input
            type="text"
            className="form-control"
            id="gstNo"
            name="gstNo"
            value={companyData.gstNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobileNo" className="form-label">
            Mobile Number <FaMobileAlt />
          </label>
          <input
            type="text"
            className="form-control"
            id="mobileNo"
            name="mobileNo"
            value={companyData.mobileNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="accManagerName" className="form-label">
            Account Manager Name <FaUser />
          </label>
          <input
            type="text"
            className="form-control"
            id="accManagerName"
            name="accManagerName"
            value={companyData.accManagerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="accManagerMobileNo" className="form-label">
            Account Manager Mobile Number <FaMobileAlt />
          </label>
          <input
            type="text"
            className="form-control"
            id="accManagerMobileNo"
            name="accManagerMobileNo"
            value={companyData.accManagerMobileNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dispatchManagerName" className="form-label">
            Dispatch Manager Name <FaUser />
          </label>
          <input
            type="text"
            className="form-control"
            id="dispatchManagerName"
            name="dispatchManagerName"
            value={companyData.dispatchManagerName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="dispatchManagerMobileNo" className="form-label">
            Dispatch Manager Mobile Number <FaMobileAlt />
          </label>
          <input
            type="text"
            className="form-control"
            id="dispatchManagerMobileNo"
            name="dispatchManagerMobileNo"
            value={companyData.dispatchManagerMobileNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email <FaEnvelope />
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={companyData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password <FaKey />
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={companyData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bank Details</label>
          <div className="mb-3">
            <label htmlFor="accName" className="form-label">
              Account Name <FaUniversity />
            </label>
            <input
              type="text"
              className="form-control"
              id="accName"
              name="accName"
              value={companyData.bankDetails.accName}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="accNo" className="form-label">
              Account Number <FaUniversity />
            </label>
            <input
              type="text"
              className="form-control"
              id="accNo"
              name="accNo"
              value={companyData.bankDetails.accNo}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ifscCode" className="form-label">
              IFSC Code <FaUniversity />
            </label>
            <input
              type="text"
              className="form-control"
              id="ifscCode"
              name="ifscCode"
              value={companyData.bankDetails.ifscCode}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bankName" className="form-label">
              Bank Name <FaUniversity />
            </label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              name="bankName"
              value={companyData.bankDetails.bankName}
              onChange={handleBankDetailsChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bankCity" className="form-label">
              City <FaUniversity />
            </label>
            <input
              type="text"
              className="form-control"
              id="bankCity"
              name="city"
              value={companyData.bankDetails.city}
              onChange={handleBankDetailsChange}
              required
            />
          </div>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleRegistration}>
          Register Company
        </button>
      </form>
    </div>
  );
};

export default CompanyRegistration;