const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')

async function deleteProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied")
        }

        const { _id } = req.body

        if (!_id) {
            throw new Error("Product id is required")
        }

        const deleteProduct = await productModel.findByIdAndDelete(_id)

        if (!deleteProduct) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
                error: true
            })
        }

        res.json({
            message: "Product deleted successfully",
            data: deleteProduct,
            success: true,
            error: false
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = deleteProductController