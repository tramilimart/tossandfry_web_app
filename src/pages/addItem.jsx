import React, { useContext, useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, getDoc, doc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { currencyFormat } from '../utils/appUtils.js';
import ProductVariation from '../component/productVariation.jsx'
import AppContext from '../utils/appContext.jsx';
import { Divide } from 'lucide-react';

const ComponentName = () => {
    const { cart, addCart } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const productDetails = location.state?.productDetails;
    const [quantity, setQuantity] = useState(
        cart.some(cartItem => cartItem.id === productDetails.id) 
        ? cart.find(cartItem => cartItem.id === productDetails.id).quantity 
        : 1);
    const [isFetching, setIsFetching] = useState(false);
    const [variationSelections, setVariationSelections] = useState({});
    const selectedItem = cart.find(item => item.id === productDetails.id);
    const selectedVariation = selectedItem?.variation;
    

    const handleVariationChange = (variationId, selectedItems) => {
        setVariationSelections(prev => ({
            ...prev,
            [variationId]: selectedItems
        }));

        // Check if the item already exists in the cart by matching the id
        const itemExists = cart.some(cartItem => cartItem.id === productDetails.id);
        if (itemExists) {
            console.log(`${productDetails.id} already exists in the cart!`);

            // If the item exists, update its quantity and totalAmount in the cart
            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === productDetails.id) {
                    // Update the item's variation
                    cartItem.variation[variationId] = selectedItems
                }
                return cartItem;
            });

            // Update the cart with the new values
            addCart(updatedCart);
        }
    };
    // To get all selections
    useEffect(() => {
        console.table('my cart:', cart);
    }, [cart]);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
        
        // Check if the item already exists in the cart by matching the id
        const itemExists = cart.some(cartItem => cartItem.id === productDetails.id);
        if (itemExists) {
            console.log(`${productDetails.id} already exists in the cart!`);

            // If the item exists, update its quantity and totalAmount in the cart
            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === productDetails.id) {
                    // Update the item's quantity and totalAmount
                    cartItem.quantity = quantity + 1; // Increment the existing quantity
                    cartItem.totalAmount = cartItem.quantity * productDetails.price; // Recalculate total amount
                }
                return cartItem;
            });

            // Update the cart with the new values
            addCart(updatedCart);
        }
    };
    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
        
        // Check if the item already exists in the cart by matching the id
        const itemExists = cart.some(cartItem => cartItem.id === productDetails.id);
        if (itemExists) {
            console.log(`${productDetails.id} already exists in the cart!`);
    
            // If the item exists, update the cart
            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === productDetails.id) {
                    const updatedQuantity = quantity - 1;
                    if (updatedQuantity > 0) {
                        return {
                            ...cartItem,
                            quantity: updatedQuantity,
                            totalAmount: updatedQuantity * productDetails.price,
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

    const handleAdd = () => {
        const item = {
            id: productDetails.id,
            title: productDetails.title,
            thumbnail: productDetails.thumbnail,
            quantity: quantity,
            totalAmount: (quantity * productDetails.price),
            variation: variationSelections
        };
    
        // Create a unique key for comparison
        const itemKey = JSON.stringify(item);
    
        // Transform the Set to store keys (strings) for comparison
        const newSet = new Set([...cart].map(i => JSON.stringify(i)));
    
        if (newSet.has(itemKey)) {
            console.log(`${itemKey} already exists in the set!`);
            return;
        } else {
            console.log(`${itemKey} not yet exists in the set!`);
        }
    
        // Add the new item and update the cart
        newSet.add(itemKey);
        const updatedCart = [...newSet].map(i => JSON.parse(i)); // Convert back to objects if needed
        addCart(updatedCart);
    }

    return (
        <>
            <div className='status-bar'>
                <div className='back-btn'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={() => navigate(-1)}></i>
                </div>
            </div>
            <div className='add-item-container'>
                {/*isProductLoading || isVariationLoading || */isFetching ? (
                    <div className='center-loading'>
                        <i className='spinner-border'></i><p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <div className='thumbnail'>
                            <img src={productDetails.thumbnail} alt="" loading="lazy" />
                        </div>
                        <div className='details'>
                            <span className='fw-normal fs-5'>{productDetails.title}</span>
                            <span className='fw-bold fs-5 w-25 text-end'>₱ {currencyFormat(productDetails.price)}</span>
                        </div>
                        <span className='description'>{productDetails.description}</span>
                        <div className='divider'></div>
                        <div className='variation-div'>
                            {productDetails.variation.map((item, index) => (
                                <ProductVariation
                                    key={item.id || index}
                                    variation_id={item}
                                    qty_pcs={productDetails.qty_pcs}
                                    selectedVariation={selectedVariation}
                                    onSelectionChange={(selectedItems) => handleVariationChange(item, selectedItems)}
                                />
                            ))}
                        </div>
                    </>
                )}
                <div className="add-button-div">
                {cart.some(cartItem => cartItem.id === productDetails.id) ? (
                    <>
                    <div className="btn-group me-2" role="group" aria-label="Quantity controls">
                        <button
                            type="button"
                            className="btn btn-danger w-50p on-cart"
                            onClick={handleDecrement}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            className="form-control w-50p text-center"
                            value={quantity}
                            readOnly
                        />
                        <button
                            type="button"
                            className="btn btn-danger w-50p on-cart"
                            onClick={handleIncrement}
                        >
                            +
                        </button>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-danger w-100 on-cart">
                        Added
                    </button>
                    </>
                ) : (
                    <>
                    <div className="btn-group me-2" role="group" aria-label="Quantity controls">
                        <button
                            type="button"
                            className="btn btn-danger w-50p plus-cart"
                            onClick={handleDecrement}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            className="form-control w-50p text-center"
                            value={quantity}
                            readOnly
                        />
                        <button
                            type="button"
                            className="btn btn-danger w-50p plus-cart"
                            onClick={handleIncrement}
                        >
                            +
                        </button>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-danger w-100 plus-cart" 
                        onClick={handleAdd}>
                        Add to cart
                    </button>
                    </>
                )}
                </div>
            </div>
        </>
    );
};

export default ComponentName;