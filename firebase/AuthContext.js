'use client'

import { 
    useState,
    useEffect,
    useContext,
    createContext
} from "react";
import {
    getAuth,
    onAuthStateChanged
} from "firebase/auth"
import { app, firestoredb } from "./firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";
// import auth from "./firebaseConfig"

const auth = getAuth(app);
export const AuthContext = createContext({})
export const useAuthContext = () => useContext(AuthContext)


export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                const userId = authUser.uid

                // Fetch user role from Firestore
                const userDataRef = doc(firestoredb, `users/${userId}`)
                const userDataSnap = await getDoc(userDataRef)
                const userData = userDataSnap.data()
                
                // add role to authUser
                authUser.role = userData.role

                setUser(authUser)
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        
        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}