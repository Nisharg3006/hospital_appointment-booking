import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return (
    <div className='min-h-screen bg-white border-r'>
      {aToken && <ul className='text-[#515151] mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.add_icon} alt='' />
          <p className='hidden md:block'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Doctors List</p>
        </NavLink>
        <NavLink to={'/staff-management'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Staff Management</p>
        </NavLink>
        <NavLink to={'/disease-management'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Disease Management</p>
        </NavLink>
        <NavLink to={'/room-management'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Room Management</p>
        </NavLink>
        <NavLink to={'/billing-management'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.earning_icon} alt='' />
          <p className='hidden md:block'>Billing Management</p>
        </NavLink>
        <NavLink to={'/admission-management'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Admission Management</p>
        </NavLink>
        <NavLink to={'/chatbot-analytics'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.chats_icon} alt='' />
          <p className='hidden md:block'>Chatbot Analytics</p>
        </NavLink>
      </ul>}

      {dToken && <ul className='text-[#515151] mt-5'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.home_icon} alt='' />
          <p className='hidden md:block'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-emerald-500' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Profile</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar
