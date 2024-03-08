import React, { useEffect, useState } from 'react';

const ReportPage = ({ location }) => {
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!location || !location.state || !location.state.reportData) {
          setError('Report data not found');
          return;
        }
        setReportData(location.state.reportData);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Internal Server Error');
      }
    };

    fetchReport();
  }, [location]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reportData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Report Data</h2>
      <div>
        <h3>Count: {reportData.count}</h3>
        <p>CSP: {reportData.CSP}</p>
        <p>CV: {reportData.CV}</p>
        <p>U: {reportData.U}</p>
        <p>Imperfections:</p>
        <ul>
          <li>Minus 50: {reportData.imperfections?.minus50}</li>
          <li>Plus 50: {reportData.imperfections?.plus50}</li>
          <li>Plus 200: {reportData.imperfections?.plus200}</li>
        </ul>
        <p>PSF Deniar: {reportData.psfdeniar}</p>
        <p>Spinning Count: {reportData.spinningCount}</p>
        <p>Total: {reportData.total}</p>
      </div>
    </div>
  );
};

export default ReportPage;
