import React, { useState, useEffect } from 'react';
import DashboardLinks from './DashboardLink';
import baseURL from '../baseUrl';

const ActionOnOffer = () => {
  const [liveOffers, setLiveOffers] = useState([]);
  const [updatedOffers, setUpdatedOffers] = useState({});
  const [updateMessage, setUpdateMessage] = useState('');
  const [withdrawMessage, setWithdrawMessage] = useState('');
  const companyToken = localStorage.getItem('companyToken');

  useEffect(() => {
    fetchLiveOffers();
  }, []);

  const fetchLiveOffers = async () => {
    try {
      const response = await fetch(`${baseURL}/offer/getall`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const offers = data.offers;
        console.log(offers);
        if (offers) {
          setLiveOffers(offers.map((offer) => ({ ...offer, timeRemaining: calculateTimeRemaining(offer) })));
          const initialUpdatedOffers = {};
          offers.forEach((offer) => {
            initialUpdatedOffers[offer._id] = {
              rate: offer.rate,
              noOfBags: offer.noOfBags,
              deliveryDays: offer.deliveryDays,
              time: offer.time,
            };
          });
          setUpdatedOffers(initialUpdatedOffers);
        } else {
          console.error('Error fetching live offers: Offers are undefined.');
        }
      } else {
        console.error('Error fetching live offers:', response.statusText);
      }
    } catch (error) {
      console.error('Error during live offers fetch:', error);
    }
  };

  const handleUpdateOffer = async (offerId) => {
    try {
      const updatedOfferData = updatedOffers[offerId];
      const response = await fetch(`${baseURL}/offer/update/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify(updatedOfferData),
      });

      if (response.ok) {
        fetchLiveOffers();
        setUpdateMessage('Offer updated successfully.');
        setTimeout(() => setUpdateMessage(''), 3000);
      } else {
        console.error('Error updating offer:', response.statusText);
        setUpdateMessage('Error updating offer. Please try again.');
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      setUpdateMessage('Error updating offer. Please try again.');
    }
  };

  const handleWithdrawOffer = async (offerId) => {
    try {
      const response = await fetch(`${baseURL}/offer/withdraw/${offerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });

      if (response.ok) {
        setLiveOffers((prevLiveOffers) => prevLiveOffers.filter((offer) => offer._id !== offerId));
        setWithdrawMessage('Offer withdrawn successfully.');
        setTimeout(() => setWithdrawMessage(''), 3000);
      } else {
        console.error('Error withdrawing offer:', response.statusText);
        setWithdrawMessage('Error withdrawing offer. Please try again.');
      }
    } catch (error) {
      console.error('Error withdrawing offer:', error);
      setWithdrawMessage('Error withdrawing offer. Please try again.');
    }
  };

  const handleInputChange = (e, offerId) => {
    const { name, value } = e.target;
    setUpdatedOffers((prevUpdatedOffers) => ({
      ...prevUpdatedOffers,
      [offerId]: {
        ...prevUpdatedOffers[offerId],
        [name]: value,
      },
    }));
  };

  const calculateTimeRemaining = (offer) => {
    const currentTime = new Date();
    const expiryTime = new Date(offer.createdAt);
    expiryTime.setHours(expiryTime.getHours() + offer.time);
    const difference = expiryTime.getTime() - currentTime.getTime();

    if (difference > 0) {
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return 'Offer expired';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOffers((prevLiveOffers) =>
        prevLiveOffers.map((offer) => ({ ...offer, timeRemaining: calculateTimeRemaining(offer) }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-6" style={{ marginTop: '80px' }}>
      <DashboardLinks />
      <h3 className="mb-4">Live Offers</h3>

      {updateMessage && <div className="alert alert-success">{updateMessage}</div>}
      {withdrawMessage && <div className="alert alert-success">{withdrawMessage}</div>}

      {liveOffers.map((offer) => (
        <div key={offer._id} className="mb-3">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Count</th>
                  <th>Rate</th>
                  <th>NoOfBags</th>
                  <th>Delivery Days</th>
                  <th>Time Remaining</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{offer.count}</td>
                  <td>
                    <input
                      type="text"
                      name="rate"
                      value={updatedOffers[offer._id]?.rate}
                      onChange={(e) => handleInputChange(e, offer._id)}
                      className="form-control"
                      placeholder="New Rate"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="noOfBags"
                      value={updatedOffers[offer._id]?.noOfBags}
                      onChange={(e) => handleInputChange(e, offer._id)}
                      className="form-control"
                      placeholder="New NoOfBags"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="deliveryDays"
                      value={updatedOffers[offer._id]?.deliveryDays}
                      onChange={(e) => handleInputChange(e, offer._id)}
                      className="form-control"
                      placeholder="New Delivery Days"
                    />
                  </td>
                  <td>{offer.timeRemaining}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-primary mr-2"
                        onClick={() => handleUpdateOffer(offer._id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleWithdrawOffer(offer._id)}
                      >
                        Withdraw Offer
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionOnOffer;
