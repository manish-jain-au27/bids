import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import baseURL from '../baseUrl';

const UserDashboard = () => {
  const [liveOffers, setLiveOffers] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [bidDetails, setBidDetails] = useState({ rate: '', noOfBags: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) {
        setError('Token not found. Please log in.');
        setLoading(false);
        return;
      }

      const userResponse = await fetch(`${baseURL}/user/user-details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        const userDataError = await userResponse.json();
        setError(userDataError.error);
        setLoading(false);
        return;
      }

      const userData = await userResponse.json();
      setUserName(userData.name || 'User');

      const liveOffersResponse = await fetch(`${baseURL}/user/live-offers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!liveOffersResponse.ok) {
        const liveOffersError = await liveOffersResponse.json();
        setError(liveOffersError.error);
        setLoading(false);
        return;
      }

      const liveOffersData = await liveOffersResponse.json();

      if (Array.isArray(liveOffersData.liveOffers) && liveOffersData.liveOffers.length > 0) {
        setLiveOffers(liveOffersData.liveOffers);
        setError(null);
      } else {
        setLiveOffers([]);
        setError('No live offers available.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Internal Server Error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlaceBid = (offer) => {
    setSelectedOffer(offer);
    setBidDetails({ rate: '', noOfBags: '' });
    setSuccessMessage('');
  };

  const handleBidDetailsChange = (field, value) => {
    setBidDetails((prevBidDetails) => ({
      ...prevBidDetails,
      [field]: value,
    }));
  };
  const handleSubmitBid = async () => {
    try {
      const token = localStorage.getItem('userToken');
  
      if (!token) {
        setError('Token not found. Please log in.');
        return;
      }
  
      const body = {
        offerId: selectedOffer._id,
        rate: bidDetails.rate,
        noOfBags: bidDetails.noOfBags,
        offer: selectedOffer, // Include the offer details here
        product: selectedOffer.productId, // Include the product details here
      };
  
      console.log('Request body:', body); // Log the request body
  
      const response = await fetch(`${baseURL}/user/place-bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        setError(responseData.error || 'Failed to place bid.');
        return;
      }
  
      console.log('Bid placed successfully');
      setSelectedOffer(null);
      setBidDetails({ rate: '', noOfBags: '' });
      fetchData();
      setSuccessMessage('Bid placed successfully!');
      
      // Update the UI to show the bid details
      console.log('Bid details:', responseData);
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Internal Server Error');
    }
  };
  
  
  
  
  
  

  const handleCountClick = async (count) => {
    try {
      const token = localStorage.getItem('userToken');
      const encodedCount = encodeURIComponent(count);
      const response = await fetch(`${baseURL}/report/get-report-by-count/${encodedCount}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      const reportData = await response.json();
      navigate(`/report/${encodedCount}`, { state: { reportData } });
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Internal Server Error');
    }
  };

  return (
    <div className="container mt-4">
      <UserNavbar />
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">{userName}, Dashboard</h2>

          {loading && (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {!loading && !error && (
            <div>
              <h4>Live Offers</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Count</th>
                    <th>Rate</th>
                    <th>No. of Bags</th>
                    <th>Delivery Days</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {liveOffers.map((offer) => (
                    <tr key={offer._id}>
                      <td>{offer.shortName}</td>
                      <td>
                        <button
                          className="btn btn-link"
                          onClick={() => handleCountClick(offer.count)}
                        >
                          {offer.count}
                        </button>
                      </td>
                      <td>
                        {selectedOffer && selectedOffer._id === offer._id ? (
                          <div>
                            <p>{offer.rate}</p>
                            <input
                              type="text"
                              placeholder="Enter Rate"
                              value={bidDetails.rate}
                              onChange={(e) => handleBidDetailsChange('rate', e.target.value)}
                            />
                          </div>
                        ) : (
                          offer.rate
                        )}
                      </td>
                      <td>
                        {selectedOffer && selectedOffer._id === offer._id ? (
                          <div>
                            <p>{offer.noOfBags}</p>
                            <input
                              type="text"
                              placeholder="Enter No. of Bags"
                              value={bidDetails.noOfBags}
                              onChange={(e) => handleBidDetailsChange('noOfBags', e.target.value)}
                            />
                          </div>
                        ) : (
                          offer.noOfBags
                        )}
                      </td>
                      <td>{offer.deliveryDays}</td>
                      <td>{offer.time}</td>
                      <td>
                        {selectedOffer && selectedOffer._id === offer._id ? (
                          <button className="btn btn-primary" onClick={handleSubmitBid}>
                            Submit Bid
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handlePlaceBid(offer)}
                          >
                            Place Bid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
