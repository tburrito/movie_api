import React from 'react'

const MoviePopup = ({isOpen, onClose, children}) => {
  return (
    <div className='fixed inset-0 bg-black/50 z-100 flex w-full h-full justify-center align-middle items-center' onClick={onClose}>
      <div className="flex justify-center align-middle items-center  h-fit w-fit" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default MoviePopup