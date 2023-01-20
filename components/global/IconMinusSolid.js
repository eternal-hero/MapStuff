import React from 'react';

const IconMap =({children}) =>{
    return(
        <>
        <div>
            <span>
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Not included in Free</span>
            </span>
        </div>
        </>
    )
}

export default IconMap;


                