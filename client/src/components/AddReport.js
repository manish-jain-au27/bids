import React, { useState, useEffect } from 'react';
import DashboardLinks from './DashboardLink';
import baseURL from '../baseUrl';
const AddReport = ({ match }) => {
  const [reportData, setReportData] = useState({
    count: '',
    spinningCount: '',
    CV: '',
    CSP: '',
    U: '',
    imperfections: {
      minus50: 0,
      plus50: 0,
      plus200: 0,
    },
    psfdeniar: '', // Set as text field
    psfCompany: '',
    total: 0,
    blend1: { percentage: '', mixture: '' }, // First set of blend fields
    blend2: { percentage: '', mixture: '' }, // Second set of blend fields
  });

  const [counts, setCounts] = useState([]);
  const [isCountUnique, setIsCountUnique] = useState(true); // State to track if the selected count is unique
  const companyToken = localStorage.getItem('companyToken');
  const productId = match?.params?.productId;

  useEffect(() => {
    fetchProductCount();
  }, [companyToken, productId]);

  const fetchProductCount = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const { companyId } = JSON.parse(atob(token.split('.')[1]));
  
      const response = await fetch(`${baseURL}/product/get-all?companyId=${companyId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Counts:', data); // Log the counts data
        setCounts(data.map(product => product.count)); // Extracting only the 'count' values
      } else {
        console.error('Error fetching products:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'count') {
      setReportData(prevData => ({
        ...prevData,
        count: value,
      }));
      // Check if the selected count is unique
      setIsCountUnique(!counts.includes(value));
    } else {
      setReportData(prevData => ({
        ...prevData,
        [field]: value,
      }));
    }
  };
  
  const handleImperfectionsChange = (subfield, value) => {
    setReportData(prevData => ({
      ...prevData,
      imperfections: {
        ...prevData.imperfections,
        [subfield]: value,
      },
    }));
  };

  const calculateTotal = () => {
    const { minus50, plus50, plus200 } = reportData.imperfections;
    return Number(minus50 || 0) + Number(plus50 || 0) + Number(plus200 || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString(); // Get current date and time
      const total = calculateTotal();
      const response = await fetch(`${baseURL}/report/add-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify({ ...reportData, total, date: currentDate }), // Include current date
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Report added successfully:', data.report);
        alert('Report added successfully!');
      } else {
        console.error('Failed to add report:', response.status, response.statusText);
        alert('Failed to add report. Please try again.');
      }
    } catch (error) {
      console.error('Error adding report:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="container mt-5">
      <DashboardLinks />
      <h2>Add Report</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Count Label:</label>
            <select
              className="form-select"
              value={reportData.count}
              onChange={(e) => handleInputChange('count', e.target.value)}
            >
              <option value="">Select Count</option>
              {counts.map((count, index) => (
                <option key={index} value={count}>{count}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Spinning Count:</label>
            <input
              type="text" // Changed to text input
              className="form-control"
              value={reportData.spinningCount}
              onChange={(e) => handleInputChange('spinningCount', e.target.value)}
            />
          </div>
        </div>


        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <label className="form-label">CV%:</label>
            <input
              type="text" // Changed to text input
              className="form-control"
              value={reportData.CV}
              onChange={(e) => handleInputChange('CV', e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">CSP:</label>
            <input
              type="text" // Changed to text input
              className="form-control"
              value={reportData.CSP}
              onChange={(e) => handleInputChange('CSP', e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mt-3">
          
        
          <div className="col-md-6">
            <label className="form-label">U%:</label>
            <input
              type="text" // Changed to text input
              className="form-control"
              value={reportData.U}
              onChange={(e) => handleInputChange('U', e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mt-3">
          <div className="col-md-4">
            <label className="form-label">Imperfections -50:</label>
            <input
              type="number"
              className="form-control"
              value={reportData.imperfections.minus50}
              onChange={(e) => handleImperfectionsChange('minus50', e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Imperfections +50:</label>
            <input
              type="number"
              className="form-control"
              value={reportData.imperfections.plus50}
              onChange={(e) => handleImperfectionsChange('plus50', e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Imperfections +200:</label>
            <input
              type="number"
              className="form-control"
              value={reportData.imperfections.plus200}
              onChange={(e) => handleImperfectionsChange('plus200', e.target.value)}
            />
          </div>
        </div>

        <div className="row g-3 mt-3">
          <div className="col-md-4">
            <label className="form-label">Blend 1 Percentage:</label>
            <input
              type="text"
              className="form-control"
              value={reportData.blend1.percentage}
              onChange={(e) => setReportData(prevData => ({
                ...prevData,
                blend1: { ...prevData.blend1, percentage: e.target.value }
              }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Blend 1 Mixture:</label>
            <input
              type="text"
              className="form-control"
              value={reportData.blend1.mixture}
              onChange={(e) => setReportData(prevData => ({
                ...prevData,
                blend1: { ...prevData.blend1, mixture: e.target.value }
              }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Blend 2 Percentage:</label>
            <input
              type="text"
              className="form-control"
              value={reportData.blend2.percentage}
              onChange={(e) => setReportData(prevData => ({
                ...prevData,
                blend2: { ...prevData.blend2, percentage: e.target.value }
              }))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Blend 2 Mixture:</label>
            <input
              type="text"
              className="form-control"
              value={reportData.blend2.mixture}
              onChange={(e) => setReportData(prevData => ({
                ...prevData,
                blend2: { ...prevData.blend2, mixture: e.target.value }
              }))}
            />
          </div>
        </div>

        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <label className="form-label">Total:</label>
            <input type="number" className="form-control" value={calculateTotal()} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label">PSF Company:</label>
            <input
              type="text"
              className="form-control"
              value={reportData.psfCompany}
              onChange={(e) => handleInputChange('psfCompany', e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">PSF Deniar:</label>
            <input
              type="text"
              className="form-control"
              value={reportData.psfdeniar}
              onChange={(e) => handleInputChange('psfdeniar', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Add Report
        </button>
      </form>
    </div>
  );
};

export default AddReport;
