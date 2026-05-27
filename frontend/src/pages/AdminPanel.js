import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
// 🌟 Icons imported for better mobile readability
import { FiUsers, FiBox, FiClipboard } from 'react-icons/fi';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    useEffect(()=>{
        if(user && user?.role !== ROLE.ADMIN){
            navigate("/")
        }
    },[user, navigate])

  return (
    // 🌟 FIXED: Removed 'md:flex hidden' so it displays across all platforms. 
    // Added pt-20 to ensure it sits safely below your fixed header component.
    <div className='min-h-[calc(100vh-80px)] flex flex-col md:flex-row pt-20 w-full bg-slate-50'>

        {/* Sidebar Container: Becomes a top bar on mobile, turns into a sidebar on desktop */}
        <aside className='bg-white w-full md:max-w-60 customShadow flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-slate-100'>
                
                {/* Profile Card Summary Block - Hidden on mobile screen rows to save space */}
                <div className='h-32 hidden md:flex justify-center items-center flex-col border-b border-slate-50 bg-slate-50/50 p-4'>
                    <div className='text-5xl relative flex justify-center mb-2'>
                        {
                        user?.profilePic ? (
                            <img src={user?.profilePic} className='w-16 h-16 rounded-full object-cover border-2 border-red-500 shadow-sm' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser className='text-slate-400'/>
                        )
                        }
                    </div>
                    <p className='capitalize text-base font-bold text-slate-800 line-clamp-1'>{user?.name}</p>
                    <p className='text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider'>{user?.role}</p>
                </div>

                {/* Dashboard Sub-navigation System */}       
                <div className='w-full'>   
                    {/* 🌟 RESPONSIVE NAV: 'flex overflow-x-auto' on mobile, 'grid gap-1' on desktop */}
                    <nav className='flex flex-row md:flex-col overflow-x-auto scrollbar-none p-2 md:p-4 gap-1 w-full justify-start md:justify-start items-center md:items-stretch'>
                        
                        <Link 
                            to={"all-users"} 
                            className='flex items-center gap-2 px-4 py-2.5 rounded-md hover:bg-slate-100 font-medium text-sm text-slate-700 whitespace-nowrap transition-colors'
                        >
                            <FiUsers className='text-base text-slate-500' />
                            <span>All Users</span>
                        </Link>
                        
                        <Link 
                            to={"all-products"} 
                            className='flex items-center gap-2 px-4 py-2.5 rounded-md hover:bg-slate-100 font-medium text-sm text-slate-700 whitespace-nowrap transition-colors'
                        >
                            <FiBox className='text-base text-slate-500' />
                            <span>All Products</span>
                        </Link>
                        
                        <Link 
                            to={"all-orders"} 
                            className='flex items-center gap-2 px-4 py-2.5 rounded-md hover:bg-slate-100 font-medium text-sm text-slate-700 whitespace-nowrap transition-colors'
                        >
                            <FiClipboard className='text-base text-slate-500' />
                            <span>All Orders</span>
                        </Link>
                        
                    </nav>
                </div>   
        </aside>

        {/* Nested Child Component Router Outlet Container */}
        <main className='w-full flex-1 p-3 sm:p-6 overflow-y-auto max-w-full'>
            <Outlet/>
        </main>
    </div>
  )
}

export default AdminPanel