import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { useServiceUtils } from '../utils/appUtils.js';
import AgentContext from '../utils/appContext.jsx';

const fetchData = async (uid) => {
    const q = query(
      collection(db, 'policy_details'),
      where('agent_id', '==', uid),
      where('policy_status', '==', 'Draft'),
      orderBy('quotation_date', 'desc'),
      limit(50)
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

function Component() {
    const navigate = useNavigate();
    const serviceUtils = useServiceUtils();
    const { agentContext } = useContext(AgentContext);
    const [isFetching, setIsFetching] = useState(false);
    
    const { data, isLoading } = useQuery({
        queryKey: ['drafts'],
        queryFn: () => fetchData(agentContext.agent.uid),
    });
    useEffect(() => {
        if (data) {
            setIsFetching(false);
        }
    }, [data]);

    const viewDetails = async (policyId) => {
        navigate(`/draft-dtls/${policyId}`);
    }

    return(
        <>
            <div className='status-bar'>
                <div className='d-flex align-items-center'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
                    <span className="mx-2 mb-1">Drafts</span>
                </div>
            </div>
            {isLoading || isFetching ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <div className="policy-cards">
                    {data.length > 0 ? (
                        data.map((policy) => (
                            <div key={policy.id} className="policy-card" onClick={() => viewDetails(policy.id)}>
                                <div className='header'>
                                    <span className='title'>{serviceUtils.getServiceLabel(policy.policy_type)}</span>
                                    <span></span>
                                </div>
                                <div className='body'>
                                    <div className='col1'>
                                        <span className='desc'>{policy.model_year + ' ' + policy.make + ' ' + policy.sub_model}</span>
                                        <span className='desc'>{policy.fname + ' ' + policy.mname + ' ' + policy.lname}</span>
                                    </div>
                                    <div className='col2'>
                                        <img src={serviceUtils.getServiceIcon(policy.policy_type)} alt="" loading="lazy"/>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className='center-loading text-gray'>No Records</span>
                    )}
                </div>
            )}
        </>
    )
}

export default Component