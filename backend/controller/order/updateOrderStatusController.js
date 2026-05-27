const Order = require('../../models/Order');

const updateOrderStatusController = async (req, requireResponse) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return requireResponse.status(400).json({
                success: false,
                message: "Please provide both orderId and new fulfillment status parameters."
            });
        }

        // Search the tracking database using specific entry IDs and push updates
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return requireResponse.status(404).json({
                success: false,
                message: "Target order reference not found."
            });
        }

        requireResponse.status(200).json({
            success: true,
            message: `Order marked as ${status} successfully.`,
            data: updatedOrder
        });
    } catch (error) {
        requireResponse.status(500).json({
            success: false,
            message: error.message || error
        });
    }
};

module.exports = updateOrderStatusController;