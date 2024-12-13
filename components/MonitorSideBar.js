'use client'

import React from 'react'
import { FaCarSide } from "react-icons/fa6";
import { AiOutlineAlert } from "react-icons/ai";
import { TbRoute } from "react-icons/tb";
import Link from 'next/link';

const MonitorSideBar = ({active}) => {
    return (
        <aside>
            <div className="h-full px-5 py-4 overflow-y-auto bg-white">
                <ul className="space-y-4 font-medium">
                    <li>
                        <Link href={'/'} className={`flex flex-col items-center p-2 ${active === 'objects' ? 'bg-blue-500 text-gray-100' : 'text-gray-700'} rounded-lg hover:bg-blue-400 group`}>
                            <FaCarSide className="text-4xl"/>
                            <span className="font-bold text-lg">Objects</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/'} className={`flex flex-col items-center p-2 ${active === 'alerts' ? 'bg-blue-500 text-gray-100' : 'text-gray-700'} rounded-lg hover:bg-blue-400 group`}>
                            <AiOutlineAlert className="text-4xl"/>
                            <span className="font-bold text-lg">Alerts</span>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/'} className={`flex flex-col items-center p-2 ${active === 'tracks' ? 'bg-blue-500 text-gray-100' : 'text-gray-700'} rounded-lg hover:bg-blue-400 group`}>
                            <TbRoute className="text-4xl"/>
                            <span className="font-bold text-lg">Tracks</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    )
}

export default MonitorSideBar