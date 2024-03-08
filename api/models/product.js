const mongoose = require('mongoose');
const Company = require('./Company'); // Assuming you have a Company model

// Define possible values for variations
const variationTypes = ['cotton', 'polyester'];
const typeOptions = ['single', 'double'];
const countOptions = {
  single: ['1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s', '10s', '11s', '12s', '13s', '14s', '15s', '16s', '17s', '18s', '19s', '20s', '21s', '22s', '23s', '24s', '25s', '26s', '27s', '28s', '29s', '30s', '31s', '32s', '33s', '34s', '35s', '36s', '37s', '38s', '39s', '40s', '41s', '42s', '43s', '44s', '45s', '46s', '47s', '48s', '49s', '50s', '51s', '52s', '53s', '54s', '55s', '56s', '57s', '58s', '59s', '60s', '61s', '62s', '63s', '64s', '65s', '66s', '67s', '68s', '69s', '70s', '71s', '72s', '73s', '74s', '75s', '76s', '77s', '78s', '79s', '80s', '81s', '82s', '83s', '84s', '85s', '86s', '87s', '88s', '89s', '90s', '91s', '92s', '93s', '94s', '95s', '96s', '97s', '98s', '99s', '100s'],
  double: ['1/2', '2/2', '3/2', '4/2', '5/2', '6/2', '7/2', '8/2', '9/2', '10/2', '11/2', '12/2', '13/2', '14/2', '15/2', '16/2', '17/2', '18/2', '19/2', '20/2', '21/2', '22/2', '23/2', '24/2', '25/2', '26/2', '27/2', '28/2', '29/2', '30/2', '31/2', '32/2', '33/2', '34/2', '35/2', '36/2', '37/2', '38/2', '39/2', '40/2', '41/2', '42/2', '43/2', '44/2', '45/2', '46/2', '47/2', '48/2', '49/2', '50/2', '51/2', '52/2', '53/2', '54/2', '55/2', '56/2', '57/2', '58/2', '59/2', '60/2', '61/2', '62/2', '63/2', '64/2', '65/2', '66/2', '67/2', '68/2', '69/2', '70/2', '71/2', '72/2', '73/2', '74/2', '75/2', '76/2', '77/2', '78/2', '79/2', '80/2', '81/2', '82/2', '83/2', '84/2', '85/2', '86/2', '87/2', '88/2', '89/2', '90/2', '91/2', '92/2', '93/2', '94/2', '95/2', '96/2', '97/2', '98/2', '99/2', '100/2'],
};
const specificationOptions = ['KWEFT', 'KW', 'KCWEFT', 'KCW', 'CWEFT', 'CW', 'CCWEFT', 'CCW', 'KHTWEFT', 'KHTW', 'CHTWEFT', 'CHTW'];
const windingOptions = ['auto', 'non-auto'];

const productSchema = new mongoose.Schema({
  variation: {
    type: String,
    enum: variationTypes,
    required: true,
  },
  countNo: {
    type: String,
    enum: countOptions.single.concat(countOptions.double),
    required: true,
  },
  type: {
    type: String,
    enum: typeOptions,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  noOfConesPerBag: {
    type: Number,
    required: true,
  },
  specification: {
    type: String,
    enum: specificationOptions,
    required: true,
  },
  winding: {
    type: String,
    enum: windingOptions,
    required: true,
  },
  count: {
    type: String,
    // No need to set required here, as it will be set automatically in the pre hook
  },
  monthlyBagProduction: {
    type: Number,
    required: true,
  },
  hsnCode: {
    type: String,
    required: true,
  },
  blends: [{
    blend: {
      type: String,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
  }],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  
  // ... other product details
});

// Pre hook to set the 'count' field based on other fields
productSchema.pre('save', function (next) {
  this.count = `${this.variation} ${this.countNo} ${this.specification} ${this.winding}`;
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
