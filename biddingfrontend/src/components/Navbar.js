// CustomNavbar.js
import React from 'react';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showSignupModal, setShowSignupModal] = React.useState(false);

  const handleLoginModalShow = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);

  const handleSignupModalShow = () => setShowSignupModal(true);
  const handleSignupModalClose = () => setShowSignupModal(false);

  const navigate = useNavigate();

  const handleLoginChoice = (userType) => {
    handleLoginModalClose();
    navigate(`/login/${userType.toLowerCase()}`);
  };

  const handleSignupChoice = (userType) => {
    handleSignupModalClose();
    navigate(`/signup/${userType.toLowerCase()}`);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="fixed-top">
      <Container>
        <Navbar.Brand href="/">Yarn Online</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link onClick={handleLoginModalShow}>Login</Nav.Link>
            <Nav.Link onClick={handleSignupModalShow}>Signup</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose login type:</p>
          <Button variant="primary" onClick={() => handleLoginChoice('Company')}>
            Company Login
          </Button>
          <Button variant="success" onClick={() => handleLoginChoice('User')}>
            Buyer Login
          </Button>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={handleSignupModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Signup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose signup type:</p>
          <Button variant="primary" onClick={() => handleSignupChoice('Company')}>
            Company Signup
          </Button>
          <Button variant="success" onClick={() => handleSignupChoice('User')}>
            Buyer Signup
          </Button>
        </Modal.Body>
      </Modal>
    </Navbar>
  );
};

export default CustomNavbar;
