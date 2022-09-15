import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import { MasonryLayout } from './MasonryLayout';
import { Spinner } from './Spinner';

export const Feed = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [pins, setPins] = useState([]);
    const { categoryId } = useParams();

    useEffect(() => {
        setIsLoading(true);
        if (categoryId) {
            const query = searchQuery(categoryId);
            client?.fetch(query)
                .then((data) => {
                    setPins(data);
                    setIsLoading(false);
                })
        } else {
            client?.fetch(feedQuery)
                .then((data) => {
                    setPins(data);
                    setIsLoading(false);
                })
        }
    }, [categoryId]);

    if (isLoading) {
        return <Spinner message="We are adding new images to your feed!" />
    }

    if (!pins?.length) {
        return <h2 className='text-2xl text-center mt-20'>No image available for this category</h2>
    }

    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    );
};