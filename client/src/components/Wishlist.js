import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import UserNavbar from './UserNavbar';
import baseURL from '../baseUrl';
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userToken, setUserToken] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDetails, setBidDetails] = useState({ rate: '', noOfBags: '' });
  const [showBidModal, setShowBidModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      setUserToken(storedToken);
      fetchWishlist(storedToken);
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async (token) => {
    try {
      const response = await fetch(`${baseURL}/user/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const wishlistArray = data.wishlist || [];
        const liveOffers = await fetchLiveOffers(token);

        const wishlistWithOffers = wishlistArray.map(wishlistItem => {
          const hasLiveOffer = liveOffers.some(offer =>
            offer.companyId === wishlistItem.companyId._id.toString() &&
            offer.count === wishlistItem.count
          );

          return {
            ...wishlistItem,
            hasLiveOffer,
          };
        });

        setWishlist(wishlistWithOffers);
      } else {
        console.error('Error fetching wishlist:', response.statusText);
        setError('Error fetching wishlist: ' + response.statusText);
      }
    } catch (error) {
        console.error('Error fetching wishlist:', error.message);
        setError('Error fetching wishlist: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
  
  const fetchLiveOffers = async (token) => {
    try {
      const response = await fetch(`${baseURL}/user/live-offers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.liveOffers || [];
      } else {
        console.error('Error fetching live offers:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching live offers:', error.message);
      return [];
    }
  };

  const handleBidDetailsChange = (field, value) => {
    setBidDetails((prevBidDetails) => ({
      ...prevBidDetails,
      [field]: value,
    }));
  };

  const handleBidClick = (offer) => {
    console.log('Handle Bid Click:', offer);
    setSelectedOffer(offer);
    setBidAmount('');
    setShowBidModal(true);
  };

  const handleBidModalClose = () => {
    setSelectedOffer(null);
    setShowBidModal(false);
  };

  const handlePlaceBid = async () => {
    try {
      console.log('Placing bid...');
      console.log('Selected Offer:', selectedOffer);
      console.log('Bid Amount:', bidAmount);

      const response = await fetch(`${baseURL}/user/place-bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          offerId: selectedOffer._id,
          bidAmount,
        }),
      });

      if (response.ok) {
        console.log('Bid placed successfully!');
        setSelectedOffer(null);
        setBidAmount('');
        // Refetch the wishlist and live offers after placing the bid
        fetchWishlist(userToken);
      } else {
        console.error('Error placing bid:', response.statusText);
      }
    } catch (error) {
      console.error('Error placing bid:', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <UserNavbar />
      <h2 className="text-center mb-4">Wishlist</h2>
      {loading && <p className="text-center"><FaSpinner className="fa-spin" /> Loading...</p>}
      {error && <p className="text-center text-danger">Error: {error}</p>}
      {!loading && !error && wishlist.length === 0 && (
        <p className="text-center">Your wishlist is empty.</p>
      )}
      {!loading && !error && wishlist.length > 0 && (
        <ul className="list-group">
          {wishlist.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {item.companyId.shortName} - {item.count}
              {item.hasLiveOffer && (
                <button
                  className="btn btn-success ms-2"
                  data-toggle="modal"
                  data-target="#bidModal"
                  onClick={() => handleBidClick(item)}
                >
                  Place Bid
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Bid Modal */}
      {selectedOffer && (
        <Modal show={showBidModal} onHide={handleBidModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Place Bid</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Selected Offer: {selectedOffer.companyId.shortName} - {selectedOffer.count}</p>
            <div className="form-group">
              <label htmlFor="bidAmount">Bid Amount:</label>
              <input
                type="number"
                id="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bidBags">Number of Bags:</label>
              <input
                type="number"
                id="bidBags"
                value={bidDetails.noOfBags}
                onChange={(e) => handleBidDetailsChange('noOfBags', e.target.value)}
                className="form-control"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handlePlaceBid}>
              Place Bid
            </Button>
            <Button variant="secondary" onClick={handleBidModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Wishlist;
