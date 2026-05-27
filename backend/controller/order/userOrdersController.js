const Order = require('../../models/Order')

const userOrdersController = async (req, res) => {
    try {
        const currentUserId = req.userId // Extracted securely by authToken middleware

        // Fetching orders and populating core product information details
        const orderList = await Order.find({ userId : currentUserId })
            .populate({
                path: 'items.productId',
                model: 'product' // Matches your Product model name in your product schema file
            })
            .sort({ createdAt : -1 })

        // Format the response structure safely so the frontend can reliably read item.size
        const cleanOrders = orderList.map(order => {
            const orderObj = order.toObject(); // Convert Mongoose document to clean JS Object
            
            if (orderObj.items && Array.isArray(orderObj.items)) {
                orderObj.items = orderObj.items.map(item => ({
                    ...item,
                    // If size exists in the DB use it, otherwise fall back to empty string
                    size: item.size || "" 
                }));
            }
            return orderObj;
        });

        // Debugging snapshot verification printed to your backend terminal
        console.log("--- Populated Order Verification ---")
        if(cleanOrders.length > 0) {
            console.log(JSON.stringify(cleanOrders[0].items, null, 2))
        } else {
            console.log("No orders found for this user yet.")
        }

        res.status(200).json({
            data : cleanOrders, // Sending back cleaned data with guaranteed size properties
            success : true,
            error : false,
            message : "User orders retrieved successfully."
        })

    } catch (error) {
        res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

module.exports = userOrdersController