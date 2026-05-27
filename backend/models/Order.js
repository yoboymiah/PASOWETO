const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            // 🌟 THE MISSING LINK: Register the size property so MongoDB allows it to save!
            size: {
                type: String,
                default: ""
            }
        }
    ],
    addressInfo: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('order', OrderSchema);