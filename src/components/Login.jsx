import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import auth from '../Firebase.init';
import { useSignInWithEmailAndPassword, useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginImg from '../assets/login.png';
import SocialLogin from './SocialLogin';
import { client } from '../client';

export const Login = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);
    // const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);
    let errorMessage;
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const emailRef = useRef('');

    const onSubmit = async (data) => {
        await signInWithEmailAndPassword(data?.email, data?.password);
    };

    console.log(emailRef?.current?.value)

    // Navigate user
    useEffect(() => {
        if (user) {
            const { uid, displayName, photoURL } = user?.user;
            const doc = {
                _id: uid,
                _type: 'user',
                userName: displayName,
                image: (photoURL == null ? 'https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg' : photoURL)
            };
            if (doc.userName) {
                client.createIfNotExists(doc)
                    .then(() => {
                        navigate(from, { replace: true });
                    })
            }
        }
    }, [user, from, navigate]);

    if (error) {
        errorMessage = <p className='text-error text-center mb-5'>{error?.message}</p>
    }

    // Handle Loading
    if (loading) {
        // return <Loading />;
    }


    return (
        <div className='bg-base-100 min-h-screen grid lg:grid-cols-2 grid-cols-1 items-center lg:px-20 px-6'>
            <div className="md:w-3/4 w-full mx-auto text-neutral lg:order-1 order-2 lg:mt-0 mt-8">
                <h1 className='text-3xl mb-2'>Please Login</h1>
                <span className='w-52 h-1 bg-secondary block lg:mb-16 mb-10'></span>
                {errorMessage}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <span className="label-text text-xl text-neutral mb-3">Email</span>

                        <input
                            type="text"
                            placeholder="example@your.com"
                            id="email"
                            ref={emailRef}
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: 'Email address is required'
                                },
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: 'Provide a valid email'
                                }
                            })}
                            autoComplete='off'
                            className="bg-transparent border-b-2 border-neutral placeholder:text-slate-500 pb-1 outline-none" />
                        <label className="mt-1">
                            {errors.email?.type === 'required' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.email.message}</span>}
                            {errors.email?.type === 'pattern' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.email.message}</span>}
                        </label>


                    </div>
                    <div className="form-control">
                        <span className="label-text text-xl text-neutral mt-5 mb-3">Password</span>
                        <input
                            type="password"
                            placeholder="password123"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: 'Password is required'
                                },
                                minLength: {
                                    value: 8,
                                    message: 'Password must be contain at least 8 characters'
                                }
                            })}
                            autoComplete='off'
                            className="bg-transparent border-b-2 border-neutral placeholder:text-slate-500 pb-1 outline-none" />
                        <label className="mt-1">
                            {errors.password?.type === 'required' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.password.message}</span>}
                            {errors.password?.type === 'minLength' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.password.message}</span>}
                        </label>
                    </div>
                    <div className="form-control lg:mt-16 mt-8">
                        <button className="btn btn-secondary hover:bg-neutral hover:border-none">Login</button>
                    </div>
                </form>
                <SocialLogin />
                <div className='flex flex-wrap justify-between my-5'>
                    <p className='text-center text-lg'>Don't have any account? <Link to='/registration' className='text-secondary'>Sign Up</Link></p>
                    <p className='text-md text-secondary cursor-pointer'
                    >Forgot Password?</p>
                </div>
            </div>
            <div className='md:p-8 p-0 w-full mx-auto lg:order-2 order-1'>
                <img src={LoginImg} alt="" />
            </div>
        </div>
    );
};