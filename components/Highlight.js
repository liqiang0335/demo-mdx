import React from 'react'

export default function Highlight({ children }) {
  return (
    <div style={{
      backgroundColor: 'yellow',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0'
    }}>
      {children}
    </div>
  )
} 