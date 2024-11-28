import React from 'react'
import jwt from 'jsonwebtoken'
import { useAuthContext } from '@/firebase/AuthContext'

function Page() {
    const jwt_secret_key = 'JZ6cO9mXpW'

    const payload = {
        link: '/',
        deviceId: '001',
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }
    const test = jwt.sign(payload, jwt_secret_key.toString('utf-8'))
    console.log("test", test)
    const verify = jwt.verify(test, jwt_secret_key)
    console.log("verify", verify)

    const sharedLink = `localhost:3000/shared?token=${test}`
    console.log("link", sharedLink)


    return (
        <div>page</div>
    )
}

export default Page