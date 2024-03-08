const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://manish:manish@cluster0.pdkmfzs.mongodb.net/yarnbidding');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
