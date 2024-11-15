import { useState, useEffect } from 'react';
import { database } from '@/utils/firebaseConfig';
import { getDatabase, ref, get, set, onValue, off } from "firebase/database";

const useFirebaseData = (path) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(database, path);
    console.log(dataRef)

    // Listen for value changes in real-time
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      console.log("Data received from Firebase:", value);  // Check the data received in console
      setData(value);
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => off(dataRef, "value", unsubscribe);
  }, [path]);

  return { data, loading };
};

export default useFirebaseData;