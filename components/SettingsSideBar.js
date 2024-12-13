'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SettingsSideBar = ({active}) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(true)

    return (
        <aside>
            <p className='font-semibold p-3'>Global Settings</p>
            <div className="h-full px-2 pr-0 py-4 overflow-y-auto bg-white">
                <ul className="space-y-4 font-medium">
                    <li className={`${['a', 'b'].includes('a') ? 'bg-blue-500 text-gray-100' : ''} p-3 rounded-l-lg`}>
                        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className='flex justify-between items-center w-full'>
                            <span>Settings</span>
                            <span>{isSettingsOpen ? (<FaChevronUp />) : (<FaChevronDown />)}</span>
                        </button>
                    </li>
                    {isSettingsOpen && (
                        <div className='space-y-2 font-light px-4'>
                            <li className={`${active === 'profile' ? 'text-blue-500' : ''}`}>
                                <Link href='/superadmin/settings/profile' className='w-full text-left'>My Profile</Link>
                            </li>
                            <li className={`${active === 'changepassword' ? 'text-blue-500' : ''}`}>
                                <Link href='/superadmin/settings/changepassword' className='w-full text-left'>Change Password</Link>
                            </li>
                            <li className={`${active === 'modelnamealias' ? 'text-blue-500' : ''}`}>
                                <Link href='/superadmin/settings/modelnamealias' className='w-full text-left'>Model Name Alias</Link>
                            </li>
                        </div>
                    )}
                </ul>
            </div>
        </aside>
    )
}

export default SettingsSideBar