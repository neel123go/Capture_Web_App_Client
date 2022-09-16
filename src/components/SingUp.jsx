import React, { useEffect } from 'react'
import { useCreateUserWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../Firebase.init';
import SocialLogin from './SocialLogin';
import RegistrationImg from '../assets/registration.png';
import { client } from '../client';

export const SingUp = () => {
    const { register, formState: { errors }, handleSubmit } = useForm();
    let errorMessage;
    const [createUserWithEmailAndPassword, user, loading, hookError,] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });

    const [updateProfile, updating, updateProfileError] = useUpdateProfile(auth);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        const email = data?.email;
        await createUserWithEmailAndPassword(email, data?.password);
        await updateProfile({ displayName: data?.userName });
    };

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
    }, [user, from, navigate, updateProfile]);

    // Handle error
    if (hookError || updateProfileError) {
        errorMessage = <p className='text-error text-center'>{hookError?.message || updateProfileError?.message}</p>
    };

    // Handle loading
    if (loading || updating) {
        // return <Loading />;
    };


    return (
        <div className='bg-base-100 min-h-screen grid lg:grid-cols-2 grid-cols-1 items-center lg:px-20 px-6'>
            <div className="md:w-3/4 w-full mx-auto text-neutral lg:order-1 order-2 lg:mt-0 mt-8">
                <h1 className='text-3xl mb-2'>Registration Now</h1>
                <span className='w-52 h-1 bg-secondary block lg:mb-16 mb-10'></span>
                {errorMessage}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <span className="label-text text-xl text-neutral mb-3">User Name</span>
                        <input
                            type="text"
                            placeholder="Ayoun Paul Neel"
                            {...register("userName", {
                                required: {
                                    value: true,
                                    message: 'User name is required'
                                },
                                minLength: {
                                    value: 3,
                                    message: 'User name must be contain at least 3 characters'
                                }
                            })}
                            autoComplete='off'
                            className="bg-transparent border-b-2 border-neutral placeholder:text-slate-500 pb-1 outline-none" />
                        <label className="mt-1">
                            {errors.userName?.type === 'required' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.userName.message}</span>}
                            {errors.userName?.type === 'pattern' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.userName.message}</span>}
                        </label>


                    </div>
                    <div className="form-control">
                        <span className="label-text text-xl text-neutral mt-5 mb-3">Email</span>
                        <input
                            type="text"
                            placeholder="example@your.com"
                            id="email"
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
                            className="bg-transparent border-b-2 border-neutral pb-1 placeholder:text-slate-500 outline-none" />
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
                            className="bg-transparent border-b-2 border-neutral pb-1 placeholder:text-slate-500 outline-none" />
                        <label className="mt-1">
                            {errors.password?.type === 'required' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.password.message}</span>}
                            {errors.password?.type === 'minLength' && <span className="label-text-alt text-error" style={{ fontSize: '15px' }}>{errors.password.message}</span>}
                        </label>
                    </div>
                    <div className="form-control lg:mt-16 mt-8">
                        <button className="btn btn-secondary hover:bg-neutral hover:border-none">Registration</button>
                    </div>
                </form>
                <SocialLogin />
                <p className='text-center text-lg my-5'>Already have an account? <Link to='/login' className='text-secondary'>Login</Link></p>
            </div>
            <div className='md:p-8 p-0 w-full mx-auto lg:order-2 order-1'>
                <img src={RegistrationImg} alt="" />
            </div>
        </div>
    )
}
