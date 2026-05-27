const Order = require('../../models/Order');

const getAllOrdersController = async (req, res) => {
    try {
        // Fetch every document sorted by newest transactions first
        const allOrders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All orders retrieved successfully",
            data: allOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || error
        });
    }
};

module.exports = getAllOrdersController;