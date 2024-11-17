import { firestoredb } from '@/firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

const getUserData = async (user_uid) => {
    try {
        const docRef = doc(firestoredb, "users", user_uid)
        const docSnap = await getDoc(docRef)

        // Check if the document exists
        if (docSnap.exists()) {
            return docSnap.data();
            // Return the document data
        } else {
            console.log("No such document!");
            return null; // Return null if no data found
        }
    } catch (error) {
        throw error
    }
}

export default getUserData