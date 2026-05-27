const Order = require('../../models/Order');

const approveOrderController = async (req, res) => {
    try {
        // 🌟 FIX 1: Read the orderId from either the URL params OR the request body payload
        const orderId = req.params.orderId || req.body.orderId;
        
        // 🌟 FIX 2: Dynamic status assignment. If none is passed in the body, default to 'Approved'
        const targetStatus = req.body.status || 'Approved';

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Process halted: No target orderId was supplied."
            });
        }

        // Find order and update its status value dynamically
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: targetStatus },
            { new: true } // Returns the modified object back to frontend
        );

        if (!updatedOrder) {
            return res.status(444).json({
                success: false,
                message: "Order context missing or not found."
            });
        }

        res.status(200).json({
            success: true,
            message: `Order status successfully updated to '${targetStatus}'!`,
            data: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || error
        });
    }
};

module.exports = approveOrderController;