import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaPlus, FaChartBar, FaGift, FaFileAlt, FaList } from 'react-icons/fa';

const DashboardLinks = () => {
  return (
    <Nav>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/" className="nav-link tab-box">
          <FaPlus className="mr-2" />
          DashBoard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/companydashboard/addproduct" className="nav-link tab-box">
          <FaPlus className="mr-2" />
          Add Product
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/products" className="nav-link tab-box">
          <FaChartBar className="mr-2" />
          Product
        </Nav.Link>
      </Nav.Item>
      {/* <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/createoffer" className="nav-link tab-box">
          <FaGift className="mr-2" />
          Create Offer
        </Nav.Link>
      </Nav.Item> */}
      <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/offerwithbids" className="nav-link tab-box">
          <FaFileAlt className="mr-2" />
          Offer with Bids
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/addreport" className="nav-link tab-box">
          <FaChartBar className="mr-2" />
          Add Report
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/actiononoffer" className="nav-link tab-box">
          <FaChartBar className="mr-2" />
          Action on Offer
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/companydashboard/ProformaList" className="nav-link tab-box">
          <FaList className="mr-2" />
          Proforma List
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default DashboardLinks;
