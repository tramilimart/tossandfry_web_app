import React, { createContext, useState } from 'react';

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agentContext, setAgentContext] = useState({
    agent: {
      uid: null,
      name: '',
      email: '',
      photo_url: '',
    },
    services: {},
  });

  return (
    <AgentContext.Provider value={{ agentContext, setAgentContext }}>
      {children}
    </AgentContext.Provider>
  );
};

export default AgentContext;
