import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import { MasonryLayout } from './MasonryLayout';
import { Spinner } from './Spinner';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../Firebase.init';
import { signOut } from 'firebase/auth';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-32 outline-none';
const notActiveBtnStyles = 'bg-primary mx-4 text-white font-bold p-2 rounded-full w-24 outline-none';

export const UserProfile = () => {
    const [user, setUser] = useState([]);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const { userId } = useParams();
    const [firebaseUser] = useAuthState(auth);

    useEffect(() => {
        const query = userQuery(userId);
        client.fetch(query)
            .then((data) => {
                setUser(data[0]);
            });
    }, [userId]);

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId);

            client?.fetch(createdPinsQuery)
                .then((data) => {
                    setPins(data);
                });
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);

            client?.fetch(savedPinsQuery)
                .then((data) => {
                    setPins(data);
                });
        }
    }, [text, userId]);

    // Handle SignOut
    const handleLogout = () => {
        signOut(auth);
    }

    if (!user) return <div className='flex justify-center items-center h-full w-full'>
        <Spinner message="Loading profile" />
    </div>;

    return (
        <div className="relative pb-2 h-full justify-center items-center">
            <div className="flex flex-col pb-5">
                <div className="relative flex flex-col mb-7">
                    <div className="flex flex-col justify-center items-center">
                        <img
                            className=" w-full h-[370px] 2xl:h-510 shadow-lg object-cover"
                            src="https://source.unsplash.com/1600x900/?nature,photography,technology"
                            alt="user-pic"
                        />
                        <img
                            className="rounded-full w-26 h-26 md:w-32 md:h-32 -mt-10 shadow-xl object-cover"
                            src={user?.image}
                            alt="user-pic"
                        />
                    </div>
                    <h1 className="font-bold text-3xl text-center mt-3">
                        {user?.userName}
                    </h1>

                    <div className="absolute top-0 z-1 right-0 p-2">
                        {userId === firebaseUser?.uid && (

                            <button className='mr-3 mt-3 bg-white rounded-full cursor-pointer w-10 h-10 flex justify-center items-center' onClick={handleLogout}>
                                <AiOutlineLogout className=' text-red-500' fontSize={23} />
                            </button>

                        )}
                    </div>
                </div>

                <div className="text-center mb-7">
                    <button
                        type="button"
                        onClick={(e) => {
                            setText(e?.target?.textContent);
                            setActiveBtn('created');
                        }}
                        className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                    >
                        Created
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            setText(e?.target?.textContent);
                            setActiveBtn('saved');
                        }}
                        className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                    >
                        Saved
                    </button>
                </div>

                <div className="px-2">
                    <MasonryLayout pins={pins} />
                </div>

                {pins?.length === 0 && (
                    <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
                        No Pins Found!
                    </div>
                )}

            </div>
        </div>
    )
}