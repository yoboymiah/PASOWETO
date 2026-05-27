// FIXED: Changed from productModel to cartProduct to target actual cart items
const addToCartModel = require('../../models/cartProduct'); 
const Order = require('../../models/Order');

const checkoutOrderController = async (req, res) => {
    try {
        const userId = req.userId; // Provided by your authToken middleware
        const { addressInfo } = req.body;

        if (!addressInfo) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide complete address information." 
            });
        }

        // 1. Fetch items currently in this user's cart (Checking both common user ID keys)
        const cartItems = await addToCartModel.find({
            $or: [
                { userId: userId },
                { currentUser: userId }
            ]
        });
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot place order. Your cart is empty." 
            });
        }

        // 2. Format items to fit our Order structure safely
        const orderItems = cartItems.map(item => ({
            productId: item.productId?._id || item.productId, // Fallback if populated or raw string
            quantity: item.quantity,
            size: item.size || "" // 🌟 THE CRITICAL FIX: Transfer the size tracking string from cart to order!
        }));

        // 3. Construct the order payload matching your precise OrderSchema options
        const newOrder = new Order({
            userId: userId,
            items: orderItems,
            addressInfo: addressInfo,
            status: 'Pending' // Explicitly sets default string matching your Schema enum
        });

        const savedOrder = await newOrder.save();

        // 4. Wipe out the user's specific shopping cart documents now that the order is secured
        await addToCartModel.deleteMany({ 
            $or: [
                { userId: userId },
                { currentUser: userId }
            ]
        });

        res.status(201).json({
            success: true,
            error: false, // Explicitly included matching your API payload convention
            message: "Order placed successfully!",
            data: savedOrder
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || error
        });
    }
};

module.exports = checkoutOrderController;