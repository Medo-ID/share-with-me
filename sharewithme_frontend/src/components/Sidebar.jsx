import React from 'react'
import {NavLink, Link} from 'react-router-dom'
import {RiHomeGearFill} from 'react-icons/ri'
import { MdCategory } from 'react-icons/md'
import{IoIosArrowForward} from 'react-icons/io'

import logo from '../assets/logo.png'
import { categories } from '../utils/data'

function Sidebar({user, closeToggle}) {
    const handleCloseSidebar = () => {
        if(closeToggle) closeToggle(false)
    }

    const activeStyle = 'flex items-center px-4 gap-3 text-sm text-mainOrange font-bold border-r-4 border-mainOrange transition-all duration-100 ease-in-out capitalize'
    const notActiveStyle = 'flex items-center px-4 gap-3 text-sm text-gray-600 hover:text-bold transition-all duration-100 ease-in-out capitalize'
    
    return (
        <div className='flex flex-col justify-between border-r border-gray-500 h-full overflow-y-scrikk min-w-210 hide-scrollbar'>
            <div className='flex flex-col'>
                <Link 
                    to='/'
                    className='flex px-4 gap-2 my-4 py-1 w-190 items-center'
                    onClick={handleCloseSidebar}
                >
                    <img src={logo} alt='share with me logo' className='w-full' />
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink
                        to='/'
                        className={({isActive}) => isActive ? activeStyle : notActiveStyle} style={{fontSize: '16px', fontWeight: 'bold'}}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeGearFill />
                        Home
                    </NavLink>
                    <h4 className={notActiveStyle} style={{fontSize: '16px', fontWeight: 'bold'}}
                    >
                        <MdCategory />
                        Discover Categories
                    </h4>
                    {categories.slice(0, categories.length - 1).map((category) => (
                        <NavLink
                            to={`/category/${category.name}`}
                            key={category.name}
                            className={({isActive}) => isActive ? activeStyle : notActiveStyle}
                            onClick={handleCloseSidebar}
                        >
                            <img 
                                src={category.image}
                                alt='categoryImage'
                                className='w-8 h-8 rounded-full shadow-sm '
                            />
                            {category.name}
                        </NavLink>
                    ))}
                </div>
            </div>
            {user && (
                <Link
                    to={`user-profile/${user?._id}`}
                    className='flex my-5 mb-3 gap-2 p-2 items-center rounded-lg shadow-lg mx-3 text-sm font-semibold'
                    onClick={handleCloseSidebar}
                >
                    <img src={user?.image} alt="User PictureProfile" className='w-10 h-10 rounded-full' />
                    <p>{user.userName}</p>
                    <IoIosArrowForward />
                </Link>
            )}
        </div>
    )
}

export default Sidebar