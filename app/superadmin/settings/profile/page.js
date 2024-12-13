'use client'

import React, { useState } from 'react'

const Page = () => {
    const [loginAccount, setLoginAccount] = useState('superUser')
    const divClassName = 'grid grid-cols-8 gap-10 items-center'
    const pClassName = 'col-start-3 col-span-1 text-right'
    const inputClassName = 'rounded-lg col-span-2'

    const inputList = [
        {title: 'Login Account', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Customer Name', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Contacts', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Cell Phone', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Email', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Timezone', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Language', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Country / Region', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Unit of Distance', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Unit of Temperature', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Unit of Capacity', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Default Map', type: 'text', state: loginAccount, setState: setLoginAccount},
        {title: 'Home Page', type: 'text', state: loginAccount, setState: setLoginAccount},
    ]

    return (
        <div className='mx-4 w-full'>
            <p className='p-3 px-5 font-bold'>My Profile</p>
            <div className='bg-white w-full h-full rounded-xl'>
                <div className='grid grid-cols-1 gap-5 py-10'>
                    {inputList.map((item, index) => (
                        <div key={index} className={divClassName}>
                            <p className={pClassName}>{item.title}</p>
                            <input
                                type={item.type}
                                placeholder='Login Account'
                                value={item.state}
                                onChange={() => item.setState(event.target.value)}
                                className={inputClassName}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page