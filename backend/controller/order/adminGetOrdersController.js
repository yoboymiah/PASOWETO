const Order = require('../../models/Order');

const adminGetOrdersController = async (req, res) => {
    try {
        // Fetch all orders, look inside the items array and populate product details
        const orders = await Order.find()
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All orders retrieved successfully.",
            data: orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || error
        });
    }
};

module.exports = adminGetOrdersController;