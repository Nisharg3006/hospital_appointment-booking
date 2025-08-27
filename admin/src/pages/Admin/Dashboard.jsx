import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='m-5'>

      {/* Main Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-12 h-12' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.doctors}</p>
            <p className='text-gray-500 text-sm'>Doctors</p>
          </div>
        </div>
        
        <div className='flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-12 h-12' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.patients}</p>
            <p className='text-gray-500 text-sm'>Patients</p>
          </div>
        </div>
        
        <div className='flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-12 h-12' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.appointments}</p>
            <p className='text-gray-500 text-sm'>Appointments</p>
          </div>
        </div>
        
        <div className='flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-12 h-12' src={assets.people_icon} alt="" />
          <div>
            <p className='text-2xl font-bold text-gray-800'>{dashData.staff}</p>
            <p className='text-gray-500 text-sm'>Staff</p>
          </div>
        </div>
      </div>

      {/* Revenue and Financial Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Total Revenue</p>
              <p className='text-2xl font-bold'>₹{dashData.totalRevenue?.toLocaleString()}</p>
            </div>
            <img className='w-12 h-12 opacity-80' src={assets.earning_icon} alt="" />
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Paid Revenue</p>
              <p className='text-2xl font-bold'>₹{dashData.paidRevenue?.toLocaleString()}</p>
            </div>
            <img className='w-12 h-12 opacity-80' src={assets.tick_icon} alt="" />
          </div>
        </div>
        
        <div className='bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm opacity-90'>Pending Revenue</p>
              <p className='text-2xl font-bold'>₹{dashData.pendingRevenue?.toLocaleString()}</p>
            </div>
            <img className='w-12 h-12 opacity-80' src={assets.appointment_icon} alt="" />
          </div>
        </div>
      </div>

      {/* Hospital Management Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='bg-white p-6 rounded-lg border-2 border-gray-100'>
          <div className='flex items-center gap-3 mb-4'>
            <img className='w-10 h-10' src={assets.appointment_icon} alt="" />
            <h3 className='text-lg font-semibold text-gray-800'>Admissions</h3>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Admissions:</span>
              <span className='font-semibold'>{dashData.admissions}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Current Patients:</span>
              <span className='font-semibold text-blue-600'>{dashData.currentAdmissions}</span>
            </div>
          </div>
        </div>
        
        <div className='bg-white p-6 rounded-lg border-2 border-gray-100'>
          <div className='flex items-center gap-3 mb-4'>
            <img className='w-10 h-10' src={assets.home_icon} alt="" />
            <h3 className='text-lg font-semibold text-gray-800'>Rooms</h3>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Rooms:</span>
              <span className='font-semibold'>{dashData.totalRooms}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Available:</span>
              <span className='font-semibold text-green-600'>{dashData.availableRooms}</span>
            </div>
          </div>
        </div>
        
        <div className='bg-white p-6 rounded-lg border-2 border-gray-100'>
          <div className='flex items-center gap-3 mb-4'>
            <img className='w-10 h-10' src={assets.chats_icon} alt="" />
            <h3 className='text-lg font-semibold text-gray-800'>Chatbot</h3>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Total Sessions:</span>
              <span className='font-semibold'>{dashData.chatbotSessions}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Active:</span>
              <span className='font-semibold text-purple-600'>Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Appointments */}
      <div className='bg-white rounded-lg border-2 border-gray-100 mb-8'>
        <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-200'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold text-lg'>Latest Appointments</p>
        </div>

        <div className='p-4'>
          {dashData.latestAppointments.map((item, index) => (
            <div className='flex items-center px-4 py-3 gap-3 hover:bg-gray-50 rounded-lg mb-2' key={index}>
              <img className='rounded-full w-10 h-10 object-cover' src={item.docData.image} alt="" />
              <div className='flex-1'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600 text-sm'>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <span className='text-red-500 text-sm font-medium px-2 py-1 bg-red-50 rounded'>Cancelled</span>
              ) : item.isCompleted ? (
                <span className='text-green-500 text-sm font-medium px-2 py-1 bg-green-50 rounded'>Completed</span>
              ) : (
                <img 
                  onClick={() => cancelAppointment(item._id)} 
                  className='w-8 h-8 cursor-pointer hover:scale-110 transition-transform' 
                  src={assets.cancel_icon} 
                  alt="" 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Latest Admissions */}
      {dashData.latestAdmissions && dashData.latestAdmissions.length > 0 && (
        <div className='bg-white rounded-lg border-2 border-gray-100'>
          <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-200'>
            <img src={assets.appointment_icon} alt="" />
            <p className='font-semibold text-lg'>Latest Admissions</p>
          </div>

          <div className='p-4'>
            {dashData.latestAdmissions.map((item, index) => (
              <div className='flex items-center px-4 py-3 gap-3 hover:bg-gray-50 rounded-lg mb-2' key={index}>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='text-blue-600 font-semibold text-sm'>P</span>
                </div>
                <div className='flex-1'>
                  <p className='text-gray-800 font-medium'>Patient ID: {item.patientId}</p>
                  <p className='text-gray-600 text-sm'>Room {item.roomNumber} • {item.status}</p>
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  item.status === 'admitted' ? 'text-blue-500 bg-blue-50' : 
                  item.status === 'discharged' ? 'text-green-500 bg-green-50' : 
                  'text-gray-500 bg-gray-50'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard