// SlidingPanel.jsx
import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../utils/appContext.jsx';
import { currencyFormat, formatWord } from '../utils/appUtils.js';

const SlidingPanel = ({ productId, open, onClose }) => {
    const { cart, addCart } = useContext(AppContext);
    const [quantities, setQuantities] = useState({});
    const matchingItems = cart.filter(item => item.id === productId);

    useEffect(() => {    
        // Initialize quantities based on matching items
        const initialQuantities = matchingItems.reduce((acc, item) => {
          acc[item.id] = item.quantity;  // Initialize the quantity for each item
          return acc;
        }, {});
    
        // Set the quantities state
        setQuantities(initialQuantities);
      }, [cart, productId]); 

    // Increment and Decrement handlers for each item
    const handleIncrement = (itemId, price) => {
        console.log('price', price)
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: (prevQuantities[itemId] || 1) + 1,
        }));

        // Check if the item already exists in the cart by matching the id
        const itemExists = cart.some(cartItem => cartItem.id === itemId);
        if (itemExists) {
            console.log(`${itemId} already exists in the cart!`);

            // If the item exists, update its quantity and totalAmount in the cart
            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === itemId) {
                    // Update the item's quantity and totalAmount
                    cartItem.quantity = quantities[itemId] + 1; // Increment the existing quantity
                    cartItem.totalAmount = cartItem.quantity * price; // Recalculate total amount
                }
                return cartItem;
            });

            // Update the cart with the new values
            addCart(updatedCart);
        }
        console.log('cart', cart);
    };

    const handleDecrement = (itemId, price) => {
        setQuantities((prevQuantities) => {
            const updatedQuantity = prevQuantities[itemId] > 1 ? prevQuantities[itemId] - 1 : 0;
            return {
                ...prevQuantities,
                [itemId]: updatedQuantity,
            };
        });

        // Check if the item already exists in the cart by matching the id
        const itemExists = cart.some(cartItem => cartItem.id === itemId);
        if (itemExists) {
            console.log(`${itemId} already exists in the cart!`);

            // If the item exists, update the cart
            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === itemId) {
                    const updatedQuantity = quantities[itemId] - 1;
                    if (updatedQuantity > 0) {
                        return {
                            ...cartItem,
                            quantity: updatedQuantity,
                            totalAmount: updatedQuantity * price,
                        };
                    }
                    // If the quantity is zero, filter it out in the next step
                    return null;
                }
                return cartItem;
            })
                .filter(cartItem => cartItem !== null); // Remove items with zero quantity

            // Update the cart with the new values
            addCart(updatedCart);
        }
    };
    
    const togglePanel = () => {
        onClose(); // Call parent's close handler
    };

    return (
        <>
            {/* Overlay */}
            <div
            onClick={togglePanel}
            className={`overlay ${open ? 'show' : ''}`}
            />
            <div className={`sliding-panel bg-white border-top rounded-top shadow ${!open ? 'closed' : ''}`}>
                <div className="container p-4">
                    <div className="panel-handle" />
                    <h2 className="h4 mb-4">{matchingItems[0]?.title}</h2>
                            {matchingItems.length > 0 ? (
                                matchingItems.map((item, index) => (
                                    <div className='item' key={index}>
                                        <div className='thumbnail'>
                                            <img src={item.thumbnail} alt="" loading="lazy" />
                                        </div>
                                        <div className='details'>
                                            <span className='fs-6'>Variations:</span>
                                            <span className='variation-text'>
                                                {Object.entries(item.variation).map(([key, value], index) => (
                                                    <div key={index}>
                                                    {formatWord(key)}: {Array.isArray(value) ? value.join(', ') : value}
                                                    <br />
                                                    </div>
                                                ))}
                                            </span>
                                            <div className='add-button-div'>
                                                <span className='fw-bold fs-6'>₱ {currencyFormat(item.totalAmount)}</span>
                                                <div className="btn-group me-2" role="group" aria-label="Quantity controls">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger w-25p on-cart"
                                                        onClick={() => handleDecrement(item.id, item.price)}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="form-control w-25p text-center"
                                                        value={quantities[item.id] || 1}
                                                        readOnly
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger w-25p on-cart"
                                                        onClick={() => handleIncrement(item.id, item.price)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span className='center-loading text-gray'>Cannot fetch products.</span>
                            )}
                </div>
            </div>
        </>
    );
};

export default SlidingPanel;