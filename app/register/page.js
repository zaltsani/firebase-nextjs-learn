'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import signUp from "@/firebase/signup"

export default function Page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password)

        if (error) {
            return alert(error.message)
        }

        console.log(result)
        return router.push("/dashboard")

        // createUserWithEmailAndPassword(auth, data.email, data.password)
        //     .then((userCredential) => {
        //         // Signed up 
        //         const user = userCredential.user;
        //         // ...
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         alert(errorMessage)
        //         // ..
        //     });
    }

    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                <div className="w-32 text-white md:w-36">
                    {/* <AcmeLogo /> */}
                </div>
                </div>
                <form onSubmit={handleForm}>
                    <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 text-black">
                        <h1 className={`mb-3 text-2xl`}>
                        Register Account
                        </h1>
                        <div className="w-full">
                        <div>
                            <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                            >
                            Email
                            </label>
                            <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            {/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                            >
                            Password
                            </label>
                            <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            {/* <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                            </div>
                        </div>
                        </div>
                        <Button className="mt-4 w-full">
                        Log in
                        {/* <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /> */}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}