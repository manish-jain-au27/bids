const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
    },
    proforma: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proforma',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['not paid', 'pending', 'success', 'failed'],
        default: 'not paid', // Default status is 'not paid'
    },
});

// Method to update payment status to 'success'
paymentSchema.methods.markAsPaid = async function() {
    this.status = 'success';
    await this.save();
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
