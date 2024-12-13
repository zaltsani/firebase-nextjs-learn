'use client'

import React from 'react'
import SettingSideBar from '@/components/SettingsSideBar'
import { usePathname } from 'next/navigation'

const Layout = ({ children }) => {
    const pathName = usePathname()
    const pageName = pathName.split('/')[pathName.split('/').length - 1]

    return (
        <div className='flex w-full h-full bg-gray-100'>
            <SettingSideBar active={pageName} />
            {children}
        </div>
    )
}

export default Layout