import React, { useState} from 'react';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import { CheckCircleIcon } from '@heroicons/react/16/solid';

export const Profile = ({}) => {

    const [ title, setTitle]  = useState();
    const [ caption, setCaption ] = useState();

    const [ isEditedTitle, setIsEditedTitle ] = useState(false);
    const [ isEditedCaption, setIsEditedCaption ] = useState(false);

    const handleEditTitle = () => {
        setIsEditedTitle(true);
    }

    const handleEditCaption = () => {
        setIsEditedCaption(true);
    }

    const handleCaptionChange = (event: any) => {
        setCaption(event.target.value);
    }

    const handleTitleChange = (event: any) => {
        setTitle(event.target.value);
    }

    const handleSaveCaption = () => {
        setIsEditedCaption(false);
        console.log('saved capt', caption);
    }

    const handleSaveTitle = () => {
        setIsEditedTitle(false);
        console.log('saved title: ', title);
    }

    return (<>
        <div className='flex justify-center items-center w-full py-8'>
            <div className='flex flex-col items-start mr-4'>
                <div className='flex items-center mb-2'>
                    {isEditedTitle ? (
                        <input
                        type='text'
                        value={title}
                        onChange={handleTitleChange}
                        autoFocus
                        className='text-2xl font-extrabold py-1 px-2 border-b-2 border-white bg-transparent focus:outline-none text-white'
                        />
                    ) : (
                        <h1 className='font-extrabold text-2xl py-1 text-white'>{title ?? 'Write Something'}</h1>
                    )}

                    {isEditedTitle ? (
                        <button onClick={handleSaveTitle} className='text-xl bg-clip-text bg-transparent text-white py-1 px-2 rounded focus:outline-none'>
                            <CheckCircleIcon className='size-5'/>
                        </button>
                    ) : (
                        <button onClick={handleEditTitle} className='text-sm bg-clip-text text-white ms-2'>
                            <PencilSquareIcon className='size-5'/>
                        </button>
                    )}
                </div>
             
                <div className='flex items-center'>
                    {isEditedCaption ? (
                        <input type='text'
                        value={caption}
                        onChange={handleCaptionChange}
                        autoFocus
                        className='text-2xl font-extrabold py-1 px-2 border-b-2 border-white bg-transparent focus:outline-none text-white'
                        />
                    ) : (
                        <p className='text-1xl font-medium text-white'>{caption ?? 'Write Any Caption'}</p>
                    )}

                    {isEditedCaption ? (
                    <button onClick={handleSaveCaption} className='text-xl bg-clip-text bg-transparent text-white py-1 px-2 rounded focus:outline-none'>
                        <CheckCircleIcon className='size-5'/>
                    </button>
                    ) : (
                        <button onClick={handleEditCaption} className='text-sm bg-clip-text text-white ms-2'>
                            <PencilSquareIcon className='size-5'/>
                        </button>
                    )}
                </div>
            </div>
          
            <img
            src="https://placehold.co/90x90"
            width="90"
            height="90"
            className='rounded-[30px] shadow-md'
            />
        </div>
    </>)
}

export default Profile;