import React from 'react';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ProformaDetailsModal = ({ proforma, show, onHide }) => {
  const handleDownload = () => {
    // Capture the content of the modal as an image using html2canvas
    html2canvas(document.getElementById('proforma-details')).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add the captured image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Download the PDF
      pdf.save('proforma.pdf');
    });
  };

  if (!proforma) {
    return null; // If proforma is null, return null to prevent rendering
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-center">Proforma No: {proforma.proformaNo} | Date: {new Date(proforma.date).toLocaleDateString()}</Modal.Title>
      </Modal.Header>
      <Modal.Body id="proforma-details">
        <Row>
          <Col md={6} className="border-right">
            <h4 className="mb-3">Company Details</h4>
            <p><strong>Company Name:</strong> {proforma.companyName}</p>
            <p><strong>Company GST No:</strong> {proforma.gstNo}</p>
            {/* <p><strong>Company Mobile No:</strong> {proforma.mobileNo}</p> */}
            <p><strong>Register Address:</strong> {proforma.registerAddress.address}, {proforma.registerAddress.pincode}</p>
            
          </Col>
          <Col md={6}>
            <h4 className="mb-3">User Details</h4>
            <p><strong>Buyer Name:</strong> {proforma.userName}</p>
            <p><strong>Buyer GST No:</strong> {proforma.userGstNo}</p>
            {/* <p><strong>User Mobile No:</strong> {proforma.userMobileNo}</p> */}
            <p><strong>Buyer Address:</strong> {proforma.userShippingAddress.address}</p>
            <p><strong>Buyer Shipping Address:</strong> {proforma.userShippingAddress.address}, {proforma.userShippingAddress.pincode}, {proforma.userShippingAddress.state}</p>
            <p><strong>Buyer State:</strong> {proforma.userShippingAddress.state}</p>
          </Col>
        </Row>
        <hr />
        <Table bordered>
          <thead>
            <tr>
              <th>Count</th>
              <th>Delivery Days</th>
              <th>Weight</th>
              <th>Rate</th>
              <th>No of Bags</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{proforma.count}</td>
              <td>{proforma.deliveryDays}</td>
              <td>{proforma.productWeight}</td>
              <td>{proforma.rate}</td>
              <td>{proforma.noOfBags}</td>
              <td>{proforma.amount}</td>
            </tr>
          </tbody>
        </Table>
        <Row>
  <Col md={6}>
    <div>
      <Table bordered>
        <tbody>
          <tr>
            <td><strong>Freight:</strong></td>
            <td>{proforma.freight}</td>
          </tr>
          <tr>
            <td><strong>Insurance:</strong></td>
            <td>{proforma.insurance}</td>
          </tr>
          <tr>
            <td><strong>CGST:</strong></td>
            <td>{proforma.cgst}</td>
          </tr>
          <tr>
            <td><strong>SGST:</strong></td>
            <td>{proforma.sgst}</td>
          </tr>
          <tr>
            <td><strong>IGST:</strong></td>
            <td>{proforma.igst}</td>
          </tr>
          <tr>
            <td><strong>Total:</strong></td>
            <td>{proforma.total}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Col>
</Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProformaDetailsModal;
