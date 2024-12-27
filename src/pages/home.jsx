import React, { useContext } from 'react';
//import { useAgentInfo } from '../App.jsx';
import AgentContext from '../utils/agentContext.jsx';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { useQuery } from '@tanstack/react-query';

import Header from "../component/home/header.jsx";
import Commission from "../component/home/commision.jsx";
import StatusContainer from "../component/home/statusContainer.jsx";
import CtplServices from "../component/home/ctplServices.jsx";
import OtherServices from '../component/home/otherServices.jsx';

const fetchData = async (uid) => {
  const q = query(collection(db, "policy_details"), where("agent_id", "==", uid));
  const querySnapshot = await getDocs(q);
  const newPolicyStatusCount = { sent: 0, issued: 0, renewals: 0, drafts: 0 };

  querySnapshot.forEach((doc) => {
    if (doc.exists()) {
      const status = doc.data().policy_status;
      if (status === 'For Issuance' || status === 'Incorrect Details') {
        newPolicyStatusCount.sent++;
      } else if (status === 'For Payment' || status === 'Verifying Payment' || status === 'Completed') {
        newPolicyStatusCount.issued++;
      } else if (status === 'Renewal') {
        newPolicyStatusCount.renewals++;
      } else if (status === 'Draft') {
        newPolicyStatusCount.drafts++;
      }
    }
  });
  return newPolicyStatusCount;
};

const HomePage = () => {
  const { agentContext } = useContext(AgentContext);

  const { data: policyStatusCount, error, isLoading } = useQuery({
    queryKey: ['policyStatusCount', agentContext.agent.uid],
    queryFn: () => fetchData(agentContext.agent.uid),
    enabled: !!agentContext.agent.uid,
  });

  if (isLoading) {
    return (
      <div className='center-loading'>
        <i className='spinner-border'></i><p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading agent details.</div>;
  }

  return (
    <>
      <Header displayName={agentContext.agent.name} photo_url={agentContext.agent.photo_url} />
      <StatusContainer policyStatusCount={policyStatusCount} />
      <CtplServices />
      <OtherServices />
    </>
  );
};

export default HomePage;
