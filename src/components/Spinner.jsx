import React from 'react';
import { InfinitySpin } from 'react-loader-spinner';

export const Spinner = ({ message }) => {
    return (
        <div className='flex flex-col justify-center items-center mt-40'>
            <InfinitySpin
                type="circle"
                color="#FF4F5A"
                height={50}
                width={200}
                className="m-5"
            />
            <p className='text-secondary font-bold'>{message}</p>
        </div>
    );
};