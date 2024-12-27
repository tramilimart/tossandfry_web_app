import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";
import { db } from '../utils/firebaseConnect.js';
import { useQuery } from '@tanstack/react-query';
import { currencyFormat } from '../utils/appUtils.js';
import AgentContext from '../utils/agentContext.jsx';
import StatusBar from '../component/statusBar.jsx'

const fetchData = async (uid) => {
    const q = query(
      collection(db, 'policy_details'),
      where('agent_id', '==', uid),
      where('policy_status', '==', 'Renewals'),
      orderBy('expiry_date', 'desc'),
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

    const { data, isLoading } = useQuery({
        queryKey: ['renewals'],
        queryFn: () => fetchData(agentContext.agent.uid),
    });
      
    const viewDetails = (id) => {
        console.log(id);
    }
    
    const getItemIcon = (label) => {
        const details = agentContext.services.find(service => service.label === label);
        return details ? details.icon : ''; 
    }

    return(
        <>
            <div className='status-bar'>
                <div className='d-flex align-items-center'>
                    <i className="bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
                    <span className="mx-2 mb-1">For Renewals</span>
                </div>
            </div>
            {isLoading ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <div className="policy-cards">
                    {data.length > 0 ? (
                        data.map((policy) => (
                            <div key={policy.id} className="policy-card">
                                <div className='header'>
                                    <span className='title'>{policy.policy_type}</span>
                                </div>
                                <div className='body'>
                                    <div className='col1'>
                                        <span className='desc'>{policy.model_year + ' ' + policy.make + ' ' + policy.sub_model}</span>
                                        <span className='desc'>{policy.assured_name}</span>
                                    </div>
                                    <div className='col2'>
                                        <img src={getItemIcon(policy.policy_type)} alt=""/>
                                    </div>
                                </div>
                                <div className='footer'>
                                    <div className='space-betweenY'>
                                        <span className='label'>TOTAL AMOUNT</span>
                                        <span className='amount'>₱ {currencyFormat(policy.premium)}</span>
                                    </div>
                                    <button type="button" className="btn my-btn-red-sm" onClick={() => viewDetails(policy.id)}>View</button>
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