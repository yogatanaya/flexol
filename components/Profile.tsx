"use client"
import React, { useEffect, useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { CheckCircleIcon } from '@heroicons/react/16/solid';

import { db } from '../app/firebaseConfig';
import { collection, addDoc, query, getDoc, where, getDocs, doc } from 'firebase/firestore';

import Swal from 'sweetalert2';

import { fetchProfileData } from '@/app/firebaseUtils';

export const Profile = ({ paramWalletAddress }) => {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (paramWalletAddress) 
        {
            setLoading(true);

            fetchProfileData(paramWalletAddress)
                .then((profileData) => {
                    if (profileData) 
                    {
                        setTitle(profileData.title)
                        setCaption(profileData.caption)
                    }
                    setLoading(false)
                })
        }
    }, [paramWalletAddress])

    const addTitleAndDescription = async (titleParam: string, captionParam: string) => {

        if (!paramWalletAddress) 
        {
            console.log('No Wallet Address found!');
            Swal.fire({
                text: 'Please select your Wallet address first',
                icon: 'warning'
            });

            return;
        }
    
        
        try 
        {
            const docRef = await addDoc(collection(db, "profiles"), {
                title: titleParam,
                caption: captionParam,
                wallet_address: paramWalletAddress
            });
    
            console.log('Document Writen with ID: ', docRef.id);
    
            Swal.fire({
                text: 'Profile Title & Caption is successfully saved!',
                icon: 'success',
                confirmButtonText: 'Okay'
            });
    
        } catch (error)
        {
            Swal.fire({
                text: 'Oops! Something went wrong', 
                icon: 'error',  
                confirmButtonText: 'Okay'
            });
            
            console.log("error", error);
            return false;
        }
        finally 
        {
            setLoading(false);
        }
        
    } 

    // Function to handle title change
    const handleTitleChange = (e:any) => {
        setTitle(e.target.value); // Update the state for title
    };

    // Function to handle caption change
    const handleCaptionChange = (e:any) => {
        setCaption(e.target.value); // Update the state for caption
    };

    const handleCaptionKeypress = async (e: any) => {
        if (e.key == "Enter" && title && caption) 
        {
            e.preventDefault();
            await addTitleAndDescription(title, caption);
            setTitle('');
            setCaption('');
        }
    }

    return (
        <>
            <div className='flex'>
                <div className='flex flex-col items-start m-3'>
                </div>
                <div className='flex flex-col items-start mr-4'>
                    <div className='flex items-center mb-2'>
                        <input
                            placeholder='Name your Flexol'
                            type='text'
                            value={loading ? "Please Wait..." : title}
                            onChange={handleTitleChange} // Set title on change
                            autoFocus
                            className='text-4xl font-extrabold py-1 px-2 border-white bg-transparent focus:outline-none text-white'
                        />
                    </div>

                    <div className='flex items-center'>
                        <input
                            id='captionInput'
                            type='text'
                            placeholder='Add description'
                            value={loading ? "Please Wait..." : caption}
                            onKeyDown={handleCaptionKeypress}
                            onChange={handleCaptionChange} // Set caption on change
                            className='text-xl py-1 px-2 border-white bg-transparent focus:outline-none text-white'
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
