import React, { useState} from 'react';

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
        <div className='flex items-center space-x-4 ms-8'>
            <div>
                
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
                        <i className='fa-solid fa-floppy-disk'></i>
                    </button>
                ) : (
                    <button onClick={handleEditTitle} className='text-sm bg-clip-text text-white'>
                        <i className='fa-solid fa-pencil'></i>
                    </button>
                )}

                <br/><br/>

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
                    <i className='fa-solid fa-floppy-disk'></i>
                </button>
                ) : (
                    <button onClick={handleEditCaption} className='text-sm bg-clip-text text-white'>
                        <i className='fa-solid fa-pencil'></i>
                    </button>
                )}


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