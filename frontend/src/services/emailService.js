import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Send registration confirmation email
export const sendRegistrationEmail = async (userData) => {
  try {
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      message: `Welcome to Charusat Hospital! Your account has been successfully created. You can now book appointments with our doctors.`,
      subject: 'Welcome to Charusat Hospital - Registration Successful',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return { success: true, message: 'Registration confirmation email sent!' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send confirmation email' };
  }
};

// Send appointment confirmation email
export const sendAppointmentEmail = async (appointmentData) => {
  try {
    const templateParams = {
      to_name: appointmentData.userData.name,
      to_email: appointmentData.userData.email,
      doctor_name: appointmentData.docData.name,
      appointment_date: appointmentData.slotDate,
      appointment_time: appointmentData.slotTime,
      message: `Your appointment has been successfully booked with Dr. ${appointmentData.docData.name} on ${appointmentData.slotDate} at ${appointmentData.slotTime}.`,
      subject: 'Appointment Confirmation - Charusat Hospital',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Appointment email sent successfully:', response);
    return { success: true, message: 'Appointment confirmation email sent!' };
  } catch (error) {
    console.error('Appointment email sending failed:', error);
    return { success: false, message: 'Failed to send appointment confirmation email' };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (userData, resetToken) => {
  try {
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;
    
    const templateParams = {
      to_name: userData.name,
      to_email: userData.email,
      reset_link: resetLink,
      message: `You requested a password reset. Click the link below to reset your password: ${resetLink}`,
      subject: 'Password Reset Request - Charusat Hospital',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Password reset email sent successfully:', response);
    return { success: true, message: 'Password reset email sent!' };
  } catch (error) {
    console.error('Password reset email sending failed:', error);
    return { success: false, message: 'Failed to send password reset email' };
  }
}; 