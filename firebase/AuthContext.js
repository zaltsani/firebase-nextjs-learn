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
import { app } from "./firebaseConfig";
// import auth from "./firebaseConfig"

const auth = getAuth(app);

export const AuthContext = createContext({})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
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