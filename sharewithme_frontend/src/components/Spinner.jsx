import React from 'react'
import {Triangle} from 'react-loader-spinner'

function Spinner({message}) {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
        <Triangle
            height="80"
            width="80"
            color="#00BFFF"
            ariaLabel="triangle-loading"
            wrapperStyle={{margin: "10px"}}
            wrapperClassName=""
            visible={true}
        />
        <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner