import React, { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { useServiceUtils, currencyFormat } from '../utils/appUtils.js';
import StarRating from '../component/starRating.jsx';
import AppContext from '../utils/appContext.jsx';
import BottomCart from '../component/bottomCart.jsx'

const fetchData = async (category) => {
    const q = query(
      collection(db, 'products'),
      where('category', '==', category),
      orderBy('price', 'asc'),
      orderBy('is_available', 'asc'),
      orderBy('date_added', 'desc')
    );
  
    try {
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          data.push({ id: doc.id, ...doc.data() });
        }
      });
      return data;
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
};

function Component() {
    const navigate = useNavigate();
    const { category } = useParams();
    const { cart, addCart } = useContext(AppContext);
    const [isFetching, setIsFetching] = useState(false);
    const [quantities, setQuantities] = useState({});
    
    const { data, isLoading } = useQuery({
        queryKey: [`${category}_category`],
        queryFn: () => fetchData(category),
    });

    useEffect(() => {
        if (data) {
            setIsFetching(false);
            // Initialize quantities when data is loaded
            setQuantities(data.reduce((acc, item) => ({ ...acc, 
                [item.id]: cart.some(cartItem => cartItem.id === item.id) 
                ? cart.find(cartItem => cartItem.id === item.id).quantity 
                : 1
            }), {}));
        }
    }, [data]);

    // Increment and Decrement handlers for each item
    const handleIncrement = (itemId, price) => {
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

    const handleDirectAdd = (productDetails) => {
        // Create the item object with the quantity from the `quantities` state
        const item = {
            id: productDetails.id,
            title: productDetails.title,
            thumbnail: productDetails.thumbnail,
            quantity: quantities[productDetails.id] || 1, // Default to 1 if quantity is undefined
            totalAmount: (quantities[productDetails.id] || 1) * productDetails.price, // Update total amount based on the quantity
            variation: null,
        };
    
        // Check if the item already exists in the cart by matching the id
        const itemExists = cart.some(cartItem => cartItem.id === item.id);
    
        if (itemExists) {
            console.log(`${item.id} already exists in the cart!`);
    
            // If the item exists, update its quantity and totalAmount in the cart
            const updatedCart = cart.map(cartItem => {
                if (cartItem.id === item.id) {
                    // Update the item's quantity and totalAmount
                    cartItem.quantity = quantities[item.id]; // Increment the existing quantity
                    cartItem.totalAmount = cartItem.quantity * productDetails.price; // Recalculate total amount
                }
                return cartItem;
            });
    
            // Update the cart with the new values
            addCart(updatedCart);
        } else {
            console.log(`${item.id} does not exist in the cart!`);
    
            // If the item doesn't exist, add it to the cart
            addCart([...cart, item]);
        }
    }

    const handleVariationAdd = async (productDetails) => {
        console.log('productDetails', productDetails);
        navigate('/add-item', { 
            state: { productDetails } 
        });
    }

    return(
        <>
            <div className='status-bar'>
                <div className='back-btn'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
                </div>
            </div>
            <div className="product-container">
                {isLoading || isFetching ? (
                    <div className='center-loading'>
                        <i className='spinner-border'></i><p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <div className='title'></div>
                        <div className='body'>
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <div className='item' key={index}>
                                        <div className='thumbnail'>
                                            <img src={item.thumbnail} alt="" loading="lazy"/>

                                            {/* If item has variation add button beside image */}
                                            {item.variation && (
                                                <>
                                                {/* Change add to cart button to + or number of item */}
                                                {cart.some(cartItem => cartItem.id === item.id) ? (
                                                    <button className='on-cart add-cart-btn' onClick={() => handleVariationAdd(item)}>
                                                        {cart.find(cartItem => cartItem.id === item.id)?.quantity}
                                                    </button>
                                                ) : (
                                                    <button className='plus-cart add-cart-btn' onClick={() => handleVariationAdd(item)}>+</button>
                                                )}
                                                </>
                                            )}

                                        </div>
                                        <div className='details'>
                                            <span className='fw-normal fs-6'>{item.title}</span>
                                            <span className='fw-bold fs-6'>₱ {currencyFormat(item.price)}</span>
                                            
                                            {/* If item has no variation set direct add buttons */}
                                            {!item.variation && (
                                                <div className="add-button-div">
                                                    {/* Change add to cart button UI */}
                                                    {cart.some(cartItem => cartItem.id === item.id) ? (
                                                        <>
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
                                                        <button className='btn btn-danger w-100 on-cart'>Added</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                        <div className="btn-group me-2" role="group" aria-label="Quantity controls">
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger w-25p plus-cart"
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
                                                                className="btn btn-danger w-25p plus-cart"
                                                                onClick={() => handleIncrement(item.id, item.price)}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button className='btn btn-danger w-100 plus-cart' onClick={() => handleDirectAdd(item)}>Add to cart</button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span className='center-loading text-gray'>Cannot fetch products.</span>
                            )}
                        </div>
                    </>
                )}
            </div>
            <BottomCart/>
        </>
    )
}

export default Component