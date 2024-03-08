import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaEnvelope, FaMobileAlt, FaKey, FaMapMarkerAlt, FaCreditCard, FaCity, FaCheck } from 'react-icons/fa';
import DashboardLinks from './DashboardLink';
import baseURL from '../baseUrl';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EditCompany = () => {
  // State to manage company data
  const navigate = useNavigate(); // Initialize useNavigate

  const [companyData, setCompanyData] = useState({
    companyName: '',
    accManagerNo: '',
    bankDetails: {
      accName: '',
      accNo: '',
      ifscCode: '',
      bankName: '',
      city: ''
    },
    dispatchManagerMobileNo: '',
    email: '',
    factoryAddress: {
      address: '',
      state: '', // Added state field for factoryAddress
      pincode: '',
    },
    gstNo: '',
    mobileNo: '',
    password: '',
    registerAddress: {
      address: '',
      state: '', // Added state field for registerAddress
      pincode: '',
    },
    reports: [], // Not sure what this field is for, leaving it as an empty array
    shortName: ''
  });

  // Fetch company data on component mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      // Fetch company data from the API
      const token = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/company/get-company`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update company data state with fetched data
        setCompanyData(data);
      } else {
        console.error('Error fetching company data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during company data fetch:', error);
    }
  };

  // Function to handle form submission and update company data
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/company/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });
  
      if (response.ok) {
        console.log('Company data updated successfully');
        navigate('/companyDashboard'); // Redirect to company dashboard after saving
      } else {
        console.error('Error updating company data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during company data update:', error);
    }
  };
  
  // Function to handle input change and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedCompanyData = { ...companyData };

    // Check if the field is nested (e.g., bankDetails.accName)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      updatedCompanyData[parent][child] = value;
    } else {
      updatedCompanyData[name] = value;
    }

    setCompanyData(updatedCompanyData);
  };

  // Function to handle address change and update state
// Function to handle address change and update state
const handleAddressChange = (type, key, value) => {
  setCompanyData(prevState => ({
    ...prevState,
    [type]: {
      ...prevState[type],
      [key]: value,
    },
  }));
};

  return (
    <div style={{ marginTop: '70px' }}>
      <h2>Edit Company</h2>
      <DashboardLinks />

      <form onSubmit={handleUpdateCompany}>
        <div className="mb-3">
          <label htmlFor="companyName" className="form-label"><FaBuilding /> Company Name</label>
          <input type="text" className="form-control" id="companyName" name="companyName" value={companyData.companyName} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="accManagerNo" className="form-label"><FaMobileAlt /> Account Manager Number</label>
          <input type="text" className="form-control" id="accManagerNo" name="accManagerNo" value={companyData.accManagerNo} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="bankDetails.accName" className="form-label"><FaCreditCard /> Bank Account Name</label>
          <input type="text" className="form-control" id="bankDetails.accName" name="bankDetails.accName" value={companyData.bankDetails.accName} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="bankDetails.accNo" className="form-label"><FaCreditCard /> Bank Account Number</label>
          <input type="text" className="form-control" id="bankDetails.accNo" name="bankDetails.accNo" value={companyData.bankDetails.accNo} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="bankDetails.ifscCode" className="form-label"><FaCreditCard /> IFSC Code</label>
          <input type="text" className="form-control" id="bankDetails.ifscCode" name="bankDetails.ifscCode" value={companyData.bankDetails.ifscCode} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="bankDetails.bankName" className="form-label"><FaBuilding /> Bank Name</label>
          <input type="text" className="form-control" id="bankDetails.bankName" name="bankDetails.bankName" value={companyData.bankDetails.bankName} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="bankDetails.city" className="form-label"><FaCity /> Bank City</label>
          <input type="text" className="form-control" id="bankDetails.city" name="bankDetails.city" value={companyData.bankDetails.city} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="dispatchManagerMobileNo" className="form-label"><FaMobileAlt /> Dispatch Manager Mobile Number</label>
          <input type="text" className="form-control" id="dispatchManagerMobileNo" name="dispatchManagerMobileNo" value={companyData.dispatchManagerMobileNo} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label"><FaEnvelope /> Email</label>
          <input type="text" className="form-control" id="email" name="email" value={companyData.email} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
  <label htmlFor="factoryAddress.address" className="form-label"><FaMapMarkerAlt /> Factory Address</label>
  <input type="text" className="form-control" id="factoryAddress.address" name="factoryAddress.address" value={companyData.factoryAddress.address} onChange={(e) => handleAddressChange('factoryAddress', 'address', e.target.value)} />
</div>
        <div className="mb-3">
  <label htmlFor="factoryAddress.state" className="form-label">State</label>
  <input type="text" className="form-control" id="factoryAddress.state" name="factoryAddress.state" value={companyData.factoryAddress.state} onChange={(e) => handleAddressChange('factoryAddress', 'state', e.target.value)} />
</div>
<div className="mb-3">
  <label htmlFor="factoryAddress.pincode" className="form-label">Pincode</label>
  <input type="text" className="form-control" id="factoryAddress.pincode" name="factoryAddress.pincode" value={companyData.factoryAddress.pincode} onChange={(e) => handleAddressChange('factoryAddress', 'pincode', e.target.value)} />
</div>
        <div className="mb-3">
          <label htmlFor="gstNo" className="form-label"><FaCheck /> GST Number</label>
          <input type="text" className="form-control" id="gstNo" name="gstNo" value={companyData.gstNo} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="mobileNo" className="form-label"><FaMobileAlt /> Mobile Number</label>
          <input type="text" className="form-control" id="mobileNo" name="mobileNo" value={companyData.mobileNo} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label"><FaKey /> Password</label>
          <input type="password" className="form-control" id="password" name="password" value={companyData.password} onChange={handleInputChange} />
        </div>
        <div className="mb-3">
  <label htmlFor="registerAddress.address" className="form-label"><FaMapMarkerAlt /> Register Address</label>
  <input type="text" className="form-control" id="registerAddress.address" name="registerAddress.address" value={companyData.registerAddress.address} onChange={(e) => handleAddressChange('registerAddress', 'address', e.target.value)} />
</div>
        <div className="mb-3">
  <label htmlFor="registerAddress.state" className="form-label">State</label>
  <input type="text" className="form-control" id="registerAddress.state" name="registerAddress.state" value={companyData.registerAddress.state} onChange={(e) => handleAddressChange('registerAddress', 'state', e.target.value)} />
</div>
<div className="mb-3">
  <label htmlFor="registerAddress.pincode" className="form-label">Pincode</label>
  <input type="text" className="form-control" id="registerAddress.pincode" name="registerAddress.pincode" value={companyData.registerAddress.pincode} onChange={(e) => handleAddressChange('registerAddress', 'pincode', e.target.value)} />
</div>
        <div className="mb-3">
          <label htmlFor="shortName" className="form-label"><FaUser /> Short Name</label>
          <input type="text" className="form-control" id="shortName" name="shortName" value={companyData.shortName} onChange={handleInputChange} />
        </div>
        {/* Add other input fields for company data */}
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCompany;
