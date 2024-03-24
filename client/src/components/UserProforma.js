import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ProformaDetailsModal from './ProformaDetailsModal';
import baseURL from '../baseUrl';
const UserProforma = () => {
  const [proformas, setProformas] = useState([]);
  const [selectedProforma, setSelectedProforma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      fetch(`${baseURL}/api/user/proforma/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Proforma data:', data);
        setProformas(data.proformaList);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching proformas:', error);
        setError('Error fetching proformas. Please try again.');
        setLoading(false);
      });
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, []);

  const handleViewDetails = (proformaId) => {
    const selected = proformas.find(proforma => proforma._id === proformaId);
    if (selected) {
      setSelectedProforma(selected);
      setShowModal(true);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ marginTop: '100px' }}>
      <h1>User Proformas</h1>
      {proformas.map(proforma => (
        <div key={proforma._id}>
          <p>Company Name: {proforma.companyName}</p>
          <p>Proforma No: {proforma.proformaNo}</p>
          <p>Date: {new Date(proforma.date).toLocaleDateString()}</p>
          <button onClick={() => handleViewDetails(proforma._id)}>View Proforma</button>
          <hr />
        </div>
      ))}
      
      <ProformaDetailsModal
        proforma={selectedProforma}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};

export default UserProforma;
