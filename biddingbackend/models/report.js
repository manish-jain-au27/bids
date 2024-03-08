const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  count: String,
  spinningCount: String,
  CV: String,
  CSP: String,
  U: String,
  imperfections: {
    minus50: Number,
    plus50: Number,
    plus200: Number,
  },
  psfdeniar: String,
  psfCompany: String,
  total: {
    type: String,
    default: function () {
      const sum = this.imperfections.minus50 + this.imperfections.plus50 + this.imperfections.plus200;
      return sum.toString();
    },
  },
  blend: [
    {
      percentage: String,
      mixture: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
