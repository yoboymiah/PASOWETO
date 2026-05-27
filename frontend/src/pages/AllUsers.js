import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import moment from 'moment'
import { MdModeEdit, MdDelete } from "react-icons/md"; // 🌟 Imported MdDelete
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser,setAllUsers] = useState([])
    const [openUpdateRole,setOpenUpdateRole] = useState(false)
    const [updateUserDetails,setUpdateUserDetails] = useState({
        email : "",
        name : "",
        role : "",
        _id  : ""
    })

    const fetchAllUsers = async() =>{
        const fetchData = await fetch(SummaryApi.allUser.url,{
            method : SummaryApi.allUser.method,
            credentials : 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
            setAllUsers(dataResponse.data)
        }

        if(dataResponse.error){
            toast.error(dataResponse.message)
        }
    }

    // 🌟 1. Added Frontend Handler to call our DELETE route configuration
    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to permanently delete this user?")) {
            try {
                const response = await fetch(SummaryApi.deleteUser.url, {
                    method: SummaryApi.deleteUser.method,
                    headers: {
                        "content-type": "application/json"
                    },
                    credentials: 'include',
                    body: JSON.stringify({ userIdToDelete: userId }) // Matches your backend request body
                })

                const dataResponse = await response.json()

                if (dataResponse.success) {
                    toast.success(dataResponse.message)
                    fetchAllUsers() // 🌟 Instantly refreshes the list without page reload
                }

                if (dataResponse.error) {
                    toast.error(dataResponse.message)
                }

            } catch (error) {
                toast.error(error?.message || error)
            }
        }
    }

    useEffect(()=>{
        fetchAllUsers()
    },[])

  return (
    <div className='bg-white pb-4'>
        <table className='w-full userTable'>
            <thead>
                <tr className='bg-black text-white'>
                    <th>Sr.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody className=''>
                {
                    allUser.map((el,index) => {
                        return(
                            <tr key={el?._id || index}>
                                <td>{index+1}</td>
                                <td>{el?.name}</td>
                                <td>{el?.email}</td>
                                <td>{el?.role}</td>
                                <td>{moment(el?.createdAt).format('LL')}</td>
                                <td>
                                    {/* 🌟 2. Added a flex wrapper to align both actions side by side cleanly */}
                                    <div className='flex items-center gap-2'>
                                        {/* Edit Button */}
                                        <button className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white transition-colors' 
                                        onClick={()=>{
                                            setUpdateUserDetails(el)
                                            setOpenUpdateRole(true)
                                        }}
                                        title="Edit Role"
                                        >
                                            <MdModeEdit/>
                                        </button>

                                        {/* Delete Button */}
                                        <button className='bg-red-100 p-2 text-red-600 rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-colors' 
                                        onClick={() => handleDeleteUser(el?._id)}
                                        title="Delete User"
                                        >
                                            <MdDelete/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>

        {
            openUpdateRole && (
                <ChangeUserRole 
                    onClose={()=>setOpenUpdateRole(false)} 
                    name={updateUserDetails.name}
                    email={updateUserDetails.email}
                    role={updateUserDetails.role}
                    userId={updateUserDetails._id}
                    callFunc={fetchAllUsers}
                />
            )      
        }
    </div>
  )
}

export default AllUsers