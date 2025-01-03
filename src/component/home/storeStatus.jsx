import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDoc, doc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../../utils/firebaseConnect';

const fetchStoreStat = async () => {
    try {
      const docRef = doc(db, "store_settings", "parameters");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const isStoreOpen = docSnap.data().is_store_open;
        return isStoreOpen;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching store status:", error);
      return null;
    }
};

function Component() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    const { data: isStoreOpen, isLoading } = useQuery({
        queryKey: ['store_stat'],
        queryFn: () => fetchStoreStat(),
    });
    useEffect(() => {
        if (isStoreOpen) {
            setIsFetching(false);
        }
    }, [isStoreOpen]);
   
    const handleSubmit = async (e) => {
        console.log('data', isStoreOpen);
    };

    return(
        <>
            <div className='store-stat-container'>
                {isLoading || isFetching ? (
                    <div className=''>
                    <span className='store-check' onClick={handleSubmit}>Checking Store...</span>
                    </div>
                ) : (
                    <>
                        {isStoreOpen ? (
                            <div className="store-open">
                                <span>We are OPEN</span>
                            </div>
                        ) : (
                            <div className="store-close">
                                <span>Sorry we are CLOSE</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default Component