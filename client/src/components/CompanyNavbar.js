import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import baseURL from '../baseUrl';
const CompanyNavbar = () => {
  const [companyName, setCompanyName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('companyToken');

    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch(`${baseURL}/company/get-company`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { companyName } = await response.json();
          setCompanyName(companyName);
        } else {
          // Handle error, redirect to login or show a message
          console.error('Failed to fetch company details');
          navigate('/login/company'); // Redirect to login page
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    if (token) {
      fetchCompanyInfo();
    } else {
      // Handle case where token is not available, redirect to login
      navigate('/login/company');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Perform logout actions here (clear token, etc.)
    // Redirect to the login page
    navigate('/login/company');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/company-dashboard">
          {companyName || 'Your Company Brand'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={handleLogout}>
              <BsBoxArrowInRight /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CompanyNavbar;
