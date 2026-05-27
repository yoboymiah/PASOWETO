const userModel = require("../../models/userModel");

async function deleteUserController(req, res) {
    try {
        // req.userId comes from your authToken middleware verifying the admin session
        const currentUserId = req.userId; 
        const { userIdToDelete } = req.body;

        // 1. Safety Check: Verify the admin isn't accidentally deleting themselves
        if (currentUserId === userIdToDelete) {
            return res.status(400).json({
                message: "Operation denied. You cannot delete your own admin account.",
                error: true,
                success: false
            });
        }

        // 2. Database Action: Delete the specified user document
        const deletedUser = await userModel.findByIdAndDelete(userIdToDelete);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found or already removed.",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: "User account permanently deleted successfully.",
            error: false,
            success: true,
            data: deletedUser
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteUserController;