const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const companyRoutes = require('./routes/companyRoutes');
const productRoutes = require('./routes/productRoutes');
const reportRoutes = require('./routes/reportRoutes');
const offerRoutes = require('./routes/offerRoutes');
const userRoutes = require('./routes/userRoutes');
const proformaRoutes = require('./routes/proformaRoutes');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.use(cors());
app.options('*', cors());

// Connect to MongoDB (Make sure MongoDB is running)
const mongoURI = "mongodb+srv://manish:manish@cluster0.ngzxl0n.mongodb.net/bidding";
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Express Middleware


// Set the JWT_SECRET in the environment variable
process.env.JWT_SECRET = "yoursecretkey";

// Express Routes
app.use('/api/company', companyRoutes);
app.use('/api/product', productRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/offer', offerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/proforma', proformaRoutes);

// Basic route to serve some page
app.get('/', (req, res) => {
  res.send('Welcome to My Express Server!'); // You can send a simple message
  // Or you can send an HTML page
  // res.sendFile(__dirname + '/index.html');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for Vercel deployment
module.exports = app;
