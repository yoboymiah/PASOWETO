import SummaryApi from "../common"
import { toast } from 'react-toastify'

// 🌟 THE FIX: Added 'size' as the third parameter with a blank string default
const addToCart = async(e, id, size = "") => {
    e?.stopPropagation()
    e?.preventDefault()

    const response = await fetch(SummaryApi.addToCartProduct.url, {
        method : SummaryApi.addToCartProduct.method,
        credentials : 'include',
        headers : {
            "content-type" : 'application/json'
        },
        // 🌟 THE FIX: Pass the size parameter along inside your JSON request body payload!
        body : JSON.stringify({ 
            productId : id,
            size : size 
        })
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
    }

    return responseData
}

export default addToCart