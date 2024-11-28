'use client'

import Link from "next/link"
import { Button } from "@/app/ui/button"
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";

const Header = () => {
    const router = useRouter()
    function handleLogout() {
        signOut(auth).then(() => {
            router.push('/')
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <header className="flex items-center w-full bg-blue-600 text-white justify-between py-5 px-2">
            <Link
                href={'/'}
            >Website Title</Link>
            <Button
                onClick={handleLogout}
            >Log Out</Button>
        </header>
    )
}

export default Header