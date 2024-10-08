'use client'

import { useState } from 'react';

function AnimatedDiv() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex justify-around items-center">
      <div className={` h-60 w-4/12 transition-all duration-500 ${isOpen ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        <div className='w-full bg-red-600 h-full'>

        </div>
      </div>
      <div className='bg-blue-600 h-60 w-4/12 flex justify-center items-center'>
        <button onClick={() => setIsOpen(!isOpen)} className='bg-white py-2 px-6 rounded-sm hover:shadow-lg'>Show</button>
      </div>
      <div className='bg-green-600 h-60 w-4/12'></div>
    </div>
  );
}

export default AnimatedDiv;



{/* <div
className={`
  mt-4 transform transition-all duration-500 
  ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
`}
>
<div className="p-4 bg-green-500 text-white rounded-lg">
  I am an animated div!
</div>
</div> */}