const addToCartModel = require('../../models/cartProduct'); 
const Order = require('../../models/Order');

// POST /api/order/checkout
const checkoutOrder = async (req, res) => {
    try {
        const { addressInfo } = req.body;
        const userId = req.userId || req.body.userId; 

        if (!userId) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized access. User identification missing." 
            });
        }

        // 1. Fetch all items in this user's cart
        const cartItems = await addToCartModel.find({ userId });
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "Your cart is empty. Cannot place an empty order." 
            });
        }

        // 2. Format cart items for the order schema
        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        // 3. Create and save the new order
        const newOrder = new Order({
            userId,
            items: orderItems,
            addressInfo: addressInfo, 
            status: 'Pending'         
        });

        const savedOrder = await newOrder.save();

        // 4. Clear the user's cart now that the order is secure
        await addToCartModel.deleteMany({ userId });

        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully!", 
            orderId: savedOrder._id 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// 🌟 NEW: GET /api/user-orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId; // Securely set by your authToken middleware

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Authentication failed. Please log in again."
            });
        }

        // Finds all orders belonging to this user, sorts by newest first, 
        // and pulls real product info (name, image, price) from the product collection
        const userOrdersList = await Order.find({ userId })
            .populate({
                path: 'items.productId',
                model: 'product' // Assumes your product model name is 'product'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            error: false,
            message: "User purchase history retrieved successfully.",
            data: userOrdersList
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: true,
            message: error.message || error
        });
    }
};

module.exports = {
    checkoutOrder,
    getUserOrders // 🌟 Make sure both are exported!
};