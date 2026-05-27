import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete, MdHourglassEmpty, MdCheckCircle } from "react-icons/md";
import { toast } from 'react-toastify'

const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    // Track order processing status views
    const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false)
    const [lastOrderDetails, setLastOrderDetails] = useState(null)

    // Form states for Shipping Address
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
    })

    const fetchData = async () => {
        setLoading(true) 
        try {
            const response = await fetch(SummaryApi.addToCartProductView.url, {
                method: SummaryApi.addToCartProductView.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
            })
            const responseData = await response.json()
            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            toast.error("Failed to load cart items")
        } finally {
            setLoading(false) 
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1
            })
        })
        const responseData = await response.json()
        if (responseData.success) {
            fetchData()
        }
    }

    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    "content-type": 'application/json'
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1
                })
            })
            const responseData = await response.json()
            if (responseData.success) {
                fetchData()
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
            })
        })
        const responseData = await response.json()
        if (responseData.success) {
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault()
        
        const processedItems = data.map(item => {
            let pId = "";
            if (item.productId) {
                pId = typeof item.productId === 'object' ? item.productId._id : item.productId;
            }
            return {
                productId: pId,
                quantity: item.quantity
            };
        }).filter(item => item.productId);

        if (processedItems.length === 0) {
            toast.error("Cannot process order. Your shopping cart data structure is invalid.");
            return;
        }

        const orderPayload = {
            items: processedItems,
            addressInfo: address
        }

        try {
            const response = await fetch(SummaryApi.checkoutOrder.url, {
                method: SummaryApi.checkoutOrder.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(orderPayload)
            })

            const responseData = await response.json()

            if (responseData.success) {
                toast.success("Order Placed Successfully! Status: Pending Confirmation.")
                setShowCheckoutModal(false)
                
                // Save state to render the pending dashboard screen summary block
                setLastOrderDetails({
                    orderId: responseData.data?._id || responseData.orderId || "N/A",
                    status: responseData.orderStatus || "Pending",
                    totalAmount: totalPrice,
                    itemCount: totalQty
                })
                setOrderPlacedSuccess(true)
                
                setData([]) // Wipe general cart display clean
                context.fetchUserAddToCart() // Sync dynamic header counts
            } else {
                toast.error(responseData.message || "Checkout failed")
            }
        } catch (error) {
            toast.error("An error occurred during payment processing.")
        }
    }

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0)
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * (curr?.productId?.sellingPrice || 0)), 0)

    // RENDER PENDING ORDER DASHBOARD CONFIRMATION SCREEN
    if (orderPlacedSuccess && lastOrderDetails) {
        return (
            <div className='container mx-auto p-4 max-w-xl text-center py-12'>
                <div className='bg-white shadow border rounded-lg p-8 space-y-6 flex flex-col items-center animate-fadeIn'>
                    <div className='bg-amber-100 p-4 rounded-full text-amber-600 text-5xl relative animate-pulse'>
                        <MdHourglassEmpty />
                    </div>
                    
                    <div className='space-y-2'>
                        <h2 className='text-2xl font-bold text-slate-800'>Order is Pending Confirmation!</h2>
                        <p className='text-sm text-slate-500 max-w-sm mx-auto'>
                            Your payment validation and inventory dispatch properties are currently under review by our administration team.
                        </p>
                    </div>

                    <div className='w-full bg-slate-50 border rounded-md p-4 space-y-3 text-left text-sm text-slate-600'>
                        <div className='flex justify-between border-b pb-2 font-medium'>
                            <span>Order Reference Number:</span>
                            <span className='font-mono font-bold text-slate-800'>{lastOrderDetails.orderId}</span>
                        </div>
                        <div className='flex justify-between border-b pb-2'>
                            <span>Total Ordered Volume:</span>
                            <span className='font-semibold text-slate-800'>{lastOrderDetails.itemCount} Units</span>
                        </div>
                        <div className='flex justify-between border-b pb-2'>
                            <span>Settlement Value:</span>
                            <span className='font-bold text-slate-800'>{displayINRCurrency(lastOrderDetails.totalAmount)}</span>
                        </div>
                        <div className='flex justify-between pt-1 font-semibold items-center'>
                            <span>Processing State:</span>
                            <span className='px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold uppercase tracking-wider animate-pulse'>
                                {lastOrderDetails.status}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setOrderPlacedSuccess(false)} 
                        className='bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-2.5 px-6 rounded transition-all w-full shadow-sm'
                    >
                        Return to Shop Catalog
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto p-4 relative'>
            <h2 className='text-xl font-bold my-3 text-slate-800'>Shopping Cart</h2>
            
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && (
                    <p className='bg-white py-10 shadow border rounded text-slate-500'>Your cart is empty.</p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>   
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        loadingCart?.map((el, index) => (
                            <div key={"Add To Cart Loading" + index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded' />
                        ))
                    ) : (
                        data.map((product, index) => (
                            <div key={product?._id + "CartItem"} className='w-full bg-white h-32 my-2 border border-slate-200 shadow-sm rounded grid grid-cols-[128px,1fr] overflow-hidden'>
                                <div className='w-32 h-32 bg-slate-100 flex items-center justify-center p-2'>
                                    <img src={product?.productId?.productImage[0]} className='max-w-full max-h-full object-scale-down mix-blend-multiply' alt={product?.productId?.productName} />
                                </div>
                                <div className='px-4 py-2 relative flex flex-col justify-between'>
                                    <div className='absolute right-2 top-2 text-slate-400 hover:text-red-600 cursor-pointer text-xl transition-all' onClick={() => deleteCartProduct(product?._id)}>
                                        <MdDelete />
                                    </div>

                                    <div>
                                        <h2 className='text-base lg:text-lg text-slate-800 font-medium text-ellipsis line-clamp-1 pr-6'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-xs text-slate-400 font-medium'>{product?.productId?.category}</p>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-3 border rounded bg-slate-50 px-2 py-0.5'>
                                            <button className='text-red-600 font-bold text-lg active:scale-90 transition-all' onClick={() => decraseQty(product?._id, product?.quantity)}>-</button>
                                            <span className='text-sm font-semibold w-4 text-center'>{product?.quantity}</span>
                                            <button className='text-red-600 font-bold text-lg active:scale-90 transition-all' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-xs text-slate-400'>Item price: {displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                            <p className='text-base font-bold text-slate-700'>{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                        </div>
                                    </div>
                                </div>    
                            </div>
                        ))
                    )}
                </div>

                {/***summary  */}
                {data.length > 0 && (
                    <div className='w-full max-w-sm'>
                        {loading ? (
                            <div className='h-40 bg-slate-200 border border-slate-300 animate-pulse rounded' />
                        ) : (
                            <div className='bg-white border rounded shadow-sm overflow-hidden'>
                                <h2 className='text-white bg-red-600 px-4 py-2 font-semibold text-lg'>Order Summary</h2>
                                <div className='p-4 space-y-3'>
                                    <div className='flex items-center justify-between font-medium text-slate-600'>
                                        <p>Total Items</p>
                                        <p>{totalQty} units</p>
                                    </div>
                                    <div className='flex items-center justify-between font-bold text-xl text-slate-800 border-t pt-2'>
                                        <p>Grand Total</p>
                                        <p className='text-red-600'>{displayINRCurrency(totalPrice)}</p>    
                                    </div>
                                    <button 
                                        onClick={() => setShowCheckoutModal(true)} 
                                        className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 w-full mt-4 rounded transition-all shadow-sm'
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* CHECKOUT SHIPPING ADDRESS MODAL */}
            {showCheckoutModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn'>
                    <div className='bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative'>
                        <h3 className='text-lg font-bold text-slate-800 mb-4 border-b pb-2'>Shipping & Contact Information</h3>
                        
                        <form onSubmit={handlePlaceOrder} className='space-y-4'>
                            <div>
                                <label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Street Address</label>
                                <input required type='text' name='street' value={address.street} onChange={handleInputChange} className='w-full border p-2 text-sm rounded bg-slate-50 focus:outline-blue-500' placeholder='123 Main St, Apt 4B' />
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>City</label>
                                    <input required type='text' name='city' value={address.city} onChange={handleInputChange} className='w-full border p-2 text-sm rounded bg-slate-50 focus:outline-blue-500' placeholder='Mumbai' />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>State</label>
                                    <input required type='text' name='state' value={address.state} onChange={handleInputChange} className='w-full border p-2 text-sm rounded bg-slate-50 focus:outline-blue-500' placeholder='Maharashtra' />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Zip / Postal Code</label>
                                    <input required type='text' name='zipCode' value={address.zipCode} onChange={handleInputChange} className='w-full border p-2 text-sm rounded bg-slate-50 focus:outline-blue-500' placeholder='400001' />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-500 uppercase mb-1'>Phone Number</label>
                                    <input required type='tel' name='phone' value={address.phone} onChange={handleInputChange} className='w-full border p-2 text-sm rounded bg-slate-50 focus:outline-blue-500' placeholder='9876543210' />
                                </div>
                            </div>

                            <div className='flex gap-3 justify-end pt-4 border-t mt-6'>
                                <button type='button' onClick={() => setShowCheckoutModal(false)} className='px-4 py-2 text-sm font-medium border rounded text-slate-600 hover:bg-slate-50'>
                                    Cancel
                                </button>
                                <button type='submit' className='px-5 py-2 text-sm font-medium rounded bg-green-600 hover:bg-green-700 text-white shadow-sm'>
                                    Confirm & Place Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart