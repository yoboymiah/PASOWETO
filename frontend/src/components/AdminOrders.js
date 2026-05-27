import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment' // Highly recommended for clean formatting: npm i moment

const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.adminOrders.url, {
        method: SummaryApi.adminOrders.method,
        credentials: 'include'
      })
      const responseData = await response.json()
      if (responseData.success) {
        setAllOrders(responseData.data)
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error("Error fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveOrder = async (orderId) => {
    try {
      const apiConfig = SummaryApi.approveOrder(orderId)
      const response = await fetch(apiConfig.url, {
        method: apiConfig.method,
        credentials: 'include',
        headers: {
          "content-type": "application/json"
        }
      })
      const responseData = await response.json()

      if (responseData.success) {
        toast.success(responseData.message)
        fetchAllOrders() // Refresh the list
      } else {
        toast.error(responseData.message)
      }
    } catch (error) {
      toast.error("Failed to approve order")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  return (
    <div className='p-4 bg-slate-50 min-h-[calc(100vh-120px)]'>
      <div className='bg-white p-4 justify-between items-center flex border-b mb-4 shadow-sm rounded'>
        <h2 className='font-bold text-xl'>All Client Orders</h2>
        <button onClick={fetchAllOrders} className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded transition-all text-sm'>Refresh Data</button>
      </div>

      {loading ? (
        <p className='text-center text-lg text-slate-500 mt-10'>Loading current system orders...</p>
      ) : allOrders.length === 0 ? (
        <p className='text-center text-lg text-slate-500 mt-10'>No orders placed yet.</p>
      ) : (
        <div className='flex flex-col gap-6 max-w-5xl mx-auto'>
          {allOrders.map((order, index) => (
            <div key={order._id} className='bg-white border rounded shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3'>
              
              {/* Column 1: Client Address & Meta Data */}
              <div className='p-4 border-b md:border-b-0 md:border-r bg-slate-50/50 flex flex-col justify-between'>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-xs font-mono text-slate-400'>#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      order.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className='text-xs text-slate-500 mb-3'>{moment(order.createdAt).format('LLLL')}</p>
                  
                  <h3 className='font-semibold text-sm text-slate-700 mb-1 border-b pb-1'>Shipping Details</h3>
                  <div className='text-sm text-slate-600 space-y-0.5'>
                    <p><span className='font-medium text-slate-500'>User Link ID:</span> {order.userId}</p>
                    <p className='font-medium text-slate-800'>{order.addressInfo?.street}</p>
                    <p>{order.addressInfo?.city}, {order.addressInfo?.state} - {order.addressInfo?.zipCode}</p>
                    <p><span className='font-medium text-slate-500'>Phone:</span> {order.addressInfo?.phone}</p>
                  </div>
                </div>

                {/* Approve Action Button */}
                {order.status === 'Pending' && (
                  <button 
                    onClick={() => handleApproveOrder(order._id)}
                    className='mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded shadow-sm transition-all'
                  >
                    Approve Order
                  </button>
                )}
              </div>

              {/* Column 2 & 3: Ordered Products Breakdown */}
              <div className='col-span-2 p-4 flex flex-col justify-between gap-4'>
                <div className='divide-y max-h-60 overflow-y-auto pr-2'>
                  {order.items.map((item, idx) => {
                    const product = item.productId || {} // Safeguard against deleted products
                    return (
                      <div key={idx} className='flex gap-3 py-2 first:pt-0 last:pb-0 items-center'>
                        <img 
                          src={product.productImage?.[0] || 'https://via.placeholder.com/50'} 
                          alt={product.productName} 
                          className='w-12 h-12 object-scale-down bg-slate-100 p-1 border rounded' 
                        />
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-slate-800 truncate'>{product.productName || "Product No Longer Exists"}</p>
                          <p className='text-xs text-slate-500'>Category: {product.category || 'N/A'}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-semibold text-slate-700'>${product.sellingPrice || 0}</p>
                          <p className='text-xs text-slate-400'>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Calculated Order Total Footer */}
                <div className='border-t pt-3 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 p-4'>
                  <span className='font-medium text-slate-600 text-sm'>Total Ordered Scope:</span>
                  <span className='text-xl font-bold text-red-600'>
                    ${order.items.reduce((sum, item) => sum + ((item.productId?.sellingPrice || 0) * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrders