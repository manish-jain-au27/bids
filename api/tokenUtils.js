// tokenUtils.js
const jwt = require('jsonwebtoken');

const jwtSecret = 'yourSecretKey'; // Replace with your actual secret key

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: '1h' });
};

module.exports = generateToken;
