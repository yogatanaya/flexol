import React from 'react';

export const Profile = ({}) => {
    return (<>
        <div className='flex items-center space-x-4 ms-8'>
            <div>
                <h1 className='font-extrabold text-2xl py-1 text-white'>@username</h1>
                <p className='text-1xl font-medium text-white'>Exploring Web3</p>
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