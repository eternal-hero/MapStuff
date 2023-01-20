import React, { useEffect } from 'react'

const useRole = (session) => {
    const [role, setRole] = React.useState('')

    useEffect(() => {
        if(session && session?.user && session?.user[`${window.location.origin}/role`]){
            setRole(session?.user[`${window.location.origin}/role`])
        }else{
            setRole([])
        }
    }, [session])

    return [role]
}

export default useRole