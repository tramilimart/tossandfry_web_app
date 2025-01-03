import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../utils/appContext.jsx';
import { currencyFormat } from '../utils/appUtils.js';

const ComponentName = () => {
    const { cart, addCart } = useContext(AppContext);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // To get all selections
    useEffect(() => {
        setTotalQuantity(cart?.reduce((sum, item) => sum + item.quantity, 0) || 0);
        setTotalAmount(cart?.reduce((sum, item) => sum + item.totalAmount, 0) || 0);
    }, [cart]);

    return (
        <>
            {cart?.length > 0 && (
                <div className='bottom-cart'>
                    <div>
                        <i className="bi bi-basket2 fs-5 mr-2"></i>{totalQuantity} 
                        <span className="ml-2">{totalQuantity > 1 ? 'items' : 'item'}</span>
                    </div>
                    ₱ {currencyFormat(totalAmount)}
                </div>
            )}
        </>
    );
};

export default ComponentName;