import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import baseURL from '../baseUrl';
import DashboardLink from './DashboardLink';

const ProformaPage = () => {
  const location = useLocation();
  const { acceptedBidData, offerId, bidId } = location.state;
  const [proformaDetails, setProformaDetails] = useState(null);
  const [freight, setFreight] = useState(0); // Default value of 0 for freight
  const [insurance, setInsurance] = useState(0); // Default value of 0 for insurance
  const [cgst, setCgst] = useState(null);
  const [sgst, setSgst] = useState(null);
  const [igst, setIgst] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchProformaDetails = async () => {
      try {
        const companyToken = localStorage.getItem('companyToken');
        const response = await fetch(`${baseURL}/offer/${offerId}/accepted-bid/${bidId}`, {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Received data:', data);
          if (data.offer && data.acceptedBid && data.acceptedBid.user) {
            setProformaDetails(data);
          } else {
            setErrorMessage('Error: Invalid proforma details received');
          }
        } else {
          setErrorMessage('Error fetching proforma details');
        }
      } catch (error) {
        setErrorMessage('Internal Server Error');
        console.error('Internal Server Error:', error.message);
      }
    };
    
    fetchProformaDetails();
  }, [offerId, bidId]);

  const handleGenerateProforma = async () => {
    setIsGenerating(true);
    try {
      const companyToken = localStorage.getItem('companyToken');
      if (!companyToken) {
        setErrorMessage('Company token not found');
        return;
      }
  
      const totalAmountRounded = Math.floor(parseFloat(totalAmount) * 100) / 100; // Round off to two decimal places
  
      const response = await fetch(`${baseURL}/proforma/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify({
          offerId: offerId,
          bidId: bidId,
          freight: freight,
          insurance: insurance,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          weight: proformaDetails?.offer?.productId?.weight, // Include the weight here
          totalAmount: totalAmountRounded, // Send the rounded total amount
        }),
      });
  
      if (response.ok) {
        console.log('Proforma generated successfully');
        const data = await response.json();
        console.log('Proforma Data:', data);
        setProformaDetails(data);
        setFreight(null);
        setInsurance(null);
        setCgst(null);
        setSgst(null);
        setIgst(null);
        setErrorMessage('');
  
        const pdf = new jsPDF();
        const proformaPage = document.getElementById('proforma-page');
  
        html2canvas(proformaPage).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 0, 0);
          pdf.save('proforma.pdf');
        });
      } else {
        setErrorMessage('Error generating proforma');
        console.error('Error generating proforma:', await response.text());
      }
    } catch (error) {
      setErrorMessage('Internal Server Error');
      console.error('Internal Server Error:', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendProformaViaWhatsApp = () => {
    const message = encodeURIComponent(`Proforma Details:\nFreight: ${freight}\nInsurance: ${insurance}\nCGST: ${cgst}\nSGST: ${sgst}\nIGST: ${igst}\nTotal Amount: ${totalAmount}`);
    const url = `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  const totalAmount = proformaDetails && proformaDetails.acceptedBid ? (
    parseFloat(proformaDetails.acceptedBid.rate) * proformaDetails.acceptedBid.noOfBags * parseFloat(proformaDetails.offer?.productId?.weight) +
    parseFloat(freight) +
    parseFloat(insurance) +
    parseFloat(cgst) +
    parseFloat(sgst) +
    parseFloat(igst)
  ).toFixed(2) : null;

  const calculateGST = () => {
    if (proformaDetails && proformaDetails.offer && proformaDetails.acceptedBid && proformaDetails.offer.companyId && proformaDetails.acceptedBid.user) {
      const companyState = proformaDetails.offer.companyId.registerAddress?.state;
      const userState = proformaDetails.acceptedBid.user.shippingAddress.state;
      const isCotton = proformaDetails.offer.count.toLowerCase().includes('cotton');
  
      const amount = proformaDetails && proformaDetails.acceptedBid ? (
        parseFloat(proformaDetails.acceptedBid.rate) *
        proformaDetails.acceptedBid.noOfBags *
        parseFloat(proformaDetails.offer?.productId?.weight)
      ) : 0;
  
      const totalWithFreightInsurance = amount + (parseFloat(freight) || 0) + (parseFloat(insurance) || 0);
  
      console.log('Total Amount with Freight and Insurance:', totalWithFreightInsurance);
      console.log('Company State:', companyState);
      console.log('User State:', userState);
      console.log('Is Cotton:', isCotton);
  
      if (companyState && userState) {
        if (companyState === userState) {
          setCgst(isCotton ? (totalWithFreightInsurance * 2.5) / 100 : (totalWithFreightInsurance * 6) / 100);
          setSgst(isCotton ? (totalWithFreightInsurance * 2.5) / 100 : (totalWithFreightInsurance * 6) / 100);
          setIgst(0);
        } else {
          setCgst(0);
          setSgst(0);
          setIgst(isCotton ? (totalWithFreightInsurance * 5) / 100 : (totalWithFreightInsurance * 12) / 100);
        }
      }
    }
  };

  useEffect(() => {
    calculateGST();
  }, [proformaDetails, totalAmount]);

  return (
    <div id="proforma-page" className="container" style={{ marginTop: '190px' }}>
      <DashboardLink />
      <h1 className="mb-5">Proforma Invoice</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {proformaDetails ? (
        <div className="row">
          <div className="col-md-6">
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Proforma No:</strong> {proformaDetails && proformaDetails.acceptedBid ? proformaDetails.acceptedBid._id : 'N/A'}</p>
            <p><strong>Company Name:</strong> {proformaDetails && proformaDetails.offer ? proformaDetails.offer.companyName : 'N/A'}</p>
            <p><strong>Register Address:</strong> {proformaDetails && proformaDetails.offer && proformaDetails.offer.companyId?.registerAddress?.address}</p>
            <p><strong>Pincode:</strong> {proformaDetails && proformaDetails.offer && proformaDetails.offer.companyId?.registerAddress?.pincode}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Buyer Name:</strong> {proformaDetails.acceptedBid?.user?.name}</p>
            <p><strong>Buyer Address:</strong> {proformaDetails.acceptedBid?.user?.address}</p>
            <p><strong>Buyer GST No:</strong> {proformaDetails.acceptedBid?.user?.gstNo}</p>
          </div>
          <div className="col-md-12">
            <hr />
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Delivery Days</th>
                  <th scope="col">Weight</th>
                  <th scope="col">No. of Bags</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{proformaDetails.offer?.count}</td>
                  <td>{proformaDetails.offer?.deliveryDays}</td>
                  <td>{proformaDetails.offer?.productId?.weight}</td>
                  <td>{proformaDetails.acceptedBid?.noOfBags}</td>
                  <td>{proformaDetails.acceptedBid?.rate}</td>
                  <td>{parseFloat(proformaDetails.acceptedBid?.rate) * proformaDetails.acceptedBid?.noOfBags * parseFloat(proformaDetails.offer?.productId?.weight) || 0}</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <p><strong>Freight:</strong> <input type="number" value={freight || ''} onChange={(e) => setFreight(e.target.value)} /></p>
            <p><strong>Insurance:</strong> <input type="number" value={insurance || ''} onChange={(e) => setInsurance(e.target.value)} /></p>
            <p><strong>CGST:</strong> <input type="number" value={cgst || ''} onChange={(e) => setCgst(e.target.value)} /></p>
            <p><strong>SGST:</strong> <input type="number" value={sgst || ''} onChange={(e) => setSgst(e.target.value)} /></p>
            <p><strong>IGST:</strong> <input type="number" value={igst || ''} onChange={(e) => setIgst(e.target.value)} /></p>
            <hr />
            <p><strong>Total Amount:</strong> {Math.floor(parseFloat(totalAmount))}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button className="btn btn-primary" onClick={handleGenerateProforma} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Proforma'}
      </button>
      <button className="btn btn-success ml-2" onClick={sendProformaViaWhatsApp}>Send Proforma via WhatsApp</button>
    </div>
  );
};

export default ProformaPage;
