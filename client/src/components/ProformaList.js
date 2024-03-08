import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import DashboardLinks from './DashboardLink';
import ProformaDetailsModal from './ProformaDetailsModal';
import baseURL from '../baseUrl';
const ProformaList = () => {
  const [proformas, setProformas] = useState([]);
  const [selectedProforma, setSelectedProforma] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProformas = async () => {
      try {
        const companyToken = localStorage.getItem('companyToken');
        const response = await fetch(`${baseURL}/proforma/proformas`, {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProformas(data.proformas);
        } else {
          throw new Error('Failed to fetch proformas');
        }
      } catch (error) {
        console.error('Error fetching proformas:', error);
      }
    };

    fetchProformas();
  }, []);

  const handleViewDetails = (proforma) => {
    setSelectedProforma(proforma);
    setShowModal(true);
  };

  const handleDownload = () => {
    // Implement download functionality here
    console.log('Downloading proforma:', selectedProforma);
  };

  return (
    <div>
      <h1 className="mt-5">Proformas</h1>
      <DashboardLinks />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Proforma No</th>
            <th>Date</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {proformas.map((proforma) => (
            <tr key={proforma._id}>
              <td>{proforma.proformaNo}</td>
              <td>{new Date(proforma.date).toLocaleDateString()}</td>
              <td>{proforma.userName}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewDetails(proforma)}>
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ProformaDetailsModal
        proforma={selectedProforma}
        show={showModal}
        onHide={() => setShowModal(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default ProformaList;
