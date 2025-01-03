import React, { useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPolicyDetails } from '../utils/firebaseUtils.js';
import { useQuery } from '@tanstack/react-query';
import { currencyFormat, firebaseTimestampToDisplayDateFormat } from '../utils/appUtils.js';
import AgentContext from '../utils/appContext.jsx';
import StatusBar from '../component/statusBar.jsx'

function Component() {
    const navigate = useNavigate();
    const { policyId } = useParams();
    const { agentContext } = useContext(AgentContext);

    const { data, isLoading } = useQuery({
        queryKey: ['sentDetails-' + policyId],
        queryFn: () => fetchPolicyDetails(policyId),
    });

    const processPayment = () => {
        navigate(`/proof-of-payment/${policyId}`);
    }

    const viewProofOfPayment = (proofUrl) => {
        // Open a new tab/window with the specified URL
        window.open(proofUrl);
        
    }

    return(
        <>
            <StatusBar title="Quotation Details"/>
            {isLoading ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <>
                    <div className='sent-details'>
                        <div className='details'>
                            <div className='title space-betweenX'>
                                <span>Status</span>
                                <span>{data.policy_status}</span>
                            </div>
                        </div>
                        
                        <div className='details'>
                            <div className='title'>Cover Date</div>
                            <div className='space-betweenX'>
                                <span className='label'>Start Date</span>
                                <span className='text-end'>{firebaseTimestampToDisplayDateFormat(data.start_date)}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Expiry Date</span>
                                <span className='text-end'>{firebaseTimestampToDisplayDateFormat(data.expiry_date)}</span>
                            </div>
                            
                        </div>
                        
                        <div className='details'>
                            <div className='title'>Assured Details</div>
                            <div className='space-betweenX'>
                                <span className='label'>Full Name</span>
                                <span className='text-end'>{data.fname + ' ' + data.mname + ' ' + data.lname}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Address</span>
                                <span className='text-end'>{data.address1} {data.barangay_name} {data.city_name} {data.province_name}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Email</span>
                                <span className='text-end'>{data.email}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Mobile No.</span>
                                <span className='text-end'>{data.mobile_no}</span>
                            </div>

                            </div>
                        
                        <div className='details'>
                            <div className='title'>Insured Unit Details</div>
                            <div className='space-betweenX'>
                                <span className='label'>MV File No.</span>
                                <span className='text-end'>{data.mv_file_no}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Plate No.</span>
                                <span className='text-end'>{data.plate_no}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Engine No.</span>
                                <span className='text-end'>{data.engine_no}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Chassis No.</span>
                                <span className='text-end'>{data.chassis_no}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Make</span>
                                <span className='text-end'>{data.make}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Sub Model</span>
                                <span className='text-end'>{data.sub_model}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Model Year</span>
                                <span className='text-end'>{data.model_year}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Color</span>
                                <span className='text-end'>{data.color}</span>
                            </div>
                            { data.type_of_use == "MOTORCYCLE" && (
                                <div className='space-betweenX'>
                                    <span className='label'>Type of Use</span>
                                    <span className='text-end'>{data.type_of_use}</span>
                                </div>
                            )}
                            
                        </div>
                        
                        <div className='details'>
                            <div className='title'>Amount Breakdown</div>
                            <div className='space-betweenX'>
                                <span className='label'>Net Premium</span>
                                <span className='text-end'>{currencyFormat(data.net_premium)}</span>
                            </div>
                            <div className='space-betweenX'>
                                <span className='label'>Tax and Fees</span>
                                <span className='text-end'>{currencyFormat(data.tax_and_fees)}</span>
                            </div>
                            <div className='space-betweenX mt-2 fw-bold'>
                                <span className='label'>Total Amount</span>
                                <span className='text-end'>PHP {currencyFormat(data.gross_premium)}</span>
                            </div>
                        </div>

                        <div className='mx-3 my-4'>
                            { data.policy_status == "For Payment" ? (
                                <>
                                <button type="button" className="btn btn-primary w-100" onClick={processPayment}>Submit Proof of Payment</button>
                                <button type="button" className="btn btn-primary w-100 my-3" onClick="">View Policy Schedule</button>
                                </>
                            ) : data.policy_status === "Completed" ? (
                                <button type="button" className="btn btn-primary w-100 mb-3" onClick="">Download Policy Schedule</button>
                            ) : (
                                <>
                                <button type="button" className="btn btn-primary w-100" onClick={() => viewProofOfPayment(data.payment_ref_no)}>View Proof of Payment</button>
                                <button type="button" className="btn btn-primary w-100 my-3" onClick={processPayment}>Resend Proof of Payment</button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Component