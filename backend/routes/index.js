const express = require('express')
const router = express.Router()

// Existing controllers...
const deleteProductController = require('../controller/product/deleteProductController')
const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const deleteUserController = require('../controller/user/deleteUser') // 🌟 IMPORTED: For administrative user deletion
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct  = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')

// NEW ORDER CONTROLLERS
const checkoutOrderController = require('../controller/order/checkoutOrderController')
const adminGetOrdersController = require('../controller/order/adminGetOrdersController')
const approveOrderController = require('../controller/order/approveOrderController')
const userOrdersController = require('../controller/order/userOrdersController') 


router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)

//admin panel 
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.delete("/delete-user",authToken,deleteUserController) // 🌟 ADDED: Secure endpoint allowing admins to drop users

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)
router.delete("/delete-product", authToken, deleteProductController)

//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

// NEW ORDER ROUTES
router.post("/checkout-order", authToken, checkoutOrderController)
router.get("/admin-orders", authToken, adminGetOrdersController)
router.put("/approve-order/:orderId", authToken, approveOrderController)
router.post("/update-order-status", authToken, approveOrderController)

// Allows users to securely view their specific purchase history when logged in
router.get("/user-orders", authToken, userOrdersController)


module.exports = router