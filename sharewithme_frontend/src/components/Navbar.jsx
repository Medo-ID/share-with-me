import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'

function Navbar({searchTerm, setSearchTerm, user}) {
  const navigate = useNavigate()

  if(!user) return null

  return (
    <div className='sticky top-0 flex gap-2 md:gap-5 w-full my-5 bg-bgColor'>
      <div className='flex justify-start items-center w-full px-2 rounded-md shadow-sm outline-none focus-within:shadow-md'>
        <IoMdSearch fontSize={21} className='mr-2 rounded-full bg-black text-white p-2 w-8 h-8'/>
        <input 
          type='text'
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder='Search'
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='w-full outline-none rounded-md text-sm font-semibold text-dark bg-bgColor'
        />
      </div>
      <div className='sticky top-0 flex gap-3'>
        <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
          <img src={user.image} alt='userImage' className='w-14 h-12 rounded-lg'/>
        </Link>
        <Link to='create-pin' className='bg-black text-white text-lg font-bold rounded-lg w-14 h-12 md:w-14 md:h-12 flex justify-center items-center'>
          <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar