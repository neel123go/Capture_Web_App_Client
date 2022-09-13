import React from 'react';
import { urlFor } from '../client';

export const Pin = ({ pin: { postedBy, image, _id, destination } }) => {
    return (
        <div>
            <img className='rounded-lg w-full' src={urlFor(image).width(250).url()} alt="user-post" />
        </div>
    );
};