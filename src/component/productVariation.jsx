import React, { useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, getDoc, doc, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';

const fetchVariation = async (id) => {
    try {
        // Reference to the main document
        const docRef = doc(db, "product_variation", id);
        // Reference to the `list` subcollection
        const listRef = collection(db, "product_variation", id, "list");

        // Fetch the document and subcollection data concurrently
        const [docSnap, listSnapshot] = await Promise.all([
            getDoc(docRef), // Fetch the main document
            getDocs(listRef), // Fetch the subcollection
        ]);

        // Get document data
        const docData = docSnap.exists() ? docSnap.data() : null;

        // Map over subcollection documents
        const listData = listSnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID
            ...doc.data(),
        }));

        // Return both document data and subcollection data
        return { docData, listData };
    } catch (error) {
        console.error("Error fetching variation data:", error);
        return { docData: null, listData: [] };
    }
};
const ComponentName = ({ variation_id, qty_pcs, selectedVariation, onSelectionChange }) => {
    const [isFetching, setIsFetching] = useState(false);
    const [checkableType, setCheckableType] = useState(null);
    const [selectLimit, setSelectLimit] = useState(null);
    const [selectedItems, setSelectedItems] = useState(selectedVariation?.[variation_id] || []);

    const { data: variation, isLoading: isVariationLoading } = useQuery({
        queryKey: [`${variation_id}`],
        queryFn: () => fetchVariation(variation_id),
        enabled: !!variation_id, // Ensures this query only runs if product.variation exists
    });

    useEffect(() => {
        if (variation) {
            const limit = variation.docData.limit[qty_pcs];
            setSelectLimit(limit);
            const checkableType = limit > 1 ? 'checkbox' : 'radio';
            setCheckableType(checkableType);
            setIsFetching(false);
        }
    }, [variation]);

    const handleChange = (event, itemName) => {
        if (checkableType === "checkbox") {
            // Prevent selection if limit is reached
            if (event.target.checked && selectedItems.length >= Number(selectLimit)) {
                event.target.checked = false; // Reset checkbox state
                console.log('checkbox reset!')
                return;
            }
            console.log('adding selectedItems from checkBox');
            /*setSelectedItems((prevItems) => {
                const newItems = event.target.checked
                    ? [...prevItems, itemName]
                    : prevItems.filter((name) => name !== itemName);
                
                console.log('Updated selectedItems:', newItems); // Log inside the updater
                return newItems;
            });*/

            const newItems = event.target.checked
                ? [...selectedItems, itemName]
                : selectedItems.filter((name) => name !== itemName);
            setSelectedItems(newItems);
            onSelectionChange(newItems);
        } else if (checkableType === "radio") {
            console.log('adding selectedItems from radio');
            const newItems = [itemName];
            setSelectedItems(newItems);
            onSelectionChange(newItems);
        }
    };
    
    // If you need to watch for changes, use useEffect
    useEffect(() => {
        console.log('selectedItems changed:', selectedItems);
    }, [selectedItems]);

    return (
        <>
            {isVariationLoading || isFetching ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <>
                    <div className='title'>{variation.docData.title} - (Pick {selectLimit})</div>
                    <ul className="list-group">
                        {checkableType && variation.listData.length > 0 && (
                            variation.listData.map((item, index) => (
                                <li key={item.id} 
                                className={item.is_available ? 'list-group-item' : 'list-group-item disabled'} 
                                aria-disabled={!item.is_available}>
                                    <label>
                                        <input
                                            className="form-check-input"
                                            type={checkableType} // "checkbox" or "radio"
                                            name={variation_id} // Shared name for radio buttons
                                            value={item.name}
                                            checked={
                                              selectedItems.includes(item.name) || 
                                              (selectedVariation?.[variation_id]?.includes(item.name) || false) // Safely check
                                            }
                                            onChange={(event) => handleChange(event, item.name)}
                                        />
                                        {item.is_available ? item.name : item.name + (' (Not Available)')}
                                    </label>
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )}
        </>
    );
};

export default ComponentName;