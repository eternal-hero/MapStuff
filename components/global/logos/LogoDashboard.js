import Link from 'next/link';
import React from 'react';

const LogoDashboard =({children}) =>{
    return(
        <>
        <div className="cursor-pointer">
        <span className="sr-only">MapStuff.io Logo</span>
            <Link href="/dashboard">
                <img src="https://cdn.gangnam.club/images/logos/map-stuff-logo-rect-neg.svg" className="w-auto h-14 sm:h-16" />
            </Link>
        </div>
        </>
    )
}

export default LogoDashboard;