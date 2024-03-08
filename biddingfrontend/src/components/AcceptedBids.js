import React, { useState, useEffect } from 'react';
import UserNavbar from './UserNavbar';
import baseURL from '../baseUrl';
const AcceptedBids = () => {
  const [userBids, setUserBids] = useState([]);
  const [userOffersWithBids, setUserOffersWithBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        const token = localStorage.getItem('userToken');

        if (!token) {
          setError('Token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${baseURL}/user/user-bids`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error);
          setLoading(false);
          return;
        }

        const userBidsData = await response.json();
        console.log('User Bids Data:', userBidsData);
        setUserBids(userBidsData.userBids);
        setUserOffersWithBids(userBidsData.userOffersWithBids);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user bids:', error);
        setError('Internal Server Error');
        setLoading(false);
      }
    };

    fetchUserBids();
  }, []);

  return (
    <div className="container mt-5">
      <UserNavbar />
      <h2 className="text-center mb-4">Accepted Bids Page</h2>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {userOffersWithBids.map((offer) => (
            <div key={offer._id} className="mb-5">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Offer Details</h3>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Short Name</th>
                        <th>Offer Count</th>
                        <th>Offer Rate</th>
                        <th>Delivery Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{offer.shortName}</td>
                        <td>{offer.count}</td>
                        <td>{offer.rate}</td>
                        <td>{offer.deliveryDays}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bid-details-box mt-4">
                    <h4 className="card-title">Bid Details</h4>
                    {offer.bids && (
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Bid Rate</th>
                            <th>No. of Bags</th>
                            <th>Bid Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {offer.bids.map((bid) => (
                            <tr key={bid._id}>
                              <td>{bid.rate}</td>
                              <td>{bid.noOfBags}</td>
                              <td className={`text-center ${bid.status.toLowerCase() === 'accepted' ? 'text-success' : (bid.status.toLowerCase() === 'rejected' ? 'text-danger' : 'text-secondary')}`}>
                                {bid.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedBids;
