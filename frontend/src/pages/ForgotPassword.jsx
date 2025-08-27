import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from '../services/emailService'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      // First, check if the user exists
      const { data } = await axios.post(backendUrl + '/api/user/check-email', { email })
      
      if (data.success) {
        // Generate a reset token (you'll need to implement this in the backend)
        const resetToken = 'temp-reset-token-' + Date.now()
        
        // Send password reset email
        const emailResult = await sendPasswordResetEmail(
          { name: data.user.name, email: email },
          resetToken
        )
        
        if (emailResult.success) {
          toast.success('Password reset email sent! Check your inbox.')
          navigate('/login')
        } else {
          toast.error('Failed to send reset email. Please try again.')
        }
      } else {
        toast.error('Email not found. Please check your email address.')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>Forgot Password</p>
        <p>Enter your email address to reset your password</p>
        
        <form onSubmit={handleSubmit} className='w-full'>
          <div className='w-full'>
            <p>Email</p>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className='border border-[#DADADA] rounded w-full p-2 mt-1' 
              type="email" 
              required 
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className='bg-primary text-white w-full py-2 my-2 rounded-md text-base disabled:opacity-50'
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <p>
          Remember your password? 
          <span 
            onClick={() => navigate('/login')} 
            className='text-primary underline cursor-pointer ml-1'
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword 