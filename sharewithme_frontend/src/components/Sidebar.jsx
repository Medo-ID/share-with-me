import React from 'react'
import {NavLink, Link} from 'react-router-dom'
import {RiHomeFill} from 'react-icons/ri'
import{IoIosArrowForward} from 'react-icons/io'

import logo from '../assets/logo.png'

function Sidebar({user, closeToggle}) {
    const handleCloseSidebar = () => {
        if(closeToggle) closeToggle(false)
    }

    const activeStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize'
    const notActiveStyle = 'flex items-center px-5 gap-3 text-grey-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
    
    const categories = [
        {name: 'Animals'},
        {name: 'Wallpappers'},
        {name: 'Photography'},
        {name: 'Gaming'},
        {name: 'Science'},
        {name: 'Tech'},
        {name: 'Other'}
    ]
    
    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scrikk min-w-210 hide-scrollbar'>
            <div className='flex flex-col'>
                <Link 
                    to='/'
                    className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
                    onClick={handleCloseSidebar}
                >
                    <img src={logo} alt='share with me logo' className='w-full' />
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink
                        to='/'
                        className={({isActive}) => isActive ? activeStyle : notActiveStyle}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className='m-2 px-5 text-base 2xl:text-xl'>Discover Categories</h3>
                    {categories.slice(0, categories.length - 1).map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            key={category.name}
                            className={({isActive}) => isActive ? activeStyle : notActiveStyle}
                            onClick={handleCloseSidebar}
                        >
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>
            {user && (
                <Link
                    to={`user-profile/${user?._id}`}
                    className='flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
                    onClick={handleCloseSidebar}
                >
                    <img src={user?.image} alt="User PictureProfile" className='w-10 h-10 rounded-full' />
                    <p>{user.userName}</p>
                </Link>
            )}
        </div>
    )
}

export default Sidebar