import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment';

const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(SummaryApi.allOrders.url, {
                method: SummaryApi.allOrders.method,
                credentials: 'include'
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                setAllOrders(dataResponse.data || []);
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.error("--- Critical API Request Failure Log ---", error);
            toast.error(`Fetch Failure: ${error.message || "Failed to load global order log."}`);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(SummaryApi.updateOrderStatus.url, {
                method: SummaryApi.updateOrderStatus.method,
                headers: {
                    "content-type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    orderId: orderId,
                    status: newStatus
                })
            });

            const dataResponse = await response.json();

            if (dataResponse.success) {
                toast.success("Order status updated successfully!");
                fetchAllOrders(); 
            } else {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.error("Status update error details:", error);
            toast.error("Error updating transaction records.");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    if (loading) return <div className='p-8 text-center text-lg font-semibold pt-24'>Loading administration order logs...</div>;

    return (
        <div className='container mx-auto p-4 max-w-5xl min-h-[80vh]'>
            <div className='flex justify-between items-center mb-6 border-b pb-3'>
                <div>
                    <h2 className='font-bold text-2xl text-slate-800'>Master Client Orders</h2>
                    <p className='text-sm text-gray-500 mt-0.5'>Total Transactions: {allOrders.length}</p>
                </div>
                <button 
                    onClick={fetchAllOrders} 
                    className='border border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-md transition-all text-sm font-medium shadow-sm'
                >
                    Refresh Log Entries
                </button>
            </div>

            {allOrders.length === 0 ? (
                <div className='text-center text-gray-400 py-12 bg-gray-50 rounded-lg border border-dashed'>
                    No client transactions found in the system database.
                </div>
            ) : (
                <div className='space-y-6'>
                    {allOrders.map((order, index) => {
                        // Calculate Grand Total for this order block in Zambian Kwacha (ZK)
                        const grandTotal = order.items?.reduce((acc, item) => {
                            const price = item.productId?.price || item.productId?.sellingPrice || 0;
                            return acc + (price * item.quantity);
                        }, 0) || 0;

                        return (
                            <div key={order._id} className='bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                                
                                {/* 1. Admin Control Header Banner Row */}
                                <div className='bg-slate-900 text-white p-4 flex flex-wrap justify-between items-center gap-4'>
                                    <div className='flex items-center gap-3'>
                                        <span className='bg-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1 rounded-md'>
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <p className='text-xs text-slate-400 font-mono'>Order Ref: {order._id}</p>
                                            <p className='text-xs text-slate-300 mt-0.5'>Logged: {moment(order.createdAt).format('LLLL')}</p>
                                        </div>
                                    </div>

                                    {/* Order Status Action Dropdown */}
                                    <div className='flex items-center gap-3'>
                                        <span className='text-xs font-medium text-slate-300 uppercase tracking-wider hidden sm:inline'>Manage Status:</span>
                                        <select 
                                            value={order.status || 'Pending'}
                                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            className={`rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide border-none outline-none cursor-pointer shadow-inner text-slate-900 bg-white
                                                ${order.status === 'Approved' ? 'ring-2 ring-emerald-500' : ''}
                                                ${order.status === 'Delivered' ? 'ring-2 ring-blue-500' : ''} 
                                                ${order.status === 'Cancelled' ? 'ring-2 ring-rose-500' : ''}
                                            `}
                                        >
                                            <option value="Pending">🕒 Pending</option>
                                            <option value="Approved">✅ Approved</option>
                                            {/* 🌟 CHANGED OPTION FROM SHIPPED TO DELIVERED */}
                                            <option value="Delivered">📦 Delivered</option> 
                                            <option value="Cancelled">❌ Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 2. Internal Purchased Item Image & Details Loop Row */}
                                <div className='p-4 bg-white divide-y divide-slate-100'>
                                    <p className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-2'>Cart Items Manifest</p>
                                    {order.items?.map((item, itemIdx) => {
                                        const product = item.productId || {};
                                        const imgUrl = product.productImage?.[0] || product.image || null;
                                        const name = product.productName || product.name || "Product Record Missing/Deleted";
                                        const unitPrice = product.price || product.sellingPrice || 0;

                                        return (
                                            <div key={item._id || itemIdx} className='flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0'>
                                                <div className='flex items-center gap-4'>
                                                    {imgUrl ? (
                                                        <img src={imgUrl} alt={name} className='w-14 h-14 object-scale-down bg-slate-50 border p-1 rounded-lg' />
                                                    ) : (
                                                        <div className='w-14 h-14 bg-slate-100 border text-[10px] text-slate-400 flex items-center justify-center rounded-lg text-center leading-tight font-medium'>No Image</div>
                                                    )}
                                                    <div>
                                                        <h4 className='text-sm font-semibold text-slate-800 line-clamp-1'>{name}</h4>
                                                        
                                                        {/* Details and Size Block */}
                                                        <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5'>
                                                            <p className='text-xs text-slate-500'>Quantity: <span className='font-semibold text-slate-700'>{item.quantity}</span></p>
                                                            
                                                            {/* Size Badge */}
                                                            {item.size && (
                                                                <span className='inline-flex items-center bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200 shadow-sm'>
                                                                    Size: <span className='text-red-600 ml-1 font-extrabold'>{item.size}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <p className='text-xs text-slate-400 mt-0.5'>Unit Cost: ZK {unitPrice.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className='text-right shrink-0'>
                                                    <p className='text-sm font-bold text-slate-700'>ZK {(unitPrice * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* 3. Shipping Target Metadata & Grand Total Footer */}
                                <div className='bg-slate-50 border-t p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center'>
                                    <div className='md:col-span-2 text-xs text-slate-600 space-y-1 border-b md:border-b-0 pb-3 md:pb-0'>
                                        <p className='text-slate-400 font-bold uppercase tracking-wider text-[10px]'>Shipping Destination</p>
                                        <p className='text-slate-800 font-medium'>
                                            {order.addressInfo?.street || "N/A"}, {order.addressInfo?.city || "N/A"}, {order.addressInfo?.state || "N/A"} {order.addressInfo?.zipCode || ""}
                                        </p>
                                        <p className='text-slate-700 mt-1'>
                                            <strong className='text-slate-500'>Customer Phone:</strong> {order.addressInfo?.phone || "No Contact Number"}
                                        </p>
                                        <p className='text-slate-400 text-[10px] font-mono mt-1'>Account Reference Key: {order.userId}</p>
                                    </div>
                                    
                                    <div className='text-right flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-1'>
                                        <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Total Invoice Amount</p>
                                        <p className='text-xl font-black text-emerald-600'>ZK {grandTotal.toLocaleString()}</p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AllOrders;