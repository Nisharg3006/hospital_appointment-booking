import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center px-2 sm:px-4 py-1 bg-white'>
      {/* Left Section with Larger Logo and Role */}
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-20 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="Charusat Hospital Logo" />
        <p className='border px-2 py-0.5 rounded-full border-gray-400 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>

      {/* Right Section with Logout Button */}
      <button onClick={() => logout()} className='bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-6 py-1 rounded-full transition-all'>
        Logout
      </button>

    </div>
  )
}

export default Navbar
