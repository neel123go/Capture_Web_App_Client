import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../Firebase.init';


export const Navbar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate();
    const [firebaseUser] = useAuthState(auth);

    console.log(firebaseUser);

    return (
        <div className="navbar gap-2 md:gap-5 w-full mt-5 pb-3 px-2">
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
                    {firebaseUser ? <Link to={`user-profile/${user?._id}`} className="hidden md:block">
                        <img src={user?.image} alt="user" className='w-10 rounded-full' />
                    </Link> : <Link to='/login'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-11 h-11 text-zinc-700">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Link>}
                    <Link to='/create-pin' className="border border-secondary text-secondary p-1.5 rounded-full flex justify-center items-center">
                        <IoMdAdd fontSize={25} />
                    </Link>
                </div>
            </div>
        </div>
    );
};