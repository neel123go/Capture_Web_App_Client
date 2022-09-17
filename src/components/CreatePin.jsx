import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { client } from '../client';
import { categories } from '../utils/data';

export const CreatePin = ({ user }) => {
    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [destination, setDestination] = useState('');
    const [loading, setLoading] = useState(false);
    const [fields, setFields] = useState(false);
    const [category, setCategory] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [wrongImageType, setWrongImageType] = useState(false);

    const navigate = useNavigate();

    const upLoadImage = (e) => {
        const { type, name } = e.target.files[0];
        if (type === 'image/png' || type === 'image/jpg' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
            setWrongImageType(false);
            setLoading(true);

            client.assets
                .upload('image', e.target.files[0], { contentType: type, filename: name })
                .then((document) => {
                    setImageAsset(document);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Image upload error', error);
                })
        } else {
            setWrongImageType(true);

        }
    };

    const savePin = () => {
        if (title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
            };
            client.create(doc).then(() => {
                navigate('/');
            });
        } else {
            setFields(true);

            setTimeout(
                () => {
                    setFields(false);
                },
                2000,
            );
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5 px-2'>
            {fields && (
                <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill up all the fields</p>
            )}
            <div className='flex lg:flex-row flex-col justify-center items-center lg:p-5 w-full lg:gap-0 gap-5'>
                <div className='bg-base-100 p-3 flex flex-0.7 w-full lg:w-1/2'>
                    <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-500 p-3 w-full h-80 md:h-[420px]'>
                        {loading && <button className="pt-20 font-bold text-secondary">Loading..</button>}
                        {wrongImageType && <p>Wrong image type</p>}
                        {
                            !imageAsset ? (
                                <label>
                                    <div className='flex flex-col items-center justify-center h-full py-10'>
                                        <div className='flex flex-col justify-center items-center'>
                                            <p className='font-bold text-2xl'>
                                                <AiOutlineCloudUpload fontSize={80} />
                                            </p>
                                            <p>Click to upload</p>
                                        </div>
                                        <p className='mt-16 text-sm text-neutral text-center'>
                                            Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20 MB
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        name="upload-image"
                                        onChange={upLoadImage}
                                        className="w-0 h-0"
                                    />
                                </label>
                            ) : (
                                <div className='relative h-full'>
                                    <img src={imageAsset?.url} alt="uploaded-pic" className='h-full w-full' />
                                    <button
                                        type="button"
                                        className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all ease-in-out duration-500'
                                        onClick={() => setImageAsset(null)}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className='flex flex-1 flex-col gap-7  lg:pl-16 mt-5 w-full lg:w-1/2'>
                    <div>
                        <label className='block text-lg mb-2'>Image Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e?.target?.value)}
                            placeholder="Add image title here"
                            className='outline-none text-base placeholder:text-zinc-500 text-zinc-700 bg-transparent sm:text-lg border-b-2 w-full border-secondary'
                        />
                    </div>

                    <div>
                        <label className='text-lg block mb-2'>About</label>
                        <input
                            type="text"
                            value={about}
                            onChange={(e) => setAbout(e?.target?.value)}
                            placeholder="What is your image about"
                            className='outline-none text-base w-full placeholder:text-zinc-500 text-zinc-700 bg-transparent sm:text-lg border-b-2 border-secondary'
                        />
                    </div>

                    <div>
                        <label className='text-lg block mb-2'>Image Destination</label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e?.target?.value)}
                            placeholder="Add a destination link"
                            className='outline-none text-base placeholder:text-zinc-500 text-zinc-700 bg-transparent sm:text-lg border-b-2 w-full border-secondary'
                        />
                    </div>

                    <div className='flex flex-col'>
                        <div>
                            <label className='text-lg block mb-2'>Choose Image Category</label>
                            <select
                                onChange={(e) => setCategory(e?.target?.value)}
                                className="outline-none w-full text-base border-b-2 border-gray-200 p-2  rounded-md cursor-pointer bg-red-200"
                            >
                                <option value="other" className='bg-white'>Select Category</option>
                                {categories?.map((category) => (
                                    <option className='bg-white my-3 text-base border-0 outline-none capitalize text-black' value={category?.name}>{category?.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex justify-end items-end mt-5'>
                            <button
                                type="button"
                                onClick={savePin}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded-full w-full my-2 outline-none"
                            >
                                Save Image
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
