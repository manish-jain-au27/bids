// Signup.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import CompanySignup from './CompanySignup';
import UserSignup from './UserSignup';

const Signup = () => {
  // Using useParams to get the signupType from the URL
  const { signupType } = useParams();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div>
            <h2 className="text-center mb-4">Signup</h2>
            <Nav variant="tabs" defaultActiveKey={`/${signupType}`} className="mb-4">
              <Nav.Item>
                <Nav.Link eventKey="company" href="/signup/company">
                  Company Signup
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="user" href="/signup/user">
                  User Signup
                </Nav.Link>
              </Nav.Item>
            </Nav>
            {signupType === 'company' ? (
              <CompanySignup />
            ) : signupType === 'user' ? (
              <UserSignup />
            ) : (
              <p className="text-center">Please choose a signup type: company or user.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
