'use client'

import Link from "next/link"
import { Button, Dropdown } from "flowbite-react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import { useAuthContext } from "@/firebase/AuthContext";
import { useState } from "react";
import { ChartBarIcon, DevicePhoneMobileIcon, MapPinIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { CaretDown } from "@/icons/icon"
import { BsRouterFill } from "react-icons/bs";
import { FaCaretDown } from "react-icons/fa6";


const Header = () => {
    const [dropdown, setDropdown] = useState(false)
    const router = useRouter()
    const { user } = useAuthContext()

    function handleLogout() {
        signOut(auth).then(() => {
            router.push('/')
        }).catch((error) => {
            console.log(error)
        })
    }

    const HeaderItems = [
        {href: '/monitor', title: 'Monitor', icon: MapPinIcon},
        {href: '/report', title: 'Report', icon: ChartBarIcon},
        {href: '/device', title: 'Device', icon: BsRouterFill},
        {href: '/account', title: 'Account', icon: UserCircleIcon},
    ]

    return (
        <header className="flex flex-row items-center w-full bg-blue-600 text-white justify-between py-0 px-2">
            <div className="font-bold text-lg">
                <Link href={'/'}>Tracking Websites</Link>
            </div>

            {/* <Button>Flowbite</Button>
            <Dropdown label="Dropdown Flowbite" dismissOnClick={false} style={{ zIndex: 2000 }}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Item>Sign out</Dropdown.Item>
            </Dropdown> */}

            <div className="hidden sm:flex justify-between items-center font-semibold">
                {HeaderItems.map((item, index) => (
                    <div key={index} className="flex gap-1 py-5 px-5 rounded hover:bg-blue-500">
                        <item.icon className="h-6 text-gray-100"/>
                        <Link href={item.href}>{item.title}</Link>
                    </div>
                ))}
            </div>
            <div>
                <button
                    onClick={() => setDropdown(!dropdown)}
                    className="gap-x-2 inline-flex justify-center items-center w-full px-4 py-2 text-sm font-bold text-gray-100 rounded-md"
                >
                    {user.displayName ? user.displayName : user.email}
                    <FaCaretDown className='text-gray-100' /> 
                </button>
                {dropdown && (
                    <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        style={{ zIndex: 1000 }}
                    >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <Link
                                href='/superadmin/settings/profile'
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                                Settings
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                )}
                {/* <p>{user.displayName ? user.displayName : user.email}</p> */}
                {/* <Button onClick={handleLogout}>Log Out</Button> */}
            </div>
        </header>
    )
}

export default Header