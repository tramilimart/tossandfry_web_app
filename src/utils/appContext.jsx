import React, { createContext, useState } from 'react';

const AgentContext = createContext();

export const AppProvider = ({ children }) => {
  const [userContext, setUserContext] = useState({
    user: {
      uid: null,
      name: '',
      email: '',
      photo_url: '',
    }
  });

  const [cart, addCart] = useState([]);

  const [productContext, setProductContext] = useState({
    products: {},
  });

  // Combine both contexts into a single value object
  const value = {
    userContext,
    setUserContext,
    cart,
    addCart,
    productContext,
    setProductContext
  };

  return (
    <AgentContext.Provider value={ value }>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentContext;
