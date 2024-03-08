const Company = require('../models/Company');
const Report = require('../models/report');
const jwt = require('jsonwebtoken');

exports.addReport = async (req, res) => {
  try {
    const {
      count,
      spinningCount,
      CV,
      CSP,
      U,
      imperfections,
      psfdeniar,
      psfCompany,
      blend1,
      blend2,
    } = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const { companyId } = decodedToken;

    if (!companyId) {
      return res.status(401).json({ error: 'Unauthorized: Company ID not found in token' });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Check if a report already exists for the specified count
    const existingReport = await Report.findOne({ count });

    if (existingReport) {
      return res.status(400).json({ error: `A report already exists for count ${count}` });
    }

    // Construct blend array with blend1 and blend2 objects
    const blend = [blend1, blend2];

    const report = new Report({
      count,
      spinningCount,
      CV,
      CSP,
      U,
      imperfections,
      psfdeniar,
      psfCompany,
      blend,
      companyId: company._id,
    });

    await report.save();

    res.status(201).json({ message: 'Report added successfully', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get a report by ID
exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Find the report by ID
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a report
// Update a report
exports.updateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { 
      count, 
      spinningCount, 
      CV, 
      CSP, 
      U, 
      imperfections, 
      psfdeniar, 
      psfCompany, 
      blend1, // New blend fields for the first set
      blend2, // New blend fields for the second set
    } = req.body;

    let report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    const { minus50, plus50, plus200 } = imperfections;
    const newTotal = parseInt(minus50) + parseInt(plus50) + parseInt(plus200);

    // Update the report with the new total and blend fields
    report = await Report.findByIdAndUpdate(reportId, {
      count,
      spinningCount,
      CV,
      CSP,
      U,
      imperfections,
      psfdeniar,
      psfCompany,
      blend: [{ percentage: blend1.percentage, mixture: blend1.mixture }, { percentage: blend2.percentage, mixture: blend2.mixture }], // Update blend field with both sets of blend values
      total: newTotal.toString(),
      updatedAt: new Date(),
    }, { new: true });

    res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// Get a report by count
exports.getReportByCount = async (req, res) => {
  try {
    const { count } = req.params;

    // Find reports with the specified count
    const reports = await Report.find({ count });

    res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a report
exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Find the report by ID and delete it
    const deletedReport = await Report.findByIdAndDelete(reportId);

    if (!deletedReport) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
