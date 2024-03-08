import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Table } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLinks from './DashboardLink';
import AddProduct from './AddProduct';
import Products from './products';
import OfferWithBids from './OfferWithBids';
import AddReport from './AddReport';
import { FaCog, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import EditCompany from './EditCompany';
import baseURL from '../baseUrl';
const LiveOfferItem = ({ offer }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const currentTime = new Date();
      const expiryTime = new Date(offer.createdAt);
      expiryTime.setHours(expiryTime.getHours() + offer.time); // Add offer time to expiry time
      const difference = expiryTime.getTime() - currentTime.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining('Offer expired');
      }
    };

    calculateTimeRemaining();

    const interval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [offer.createdAt, offer.time]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Count</th>
          <th>Rate</th>
          <th>No. of Bags</th>
          <th>Delivery Days</th>
          <th>Time Remaining</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{offer.shortName}</td>
          <td>{offer.count}</td>
          <td>{offer.rate}</td>
          <td>{offer.noOfBags}</td>
          <td>{offer.deliveryDays}</td>
          <td>{timeRemaining}</td>
        </tr>
      </tbody>
    </Table>
  );
};

const CompanyDashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [liveOffers, setLiveOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompany();
    fetchLiveOffers();
  }, []);

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const response = await fetch(`${baseURL}/company/get-company`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const company = data.companyName;

        if (company) {
          setCompanyName(company);
        } else {
          console.error('Error fetching company: Company is undefined.');
        }
      } else {
        console.error('Error fetching company:', response.statusText);
      }
    } catch (error) {
      console.error('Error during company fetch:', error);
    }
  };

 const fetchLiveOffers = async () => {
  try {
    const token = localStorage.getItem('companyToken');
    const response = await fetch(`${baseURL}/offer/live`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Add this line
      const offers = data.liveOffers;

      if (offers) {
        // Filter out withdrawn offers
        const filteredOffers = offers.filter(offer => offer.status !== 'withdrawn');
        setLiveOffers(filteredOffers);
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


  const handleNavigateToOfferWithBids = (offerId) => {
    navigate(`/companydashboard/offerwithbids/${offerId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('companyToken');
    navigate('/dashboard'); // Navigate to dashboard route after logout
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4" style={{ marginTop: '100px' }}>Welcome {companyName}</h2>
        </Col>
        <Col className="text-end" style={{ marginTop: '40px' }}>
          <Dropdown>
            <Dropdown.Toggle as="button" variant="light" id="dropdown-basic" className="border-0">
              <FaCog size={24} color="#6c757d" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate('/companydashboard/edit')}><FaEdit className="me-2" />Edit</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}><FaSignOutAlt className="me-2" />Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <DashboardLinks />
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Routes>
            <Route path="/companydashboard/*">
              <Route path="addproduct" element={<AddProduct />} /> {/* Ensure AddProduct route is properly configured */}
              <Route path="products" element={<Products />} />
              <Route path="edit" element={<EditCompany />} />
              <Route path="offerwithbids" element={<OfferWithBids />} />
              <Route path="addreport" element={<AddReport />} />
            </Route>
          </Routes>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <h3>Live Offers</h3>
          {liveOffers.map((offer) => (
            <LiveOfferItem key={offer._id} offer={offer} />
          ))}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          {/* Additional content */}
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyDashboard;
