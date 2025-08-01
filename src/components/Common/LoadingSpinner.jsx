import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <div className="absolute top-0 left-0 animate-spin rounded-full h-12 w-12 border-r-2 border-primary-300 animate-pulse"></div>
      </div>
    </div>
  )
}

export default LoadingSpinner