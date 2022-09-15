import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import { MasonryLayout } from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import { Spinner } from './Spinner';
import { Link, useParams } from 'react-router-dom';

export const PinDetails = ({ user }) => {
    const { pinId } = useParams();
    const [pins, setPins] = useState();
    const [pinDetail, setPinDetail] = useState();
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId);

        if (query) {
            client.fetch(query)
                .then((data) => {
                    setPinDetail(data[0]);

                    if (data[0]) {
                        query = pinDetailMorePinQuery(data[0]);

                        client.fetch(query)
                            .then((res) => {
                                setPins(res);
                            });
                    }
                });
        }
    };

    useEffect(() => {
        fetchPinDetails()
    }, [pinId]);

    const addComment = () => {
        if (comment) {
            setAddingComment(true);

            client
                .patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{
                    comment,
                    _key: uuidv4(),
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user?._id
                    }
                }])
                .commit()
                .then(() => {
                    fetchPinDetails();
                    setComment('');
                    setAddingComment(false);
                });
        }
    };

    if (!pinDetail) {
        return (
            <Spinner message="Loading Image..." />
        );
    };

    return (
        <>
            <div className="px-2 flex xl:flex-row flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
                <div className="flex justify-center items-center md:items-start flex-initial">
                    <img
                        className="rounded-lg"
                        src={pinDetail?.image && urlFor(pinDetail?.image).url()}
                        alt="user-post"
                    />
                </div>

                <div className="w-full py-5 flex-1 xl:min-w-620">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <a
                                href={`${pinDetail?.image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="w-9 h-9 flex justify-center items-center rounded-full bg-secondary text-white opacity-80 hover:opacity-100 hover:shadow-md"
                            >
                                <MdDownloadForOffline />
                            </a>
                        </div>
                        <a className='bg-secondary text-white rounded-full px-3 py-1 opacity-80 hover:opacity-100 hover:shadow-md' href={pinDetail?.destination} target="_blank" rel="noreferrer">
                            {pinDetail?.destination?.slice(0, 20)}
                        </a>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold break-words mt-3">
                            {pinDetail?.title}
                        </h1>
                        <p className="mt-3">{pinDetail?.about}</p>
                    </div>
                    <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
                        <img src={pinDetail?.postedBy?.image} className="w-10 h-10 rounded-full" alt="user-profile" />
                        <p className="font-bold">{pinDetail?.postedBy?.userName}</p>
                    </Link>

                    <h2 className="mt-5 text-xl">Comments</h2>
                    <div className="max-h-370 overflow-y-auto">
                        {pinDetail?.comments?.map((comment, i) => (
                            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
                                <img
                                    src={comment?.postedBy?.image}
                                    className="w-9 h-9 rounded-md cursor-pointer"
                                    alt="user-profile"
                                />
                                <div className="flex flex-col">
                                    <p className="text-sm">{comment?.postedBy?.userName}</p>
                                    <p className='text-[16px]'>{comment?.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap mt-10 gap-2">
                        <Link to={`/user-profile/${user?._id}`}>
                            <img src={user?.image} className="w-8 h-8 rounded-full cursor-pointer" alt="user-profile" />
                        </Link>
                        <input
                            className="flex-1 border-b-2 border-red-400 placeholder:text-zinc-500 outline-none p-1"
                            type="text"
                            placeholder="Add a comment"
                            value={comment}
                            onChange={(e) => setComment(e?.target?.value)}
                        />
                        <button
                            type="button"
                            className="bg-red-500 text-white rounded-full mt-2 px-4 py-1 text-sm outline-none"
                            onClick={addComment}
                        >
                            {addingComment ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
            {pins?.length > 0 ? (
                <>
                    <h2 className='text-center font-bold text-2xl mt-8 mb-4'>More like this</h2>
                    <MasonryLayout pins={pins} />
                </>
            ) : (
                <Spinner message="Loading more pins.." />
            )}
        </>
    )
}
