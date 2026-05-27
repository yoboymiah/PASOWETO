import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
// 📦 Imported FiPackage icon to style the standalone orders link next to the profile menu
import { FiPackage } from "react-icons/fi"; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay,setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)

  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout_user.url,{
      method : SummaryApi.logout_user.method,
      credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if(data.error){
      toast.error(data.message)
    }
  }

  const handleSearch = (e)=>{
    const { value } = e.target
    setSearch(value)

    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")
    }
  }

  return (
    <header className='h-16 shadow-md bg-white fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-2 sm:px-4 justify-between gap-2'>
            
            {/* Logo - Scales nicely on smaller screens */}
            <div className='shrink-0'>
                <Link to={"/"}>
                    <Logo w={110} h={55} className="w-[110px] h-[55px] sm:w-[140px] sm:h-[70px]"/>
                </Link>
            </div>

            {/* Search Bar - Hidden on mobile screens to save vital row space, visible from lg upward */}
            <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
                <input type='text' placeholder='search product here...' className='w-full outline-none' onChange={handleSearch} value={search}/>
                <div className='text-lg min-w-[50px] h-8 bg-green-600 flex items-center justify-center rounded-r-full text-white'>
                  <GrSearch />
                </div>
            </div>

            {/* Navigation Icons Action Block - Uses tight gap spacing on mobile (gap-3) and widens on desktop (sm:gap-6) */}
            <div className='flex items-center gap-3 sm:gap-6 ml-auto'>
                
                {/* 🌟 RESPONSIVE ORDERS PACKAGE LINK */}
                {
                  user?._id && (
                    <Link 
                      to={"/my-orders"} 
                      className='text-2xl text-slate-700 hover:text-red-600 transition-colors flex items-center gap-1.5 group'
                      title="View My Orders"
                    >
                      <FiPackage className="text-[22px] sm:text-2xl" />
                      {/* Text label hides automatically on mobile rows, reveals on medium devices up */}
                      <span className='text-xs hidden md:inline font-semibold text-slate-600 group-hover:text-red-600'>Orders</span>
                    </Link>
                  )
                }

                {/* Profile Picture Drawer Container */}
                <div className='relative flex justify-center'>
                  {
                    user?._id ? (
                      <div className='text-2xl sm:text-3xl cursor-pointer relative flex items-center justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border shadow-sm' alt={user?.name} />
                          ) : (
                            <FaRegCircleUser className="text-[22px] sm:text-[28px]"/>
                          )
                        }
                      </div>
                    ) : (
                      <div className='text-2xl sm:text-3xl cursor-pointer relative flex items-center justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        <FaRegCircleUser className="text-[22px] sm:text-[28px]"/>
                      </div>
                    )
                  }
                  
                  {/* Dropdown Menu Overlay - Right aligned to prevent cutting off on mobile screens */}
                  {
                    menuDisplay && (
                      <div className='absolute bg-white right-0 top-11 h-fit p-2 shadow-xl border rounded-md min-w-[150px] z-50 animate-fadeIn' >
                        <nav className='flex flex-col gap-1'>
                          {/* Admin Panel Link */}
                          {
                            user?.role === ROLE.ADMIN && (
                              <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hover:bg-slate-50 p-2.5 rounded text-sm text-slate-700 font-medium' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                            )
                          }
                          
                          {/* Secondary Orders Link inside menu drawer for enhanced mobile accessibility */}
                          {
                            user?._id && (
                              <Link to={"/my-orders"} className='whitespace-nowrap md:hidden hover:bg-slate-50 p-2.5 rounded text-sm text-slate-700 font-medium' onClick={()=>setMenuDisplay(preve => !preve)}>My Orders</Link>
                            )
                          }
                        </nav>
                      </div>
                    )
                  }
                </div>

                {/* Shopping Cart Icon Link */}
                {
                  user?._id && (
                    <Link to={"/cart"} className='text-2xl relative flex items-center justify-center'>
                      <FaShoppingCart className="text-[20px] sm:text-[24px] text-slate-700 hover:text-red-600 transition-colors" />
                      <div className='bg-red-600 text-white min-w-[18px] h-[18px] sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center absolute -top-2 -right-2.5 shadow-sm px-1'>
                          {context?.cartProductCount}
                      </div>
                    </Link>
                  )
                }
              
                {/* Responsive Login/Logout CTA Buttons */}
                <div className='shrink-0'>
                  {
                    user?._id ? (
                      <button onClick={handleLogout} className='text-xs sm:text-sm px-3 py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 font-medium transition-all shadow-sm'>Logout</button>
                    ) : (
                      <Link to={"/login"} className='text-xs sm:text-sm px-4 py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 font-medium transition-all shadow-sm'>Login</Link>
                    )
                  }
                </div>

            </div>

      </div>
    </header>
  )
}

export default Header