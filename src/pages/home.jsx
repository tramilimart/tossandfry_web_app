import React, { useContext, useEffect, useState } from 'react';
//import { useAgentInfo } from '../App.jsx';
import { collection, getDoc, doc, query, where } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { useQuery } from '@tanstack/react-query';
import Header from "../component/home/header.jsx";
import PromoCard from "../component/home/promoCard";
import Products from "../component/home/products.jsx";

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

const HomePage = ({userContext}) => {
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

  return (
    <>
      <Header displayName={userContext.user.name} photo_url={userContext.user.photo_url} />
      <PromoCard />
      <Products isStoreOpen={isStoreOpen}/>
    </>
  );
};

/*
<StatusContainer policyStatusCount={policyStatusCount} />
<OtherServices />
*/

export default HomePage;
