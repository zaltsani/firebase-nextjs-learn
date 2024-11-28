import { useRouter } from 'next/navigation'
import { useAuthContext } from '../firebase/AuthContext'
import { useEffect } from 'react'

const ProtectedRoute = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const { user } = useAuthContext()
        const router = useRouter()

        useEffect(() => {
            if (user === null || !allowedRoles.includes(user.role)) {
                router.push('/')
            }
        }, [user])

        if (user && allowedRoles.includes(user.role)) {
            return <WrappedComponent {...props} />
        }

        return null
    }
}

export default ProtectedRoute