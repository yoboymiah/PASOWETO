import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSendEmail = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(formRef.current)
    const userEmail = formData.get('user_email')
    const userMessage = formData.get('message')

    try {
      // 🚀 Endpoint using Formspree (Free framework helper)
      // Replace 'YOUR_FORMSPREE_ID' with your real endpoint key later if needed
      const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: JSON.stringify({ email: userEmail, message: userMessage })
      })

      if (response.ok) {
        setSuccess(true)
        formRef.current.reset()
        setTimeout(() => setSuccess(false), 4000)
      }
    } catch (error) {
      console.error("Form error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className='bg-slate-200 border-t border-slate-300 text-slate-700 mt-10'>
      <div className='container mx-auto px-4 py-10'>
        
        {/* Footer Grid System */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between border-b border-slate-300 pb-8'>
          
          {/* Column 1: Brand & Logo */}
          <div className='flex flex-col items-center md:items-start gap-3'>
            <div className='w-[120px] h-[60px] flex items-center justify-center'>
              <img 
                src="/logo.png" 
                alt="PASOWETO Logo" 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            <p className='text-sm text-center md:text-left text-slate-500 max-w-[250px]'>
              Your premier online destination for premium apparel and quality goods.
            </p>
          </div>

          {/* Column 2: Customer Care Information */}
          <div className='flex flex-col items-center md:items-start gap-2'>
            <h3 className='font-bold text-slate-800 text-base mb-1'>Customer Care</h3>
            
            <p className='text-sm flex items-center gap-1.5'>
              <span className='font-semibold text-slate-800'>Hotline:</span> 
              <a href="tel:0978929780" className='hover:text-green-600 transition-colors'>0978929780</a>
            </p>
            
            <p className='text-sm flex items-center gap-1.5'>
              <span className='font-semibold text-slate-800'>Email:</span> 
              <a href="mailto:babylilmiah@gmail.com" className='hover:text-green-600 transition-colors break-all'>babylilmiah@gmail.com</a>
            </p>
            
            <p className='text-xs text-slate-500 mt-1 text-center md:text-left'>
              Available: 24/7
            </p>
          </div>

          {/* Column 3: Quick Direct Mail Form */}
          <div className='flex flex-col items-center md:items-start w-full gap-2'>
            <h3 className='font-bold text-slate-800 text-base mb-1'>Send Us a Message</h3>
            <form ref={formRef} onSubmit={handleSendEmail} className='w-full max-w-sm flex flex-col gap-2'>
              <input 
                type="email" 
                name="user_email"
                required 
                placeholder="Your email address" 
                className='w-full px-3 py-1.5 rounded bg-white text-sm outline-none border border-slate-300 focus:border-green-600'
              />
              <textarea 
                name="message"
                required
                rows="2"
                placeholder="Type your message here..." 
                className='w-full px-3 py-1.5 rounded bg-white text-sm outline-none border border-slate-300 focus:border-green-600 resize-none'
              />
              <button 
                type="submit" 
                disabled={loading}
                className='w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-1.5 rounded transition-colors disabled:bg-slate-400'
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {success && (
                <span className='text-xs text-green-600 font-medium text-center md:text-left animate-fade-in'>
                  ✓ Message sent successfully!
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className='pt-6 flex flex-col items-center justify-center gap-2'>
          <p className='text-center text-xs font-semibold text-slate-500'>
            &copy; {new Date().getFullYear()} PASOWETO. All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  )
}

export default Footer