import { useState, useEffect } from 'react';
import { database } from '@/fire/firebaseConfig';
import { getDatabase, ref, get, set, onValue, off, query } from "firebase/database";

const useFirebaseData = (path) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, '/');
    const filteredQuery = query(
        dataRef,
    )

    // Listen for value changes in real-time
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);
    });

    // Clean up the listener on component unmount
    return () => off(dataRef, "value", unsubscribe);
  }, [path]);

  return data;
};

export default useFirebaseData;