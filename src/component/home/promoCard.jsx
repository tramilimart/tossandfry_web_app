import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../../utils/firebaseConnect';

const fetchData = async () => {
    const q = query(
      collection(db, 'promo'),
      where('is_active', '==', true),
      orderBy('date_start', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        data.push({ id: doc.id, ...doc.data() });
      }
    });
    return data;
};

function Component() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    
    const { data, isLoading } = useQuery({
        queryKey: ['promo'],
        queryFn: () => fetchData(),
    });
    useEffect(() => {
        if (data) {
            setIsFetching(false);
        }
    }, [data]);
   
    const handleSubmit = async (e) => {
        console.log('data', data);
    };

    return(
        <>
            {isLoading || isFetching ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <>
                {data.length > 0 && (
                    data.map((promo) => (
                        <div key={promo.id} className="promo-cards" onClick={() => handleSubmit(promo.id)}>
                            <img src={promo.thumbnail} alt='alt' loading="lazy"/>
                        </div>
                    ))
                )}
                </>
            )}
        </>
    )
}

export default Component