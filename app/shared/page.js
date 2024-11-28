'use client'

import { useSearchParams } from 'next/navigation';
import jwt from 'jsonwebtoken'


const YourPage = () => {
    const jwt_secret_key = 'JZ6cO9mXpW'
    const searchParams = useSearchParams();

    // Convert searchParams to a regular object for easier access
    const params = {};
    searchParams.forEach((value, key) => {
        params[key] = value;
    });
    const token = params.token
    console.log("jwt", jwt)
    console.log(token)
    const verify = jwt.verify(token, jwt_secret_key.toString('utf-8'))
    // console.log("verify", verify)


    return (
        <div>
            <h1>Your Page</h1>
            <p>Query Parameters: {JSON.stringify(params)}</p>
        </div>
    );
    };

export default YourPage;