// middlewares/authenticateToken.js
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'yourSecretKey'; // Use the same secret key for signing and verifying

const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    console.error('Access denied. Token is missing.');
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    console.error('Invalid token format. Use "Bearer token".');
    return res.status(401).json({ error: 'Invalid token format. Use "Bearer token".' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Decoded Token:', decoded); // Log the entire decoded token

    // Check if decoded token contains necessary information
    if ((decoded.userId && decoded.mobileNo) || (decoded.companyId && decoded.mobileNo)) {
      if (decoded.userId) {
        req.user = { id: decoded.userId, mobileNo: decoded.mobileNo, role: decoded.role };
        req.company = null;
      } else if (decoded.companyId) {
        req.user = null;
        req.company = { id: decoded.companyId, mobileNo: decoded.mobileNo, role: decoded.role };
      }
      next();
    } else {
      console.error('Invalid token content. Missing userId and companyId.');
      return res.status(401).json({ error: 'Invalid token content.' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired. Please log in again.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token.' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = authenticateToken;
