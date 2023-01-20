import React from 'react';

const IconMap =({children}) =>{
    return(
        <>
        <div>
            <span className="bg-white px-2 text-gray-500">
                <svg className="text-gray-400 group-hover:text-gray-500 mx-4 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
            </span>
        </div>
        </>
    )
}

export default IconMap;
