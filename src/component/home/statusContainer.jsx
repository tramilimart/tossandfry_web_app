import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Component({ policyStatusCount }) {
    const navigate = useNavigate();
    return(
        <>
        {policyStatusCount && (
            <div className="pol-details-div">
                <div className="details-item">
                    <div className='item-icon' onClick={() => navigate('/drafts')}>
                        {policyStatusCount.drafts > 0 && (
                            <span>{policyStatusCount.drafts}</span>
                        )}
                        <i className="bi bi-inboxes-fill"></i>
                    </div>
                    <span>Drafts</span>
                </div>
                <div className="details-item">
                    <div className='item-icon' onClick={() => navigate('/sent')}>
                        {policyStatusCount.sent > 0 && (
                            <span>{policyStatusCount.sent}</span>
                        )}
                        <i className="bi bi-hourglass-split"></i>
                    </div>
                    <span>Sent</span>
                </div>
                <div className="details-item">
                    <div className='item-icon' onClick={() => navigate('/issued')}>
                        {policyStatusCount.issued > 0 && (
                            <span>{policyStatusCount.issued}</span>
                        )}
                        <i className="bi bi-file-earmark-text-fill"></i>
                    </div>
                    <span>Issued</span>
                </div>
                <div className="details-item">
                    <div className='item-icon' onClick={() => navigate('/renewals')}>
                        {policyStatusCount.renewals > 0 && (
                            <span>{policyStatusCount.renewals}</span>
                        )}
                        <i className="bi bi-calendar-week-fill"></i>
                    </div>
                    <span>Renewals</span>
                </div>
            </div>
        )}
        </>
    )
}

export default Component