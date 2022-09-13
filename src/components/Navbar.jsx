import React from 'react';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';


export const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate();

    return (
        <div className="navbar gap-2 md:gap-5 w-full mt-5 pb-7 px-2">
            <div className="flex-1">
                <div className='flex justify-center items-center w-full px-3 py-1 rounded-full bg-base-100 border-none outline-none'>
                    <IoMdSearch fontSize={21} className="ml-3" />
                    <input
                        type="text"
                        className="p-2 w-full bg-base-100 outline-none placeholder:text-zinc-500"
                        placeholder='Search all images'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        onFocus={() => navigate('/search')}
                    />
                </div>
            </div>
            <div className="flex-none">
                <div className='flex gap-3 w-full justify-end items-center'>
                    <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                        <img src={user?.image} alt="user" className='w-10 rounded-full' />
                    </Link>
                    <Link to='/create-pin' className="border border-secondary text-secondary p-1.5 rounded-full flex justify-center items-center">
                        <IoMdAdd fontSize={25} />
                    </Link>
                </div>
            </div>
        </div>
    );
};