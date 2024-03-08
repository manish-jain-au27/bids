import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardLinks from './DashboardLink';
import { useNavigate } from 'react-router-dom';
import baseURL from '../baseUrl';

const OfferWithBids = () => {
  const [offersWithBids, setOffersWithBids] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [proformaGenerated, setProformaGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedBidId, setAcceptedBidId] = useState(null);
  const [error, setError] = useState(null);
  const [acceptedBidData, setAcceptedBidData] = useState(null); // State to store accepted bid data
  const [offerData, setOfferData] = useState(null); // State to store offer details
  const [productData, setProductData] = useState(null); // State to store product data
  const navigate = useNavigate();

  const fetchOffersWithBids = async () => {
    setLoading(true);
    try {
      const companyToken = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/offer/live-with-bids`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOffersWithBids(data.offersWithBids);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error(`Internal Server Error: ${error.message}`);
      setError('Internal Server Error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffersWithBids();
  }, []);

  const calculateTotalBags = (bids) => {
    return bids.reduce((total, bid) => total + bid.noOfBags, 0);
  };

  const handleViewBids = (offerId) => {
    setSelectedOffer(offerId);
    setProformaGenerated(false);
    // Log the offer details for the selected offer
    const selectedOfferDetails = offersWithBids.find((offer) => offer._id === offerId);
    console.log('Selected Offer Details:', selectedOfferDetails);
  };

  const handleAcceptBid = async (offerId, bidId) => {
    try {
      const companyToken = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/offer/accept-bid/${offerId}/${bidId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Accepted bid data:', responseData); // Log the data
        setSuccessMessage(`Bid  accepted successfully.`);
        fetchOffersWithBids();
        setProformaGenerated(true);
        setAcceptedBidId(bidId);
  
        // Set accepted bid data and offer details
        setAcceptedBidData(responseData.acceptedBid);
        setOfferData(responseData.offer);
        // Set product data
        setProductData(responseData.product);
      } else {
        const errorData = await response.json();
        setError(`Error accepting bid: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Internal Server Error: ${error.message}`);
      setError('Internal Server Error');
    }
  };
  

  const handleRejectBid = async (offerId, bidId) => {
    try {
      const companyToken = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/offer/reject-bid/${offerId}/${bidId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });

      if (response.ok) {
        setSuccessMessage(`Bid  rejected successfully.`);
        fetchOffersWithBids();
      } else {
        const errorData = await response.json();
        setError(`Error rejecting bid: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Internal Server Error: ${error.message}`);
      setError('Internal Server Error');
    }
  };

  const handleRejectAllBids = async (offerId) => {
    try {
      const companyToken = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/offer/reject-all-bids/${offerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });

      if (response.ok) {
        setSuccessMessage(`All bids for offer  rejected successfully.`);
        fetchOffersWithBids();
      } else {
        const errorData = await response.json();
        setError(`Error rejecting all bids: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Internal Server Error: ${error.message}`);
      setError('Internal Server Error');
    }
  };

  const handleGenerateProformaInvoice = async (offerId, bidId) => {
    try {
      const companyToken = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/offer/get-accepted-bid/${offerId}/${bidId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${companyToken}`,
        },
      });
  
      if (response.ok) {
        const { acceptedBid, offer, product } = await response.json(); // Assuming the API returns product data
        // Log the data
        console.log('Accepted Bid Data:', acceptedBid);
        console.log('Offer Data:', offer);
        console.log('Product Data:', product);
  
        // Set accepted bid data, offer details, and product data
        setAcceptedBidData(acceptedBid);
        setOfferData(offer);
        setProductData(product);
  
        navigate(`/proforma/${offerId}`, { state: { acceptedBid, offerId, bidId, product } });
      } else {
        const errorData = await response.json();
        console.error(`Error fetching accepted bid data: ${errorData.error}`);
        setError(`Error fetching accepted bid data: ${errorData.error}`);
      }
    } catch (error) {
      console.error(`Failed to fetch: ${error.message}`);
      setError('Failed to fetch. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <DashboardLinks />
      <div className="row">
        <div className="col-md-12">
          <h2 className="mb-4">Offers with Bids</h2>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {loading && <p>Loading...</p>}
          {offersWithBids.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Count</th>
                    <th>Rate</th>
                    <th>No. of Bags</th>
                    <th>Delivery Days</th>
                    <th>Time</th>
                    <th>Total Bags</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
  {offersWithBids.map((offer) => (
    <React.Fragment key={offer._id}>
      <tr>
        <td>{offer.count}</td>
        <td>{offer.rate}</td>
        <td>{offer.noOfBags}</td>
        <td>{offer.deliveryDays}</td>
        <td>{offer.time} hours</td>
        <td>{calculateTotalBags(offer.bids)}</td>
        <td>
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleViewBids(offer._id)}
            >
              View Bids
            </button>
            {selectedOffer === offer._id && (
              <button
                type="button"
                className="btn btn-danger ml-2"
                onClick={() => handleRejectAllBids(offer._id)}
              >
                Reject All Bids
              </button>
            )}
          </div>
        </td>
      </tr>
      {selectedOffer === offer._id && offer.bids.map((bid) => (
        (bid.status === 'Pending' || (bid.status === 'Accepted' && !bid.user.proformaGenerated)) && (
          <tr key={bid._id}>
            <td>{bid.user.name}</td>
            <td>{bid.rate}</td>
            <td>{bid.noOfBags}</td>
            <td>
              {!proformaGenerated && bid.status === 'Pending' && (
                <>
                  <button
                    type="button"
                    className="btn btn-success mr-2"
                    onClick={() => handleAcceptBid(offer._id, bid._id)}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRejectBid(offer._id, bid._id)}
                  >
                    Reject
                  </button>
                </>
              )}
              {bid.status === 'Accepted' && (
                <button
                  type="button"
                  className="btn btn-info ml-2"
                  onClick={() => handleGenerateProformaInvoice(offer._id, bid._id)}
                >
                  Generate Proforma Invoice
                </button>
              )}
            </td>
          </tr>
        )
      ))}
    </React.Fragment>
  ))}
</tbody>

              </table>
            </div>
          ) : (
            <p>No offers with bids available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferWithBids;
