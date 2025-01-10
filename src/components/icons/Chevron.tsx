import React from 'react'

interface ChevronIconProps {
  className?: string;
}

export default function ChevronIcon({ className = '' }: ChevronIconProps) {
  return (
    <svg 
      className={className}
      width="19" 
      height="19" 
      viewBox="0 0 19 19" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M7.125 14.25L11.875 9.5L7.125 4.75" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}
