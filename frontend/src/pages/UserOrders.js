import React, { useEffect, useState } from 'react'
import moment from 'moment'

const UserOrders = () => {
  const [myOrders, setMyOrders] = useState([])

  // Fetching logic pointing to a GET /api/user-orders endpoint...

  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <h2 className='font-bold text-2xl mb-6 border-b pb-2 text-slate-800'>My Orders Tracking</h2>
      
      <div className='space-y-6'>
        {myOrders.map((order) => (
          <div key={order._id} className='bg-white border rounded shadow-sm p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <div className='flex gap-2 items-center mb-1'>
                <span className='font-bold text-sm text-slate-700'>Order Details</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  order.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.status === 'Approved' ? '✅ Approved by Admin' : '⏳ Processing (Pending Approval)'}
                </span>
              </div>
              <p className='text-xs text-slate-400 font-mono'>ID: {order._id}</p>
              <p className='text-xs text-slate-500 mt-2'>{moment(order.createdAt).format('LL')}</p>
              
              <div className='mt-4 text-xs text-slate-600 border-t pt-2'>
                <p className='font-semibold text-slate-500 mb-0.5'>Deliver To:</p>
                <p>{order.addressInfo.street}, {order.addressInfo.city}</p>
              </div>
            </div>

            <div className='md:col-span-2 flex flex-col justify-between border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4'>
              <div className='space-y-2'>
                {order.items.map((item, index) => (
                  <div key={index} className='flex justify-between items-center text-sm text-slate-700'>
                    <span>{item.productId?.productName} <span className='text-xs text-slate-400'>x{item.quantity}</span></span>
                    <span className='font-medium'>${(item.productId?.sellingPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className='border-t mt-4 pt-2 flex justify-between font-bold text-slate-800'>
                <span>Grand Total:</span>
                <span className='text-red-600'>
                  ${order.items.reduce((sum, item) => sum + (item.productId?.sellingPrice * item.quantity), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}