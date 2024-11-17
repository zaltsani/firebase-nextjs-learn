'use client'

import { useRouter } from "next/navigation"
import { useAuthContext } from "../../firebase/AuthContext"
import { useEffect, useState } from "react"
import Map from "@/components/Maps"
import { Button } from "../ui/button"
import { signOut } from "firebase/auth"
import { auth, database, firestoredb } from "@/firebase/firebaseConfig"
import { collection, doc, getDoc } from "firebase/firestore"
import useFirebaseData from "../lib/useFirebaseData"
import { onValue, ref } from "firebase/database"


export default function Page() {
    const { user } = useAuthContext()
    const router = useRouter()
    const userId = user?.uid
    // console.log(userId)

    const [userDetails, setUserDetails] = useState({})
    const [loadingUserDetails, setLoadingUserDetails] = useState(true)

    const [locationData, setLocationData] = useState({})
    const [loadingLocationData, setLoadingLocationData] = useState(true)

    useEffect(() => {
        if (user) {
            const docRef = doc(firestoredb, `users/${userId}`)
            const fetchUserDetails = async () => {
                const docSnap = await getDoc(docRef)
                setUserDetails(docSnap.data())
                setLoadingUserDetails(false)
                // console.log("docRef", docSnap.data())
            }
            fetchUserDetails()
        }
    })
    // console.log(userDetails)

    useEffect(() => {
        if (user === null) {
            router.push('/login')
        }
    }, [user, router])

    useEffect(() => {
        if (!loadingUserDetails && userDetails?.role === 'admin') {
            // get data from realtime database
            const dbRef = ref(database, '/')
            const unsubscribe = onValue(dbRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    setLocationData(data)
                }
            })
            setLoadingLocationData(false)
        } else if (!loadingUserDetails && userDetails?.role === 'user' && userDetails.device) {
            // const docRef = collection(`users/${userId}/device`)
            const devicesList = userDetails.device
            console.log(userDetails.device)
            for (const key of devicesList) {
                console.log("device", key)
                const dbRef = ref(database, `/${key}`)
                const unsubscribe = onValue(dbRef, (snapshot) => {
                    const data = snapshot.val()
                    setLocationData((prevData) => (
                        {
                            ...prevData,
                            [key]: data
                        }
                    ))  
                })
            }
            setLoadingLocationData(false)
        }
    }, [loadingUserDetails, userId])

    // if (!loadingLocationData) {
    //     console.log(locationData)
    // }


    function handleLogout() {
        signOut(auth).then(() => {
            router.push('/')
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <Button
                onClick={handleLogout}
            >Log Out</Button>
            {!loadingLocationData && (
                <Map
                    locationData={locationData}    
                />
            )}
        </>
    )
}