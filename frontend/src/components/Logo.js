import React from 'react'

const Logo = ({ w, h, className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="PASOWETO Logo" 
        style={{ width: w, height: h }}
        className="h-full w-auto object-contain max-h-full" 
      />
    </div>
  )
}

export default Logo