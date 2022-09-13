import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Routes, Route } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';
import { userQuery } from '../utils/data.js';
import { UserProfile } from '../components/UserProfile';
import { client } from '../client';
import Logo from '../assets/logo.png';
import { Pins } from './Pins';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../Firebase.init';

export const Home = () => {
    const [user] = useAuthState(auth);
    const [sanityUser, setSanityUser] = useState(null)
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const query = userQuery(user?.uid);
        client.fetch(query)
            .then((data) => {
                setSanityUser(data[0]);
            })

    }, [user]);

    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
    }, []);

    return (
        <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
            <div className='hidden md:flex h-screen flex-initial'>
                <Sidebar user={sanityUser && sanityUser} />
            </div>
            <div className='flex md:hidden flex-row'>
                <div className='p-4 w-full flex flex-row justify-between items-center shadow-md'>
                    <HiMenu fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
                    <Link to='/'>
                        <img src={Logo} alt="Logo" className='w-40' />
                    </Link>
                    <Link to={`user-profile/${sanityUser?._id}`}>
                        <img src={sanityUser?.image} alt="Logo" className='w-10 rounded-full' />
                    </Link>
                </div>
                {
                    toggleSidebar && (
                        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
                            <div className='absolute w-full flex justify-end items-center p-2'>
                                <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
                            </div>
                            <Sidebar user={sanityUser && sanityUser} closeToggle={setToggleSidebar} />
                        </div>
                    )
                }
            </div>


            <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
                <Routes>
                    <Route path='/user-profile/:userId' element={<UserProfile />} />
                    <Route path='/*' element={<Pins user={sanityUser && sanityUser} />} />
                </Routes>
            </div>
        </div>
    );
};