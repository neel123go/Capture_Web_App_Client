import React, { useState } from 'react';
import { client, urlFor } from '../client';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../Firebase.init';


export const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [user] = useAuthState(auth);
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    const navigate = useNavigate();

    const savePin = (id) => {
        setSavingPost(true);

        client
            .patch(id)
            .setIfMissing({ save: [] })
            .insert('after', 'save[-1]', [{
                _key: uuidv4(),
                userId: user?.uid,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user?.uid
                }
            }])
            .commit()
            .then(() => {
                window.location.reload();
                setSavingPost(false);
            });
    };

    return (
        <div className='m-2 my-4 md:my-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-details/${_id}`)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <img className='rounded-lg w-full' src={urlFor(image).width(250).url()} alt="user-post" />
                {postHovered && (
                    <div
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
                        style={{ height: '100%' }}
                    >
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-2'>
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-9 h-9 flex justify-center items-center rounded-full bg-white text-secondary opacity-80 hover:opacity-100 hover:shadow-md mx-2 mt-1"
                                >
                                    <MdDownloadForOffline fontSize={23} />
                                </a>
                            </div>
                            {user && <button
                                type='button'
                                className='bg-red-500 rounded-full text-white font-bold px-4 py-1 opacity-80 hover:opacity-100 mx-1'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(_id);
                                }}
                            >{savingPost ? 'Saving..' : 'Save'}</button>}
                        </div>

                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a
                                    href={destination}
                                    target="_blank"
                                    rel="noreferrer"
                                    className='bg-white flex items-center gap-2 text-secondary font-bold py-1 px-2 rounded-full opacity-80 hover:opacity-100 hover:shadow-md mx-2'
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    <p className='text-sm'>{destination.slice(0, 10) + '..'}</p>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {postedBy ? <Link to={`user-profile/${postedBy?._id}`} className="flex mt-2 gap-2 items-center">
                <img src={postedBy?.image} className='w-8 h-8 rounded-full object-cover' alt="user-profile" />
                <p className='text-primary'>{postedBy?.userName}</p>
            </Link> : ''}
        </div>
    );
};