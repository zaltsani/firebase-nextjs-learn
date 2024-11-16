'use client'

import { useRouter } from "next/navigation"
import { useAuthContext } from "../../firebase/AuthContext"
import { useEffect } from "react"
import Map from "@/components/Maps"

export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()

    console.log(user.uid)

    useEffect(() => {
        if (user === null) router.push('/login')
    }, [user, router])

    return (
        <>
            <Map />
        </>
    )
}