import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardLinks from './DashboardLink';
import baseURL from '../baseUrl';

const CreateOffer = ({ selectedProductCount, onClose }) => {
  const [rate, setRate] = useState('');
  const [noOfBags, setNoOfBags] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [time, setTime] = useState('');
  const [offerCreated, setOfferCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [product, setProduct] = useState(null); // State to store product details

  useEffect(() => {
    setOfferCreated(false);
    setRate('');
    setNoOfBags('');
    setDeliveryDays('');
    setTime('');
    setError('');
    setSuccessMessage('');
    setProduct(null); // Reset product state
  }, [selectedProductCount]);

  const handleCreateOffer = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
  
      const companyToken = localStorage.getItem('companyToken');
  
      // Fetch product details using company ID and selected count
      const productResponse = await fetch(`${baseURL}/product/get-by-count/${selectedProductCount}`, {
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
      const productData = await productResponse.json();
  
      const offerData = rate.trim().toUpperCase() === 'NA'
        ? { count: selectedProductCount, rate: 'NA', noOfBags: 'NA', deliveryDays: 'NA', time: 'NA', product: productData }
        : { count: selectedProductCount, rate, noOfBags, deliveryDays, time, product: productData };
  
      const response = await fetch(`${baseURL}/offer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify(offerData),
      });
  
      if (response.ok) {
        const { offer } = await response.json();
        console.log('Offer created successfully:', offer);
        setOfferCreated(true);
        setSuccessMessage('Offer created successfully!');
        // Do something with the offer object if needed
      } else {
        const errorData = await response.json();
        setError(`Error creating offer: ${errorData.error}`);
      }
    } catch (error) {
      setError(`Internal Server Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mt-5">
      <DashboardLinks />
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="mb-4">Create Offer</h2>
          <form>
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="count" className="form-label">
                Selected Count:
              </label>
              <input
                type="text"
                id="count"
                className="form-control"
                value={selectedProductCount}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="rate" className="form-label">
                Rate:
              </label>
              <input
                type="text"
                id="rate"
                className="form-control"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="noOfBags" className="form-label">
                No. of Bags:
              </label>
              <input
                type="number"
                id="noOfBags"
                className="form-control"
                value={noOfBags}
                onChange={(e) => setNoOfBags(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deliveryDays" className="form-label">
                Delivery Days:
              </label>
              <input
                type="number"
                id="deliveryDays"
                className="form-control"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="time" className="form-label">
                Time:
              </label>
              <select
                id="time"
                className="form-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select Time</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
                <option value="8">8 hours</option>
                <option value="10">10 hours</option>
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateOffer}
              disabled={offerCreated || loading}
            >
              {loading ? 'Creating Offer...' : 'Create Offer'}
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOffer;
