import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import CompanyLogin from './components/CompanyLogin';
import UserLogin from './components/UserLogin';
import CompanyDashboard from './components/CompanyDashboard';
import CustomNavbar from './components/Navbar';
import CompanyNavbar from './components/CompanyNavbar';
import AddProduct from './components/AddProduct';
import Products from './components/products';
import AddReport from './components/AddReport';
import CreateOffer from './components/CreateOffer';
import ActionOnOffer from './components/ActionOnOffer';
import CompanySignup from './components/CompanySignup';
import UserSignup from './components/UserSignup';
import UserDashboard from './components/UserDashboard';
import AcceptedBids from './components/AcceptedBids';
import OfferWithBids from './components/OfferWithBids';
import Wishlist from './components/Wishlist';
import ProductDetails from './components/ProductDetails';
import ReportPage from './components/ReportPage';
import EditCompany from './components/EditCompany';
import ProformaPage from './components/ProformaPage';
import ProformaList from './components/ProformaList';
const App = () => {
  return (
    <Router>
      <div>
        <CustomNavbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/company" element={<CompanySignup />} />
          <Route path="/signup/user" element={<UserSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/company" element={<CompanyLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/companydashboard/*" element={<CompanyDashboard />} />
          <Route path="/companydashboard/addproduct" element={<AddProduct />} />
          <Route path="/companydashboard/products" element={<Products />} />
          <Route path="/companydashboard/addreport/:productId" element={<AddReport />} />
          <Route path="/companydashboard/addreport" element={<AddReport />} />
          <Route path="/companydashboard/createoffer/:count" element={<CreateOffer />} />
          <Route path="/companydashboard/actiononoffer" element={<ActionOnOffer />} />
          <Route path="/companydashboard/offerwithbids" element={<OfferWithBids />} />
          <Route path="/userdashboard/*" element={<UserDashboard />} />
          <Route path="/accepted-bids" element={<AcceptedBids />} />
          <Route path="/product-details/:productId" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/report/:count" element={<ReportPage />} />
          <Route path="/companydashboard/edit" element={<EditCompany />} />
          <Route path="/proforma/:offerId" element={<ProformaPage />} />
          <Route path="/companydashboard/ProformaList" element={<ProformaList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
