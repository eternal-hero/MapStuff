import Link from 'next/link';
import React from 'react';

const Logo =({children}) =>{
    return(
        <>
        <div className="cursor-pointer">
        <span className="sr-only">MapStuff.io Logo</span>
            <Link href="/">
                <img src="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-black.svg" className="w-auto h-12 sm:h-14"/>
            </Link>
        </div>
        </>
    )
}

export default Logo;