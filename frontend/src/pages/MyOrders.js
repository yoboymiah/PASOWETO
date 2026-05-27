import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchMyOrders = async () => {
    try {
      const response = await fetch(SummaryApi.userOrders.url, {
        method: SummaryApi.userOrders.method,
        credentials: 'include', 
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      const dataResponse = await response.json()

      if (dataResponse.success) {
        setOrders(dataResponse.data || [])
      }
    } catch (error) {
      console.error("Could not load tracking information:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [])

  if (loading) return <div className='p-8 text-center text-lg font-semibold pt-24'>Loading your order details...</div>

  return (
    <div className='container mx-auto p-4 max-w-4xl pt-24 min-h-[80vh]'>
      <h2 className='text-2xl font-bold mb-6 text-slate-800 border-b pb-2'>Your Purchase History</h2>
      {
        orders.length === 0 ? (
          <p className='text-gray-500 bg-gray-50 p-6 rounded text-center border border-dashed'>You haven't placed any orders yet.</p>
        ) : (
          <div className='space-y-6'>
            {orders.map((order) => {
              // Calculate grand total price for this individual order block in Zambian Kwacha
              const grandTotal = order.items?.reduce((acc, item) => {
                const itemPrice = item.productId?.price || item.productId?.sellingPrice || 0;
                return acc + (itemPrice * item.quantity);
              }, 0) || 0;

              return (
                <div key={order._id} className='border rounded-lg shadow-sm bg-white overflow-hidden'>
                  
                  {/* Upper Status Banner Row */}
                  <div className='bg-slate-50 p-4 border-b flex flex-wrap justify-between items-center gap-4'>
                    <div>
                      <p className='text-xs text-gray-400 font-mono'>Order ID: {order._id}</p>
                      <p className='text-sm text-gray-500 mt-0.5'>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className='flex items-center gap-6'>
                      <div className='text-right'>
                        <p className='text-xs text-slate-400 font-medium uppercase'>Grand Total</p>
                        {/* 🌟 Updated Currency Label to ZMW / ZK */}
                        <p className='font-bold text-slate-800 text-base'>ZK {grandTotal.toLocaleString()}</p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-500 font-medium'>Status:</span>
                        <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide
                          ${order.status === 'Approved' || order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 
                            'bg-amber-100 text-amber-700'}`}>
                          {order.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lower Product Grid List Loop */}
                  <div className='p-4 divide-y divide-slate-100'>
                    {order.items?.map((item, itemIndex) => {
                      const product = item.productId || {};
                      
                      const displayImage = product.productImage?.[0] || product.image || null;
                      const displayName = product.productName || product.name || "Product Details Unavailable";
                      const displayPrice = product.price || product.sellingPrice || 0;

                      return (
                        <div key={item._id || itemIndex} className='flex gap-4 py-4 first:pt-0 last:pb-0 items-center justify-between'>
                          <div className='flex gap-4 items-center'>
                            {
                              displayImage ? (
                                <img 
                                  src={displayImage} 
                                  alt={displayName} 
                                  className='w-16 h-16 object-scale-down bg-slate-50 border p-1 rounded'
                                />
                              ) : (
                                <div className='w-16 h-16 bg-slate-100 border rounded flex items-center justify-center text-xs text-slate-400'>No Image</div>
                              )
                            }
                            <div>
                              <h4 className='font-medium text-slate-800 line-clamp-1'>{displayName}</h4>
                              {/* 🌟 Updated Currency Display for Individual items */}
                              <p className='text-sm text-gray-500 mt-0.5 font-medium'>Unit Price: ZK {displayPrice.toLocaleString()}</p>
                              
                              <div className='flex items-center gap-3 mt-0.5'>
                                <p className='text-sm text-slate-500'>Qty: <span className='font-medium text-slate-700'>{item.quantity}</span></p>
                                
                                {/* 🌟 INCLUDED SHOE SIZE DESIGN TAG HERE */}
                                {
                                  item.size && (
                                    <span className='inline-flex items-center bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded border border-slate-200'>
                                      Size: <span className='text-red-600 ml-1 font-bold'>{item.size}</span>
                                    </span>
                                  )
                                }
                              </div>
                            </div>
                          </div>
                          
                          <div className='text-right'>
                            {/* 🌟 Updated Row Item Subtotal */}
                            <p className='font-bold text-slate-700'>
                              ZK {(displayPrice * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Address Information Section */}
                  {order.addressInfo && (
                    <div className='bg-slate-50/50 p-4 border-t text-xs text-slate-500 flex flex-wrap justify-between gap-2'>
                      <p><strong>Shipping Address:</strong> {order.addressInfo.street || order.addressInfo.addressLine1}, {order.addressInfo.city}, {order.addressInfo.state} {order.addressInfo.zipCode || order.addressInfo.pincode}</p>
                      <p><strong>Phone:</strong> {order.addressInfo.phone || order.addressInfo.mobileNumber}</p>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )
      }
    </div>
  )
}

export default MyOrders