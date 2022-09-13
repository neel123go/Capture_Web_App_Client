import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../Firebase.init';
import { useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { client } from '../client';

const SocialLogin = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    const location = useLocation();
    const navigate = useNavigate();
    let from = location.state?.from?.pathname || "/";
    let errorMessage;

    // // Navigate user
    useEffect(() => {
        if (user) {
            const { uid, displayName, photoURL } = user?.user;
            const doc = {
                _id: uid,
                _type: 'user',
                userName: displayName,
                image: (photoURL == null ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg' : photoURL)
            }
            client.createIfNotExists(doc)
                .then(() => {
                    navigate(from, { replace: true });
                })
            // navigate(from, { replace: true });
        }
    }, [user, from, navigate]);

    // Handle loading
    if (loading) {
        // return <SocialLoader />;
    }

    // Handle error
    if (error) {
        errorMessage = <p className='text-error text-center mb-2'>{error?.message}</p>
    }

    return (
        <div className='mt-5'>
            {errorMessage}
            <button onClick={() => signInWithGoogle()} className='btn bg-transparent text-neutral hover:bg-transparent hover:border hover:border-secondary w-full'><FcGoogle className='w-7 h-7 mr-2' /> Continue With Google</button>
        </div>
    )
}

export default SocialLogin;