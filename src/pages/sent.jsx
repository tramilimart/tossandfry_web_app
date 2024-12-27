import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { useQuery } from '@tanstack/react-query';
import { useServiceUtils } from '../utils/appUtils.js';
import AgentContext from '../utils/agentContext.jsx';

const fetchData = async (uid) => {
    const q = query(
      collection(db, 'policy_details'),
      where('agent_id', '==', uid),
      where('policy_status', 'in', ['For Issuance', 'Incorrect Details']),
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
    const { agentContext } = useContext(AgentContext);
    const serviceUtils = useServiceUtils();

    const { data, isLoading } = useQuery({
        queryKey: ['sent'],
        queryFn: () => fetchData(agentContext.agent.uid),
    });

    const viewDetails = (policyId) => {
        navigate(`/sent-dtls/${policyId}`);
    }

    return(
        <>
            <div className='status-bar'>
                <div className='d-flex align-items-center'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
                    <span className="mx-2 mb-1">Sent Quotations</span>
                </div>
            </div>
            {isLoading ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <>
                <div className="policy-cards">
                    {data.length > 0 ? (
                        data.map((policy) => (
                            <div key={policy.id} className="policy-card" onClick={() => viewDetails(policy.id)}>
                                <div className='header'>
                                    <span className='title'>{serviceUtils.getServiceLabel(policy.policy_type)}</span>
                                    <span className="title">{policy.policy_status}</span>
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
                </>
            )}
        </>
    )
}

export default Component