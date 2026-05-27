const backendDomin = "http://localhost:8080"

const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    deleteUser : { // 🌟 ADDED: Connects your frontend dashboard table to the admin router execution chain
        url : `${backendDomin}/api/delete-user`,
        method : "delete"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    deleteProduct : {
        url : `${backendDomin}/api/delete-product`,
        method : 'delete'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomin}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomin}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView : {
        url : `${backendDomin}/api/view-card-product`,
        method : 'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    },
    
    // ==========================================
    // ORDER & CHECKOUT MANAGEMENT ENDPOINTS
    // ==========================================
    checkoutOrder : {
        url : `${backendDomin}/api/checkout-order`,
        method : 'post'
    },
    adminOrders : {
        url : `${backendDomin}/api/admin-orders`,
        method : 'get'
    },
    approveOrder : (orderId) => ({
        url : `${backendDomin}/api/approve-order/${orderId}`,
        method : 'put'
    }),

    // ALIASES TO MATCH YOUR ALLORDERS.JSX FRONTEND:
    allOrders : {
        url : `${backendDomin}/api/admin-orders`,
        method : 'get'
    },
    updateOrderStatus : {
        url : `${backendDomin}/api/update-order-status`, 
        method : 'post'
    },

    // For users to fetch their own order tracking logs
    userOrders : {
        url : `${backendDomin}/api/user-orders`,
        method : 'get'
    }
}

export default SummaryApi