'use client'

import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/firebaseConfig"

export default function handleLogout() {
    const router = useRouter()
    signOut(auth).then(() => {
        router.push('/')
    }).catch((error) => {
        console.log(error)
    })
}