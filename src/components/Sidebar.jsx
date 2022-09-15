import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';

import Logo from '../assets/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle = 'flex items-center px-8 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-8 gap-3 border-r-4 border-secondary text-secondary transition-all duration-200 ease-in-out capitalize';


export const Sidebar = ({ user, closeToggle }) => {
    const handleCloseSidebar = () => {
        if (closeToggle) {
            closeToggle(false);
        };
    };

    return (
        <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll  border-r-2 border-slate-300 min-w-40 hide-scrollbar'>
            <div className='flex flex-col'>
                <Link
                    to='/'
                    className='flex px-5 gap-2 my-6 pt-1 w-[200px] items-center'
                    onClick={handleCloseSidebar}
                >
                    <img src={Logo} alt="logo" className='w-full' />
                </Link>
                <div className='flex flex-col gap-5'>
                    <NavLink
                        to='/'
                        className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                        onClick={handleCloseSidebar}
                    >
                        <RiHomeFill />
                        Home
                    </NavLink>
                    <h3 className='px-8 pt-8 2xl:text-xl'>Discover Categories</h3>
                    {
                        categories?.slice(0, categories?.length - 1).map((category) => (

                            <NavLink
                                to={`/category/${category?.name}`}
                                className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
                                onClick={handleCloseSidebar}
                                key={category?.name}
                            >
                                <img src={category?.image} className="w-8 h-8 rounded-full shadow-sm" />
                                {category?.name}
                            </NavLink>
                        ))
                    }
                </div>
            </div>
            {user && (
                <Link
                    to={`user-profile/${user?._id}`}
                    className="flex my-5 mb-3 gap-2 p-3 items-center rounded-lg mx-3"
                >
                    <img src={user?.image} className="w-9 h-9 rounded-full" alt="user-profile" />
                    <p>{user?.userName}</p>
                </Link>
            )}
        </div>
    );
};