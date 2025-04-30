import React from 'react'

export default function Wrapper({ children }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0'
    }}>
      {children}
    </div>
  )
} 