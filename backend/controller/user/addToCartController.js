const addToCartModel = require("../../models/cartProduct")

const addToCartController = async(req,res)=>{
    try{
        // 1. Extract 'size' from req.body alongside the productId
        const { productId, size } = req?.body
        const currentUser = req.userId

        // 2. Look for an existing cart item that matches BOTH product ID AND size variation
        const isProductAvailable = await addToCartModel.findOne({ 
            productId, 
            userId: currentUser, // Ensure we check only this user's cart items
            size: size || ""     // Matches the specific variation selection
        })

        console.log("isProductAvailable ", isProductAvailable)

        if(isProductAvailable){
            return res.json({
                message : "This product variation already exists in your cart",
                success : false,
                error : true
            })
        }

        // 3. Include size inside the saved payload data
        const payload  = {
            productId : productId,
            quantity : 1,
            userId : currentUser,
            size : size || "" // Saves the size text (or empty string for non-shoe categories)
        }

        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()

        return res.json({
            data : saveProduct,
            message : "Product Added in Cart",
            success : true,
            error : false
        })
        

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = addToCartController