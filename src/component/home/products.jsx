import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../../utils/firebaseConnect.js';
import { useNavigate } from 'react-router-dom';
import StarRating from '../starRating.jsx';
import BottomCart from '../bottomCart.jsx'

const fetchProducts = async () => {
    const q = query(
      collection(db, "product_category"), 
      orderBy('date_added', 'desc')
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

function Component({isStoreOpen}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);
    
    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetchProducts(),
    });
    useEffect(() => {
        if (data) {
            setIsFetching(false);
        }
    }, [data]);

    const goto = async (category) => {
        if (isStoreOpen) {
            navigate(`/category/${category}`);
        }
    };

    return (
        <>
        <div className="product-container">
            {isLoading || isFetching ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
            <>
                <div className='title'>Choose your order now</div>
                <div className={!isStoreOpen ? 'body store-close' : 'body'}>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <div className='item' key={index} onClick={() => goto(item.category)}>
                                <div className='thumbnail'>
                                    <img src={item.thumbnail} alt="" loading="lazy"/>
                                </div>
                                <div className='details'>
                                    <span className='fw-bold fs-6'>{item.title}</span>
                                    <span className='fw-normal text-secondary'>{item.description }</span>
                                    <StarRating value={item.rating} /> 
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className='center-loading text-gray'>Cannot fetch products.</span>
                    )}
                </div>

                {!isStoreOpen && (
                    <div className='store-close-msg'>
                        <i className="bi bi-clock-fill"></i>
                        Sorry! The restaurant is closed right now.
                    </div>
                )}
                </>
            )}
        </div>
        <BottomCart/>
        </>
    )
}

export default Component