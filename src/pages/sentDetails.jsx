import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { fetchPolicyDetails, updatePolicyStatusById } from '../utils/firebaseUtils.js';
import { useQuery } from '@tanstack/react-query';
import { useServiceUtils, currencyFormat, firebaseTimestampToDisplayDateFormat, firebaseTimestampToInputDateFormat } from '../utils/appUtils.js';
import StatusBar from '../component/statusBar.jsx'
import { addCover } from '../store/coverSlice.jsx';
import { addAssured } from '../store/assuredSlice.jsx';
import { addVehicle } from '../store/vehicleSlice.jsx';
import { addStatus } from '../store/statusSlice.jsx';
import ConfirmModal from '../component/modals/okCancelModal.jsx';

function Component() {
    const { policyId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const serviceUtils = useServiceUtils();
    const [isCancelQuotationLoading, setCancelQuotationLoading] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['sentDetails-' + policyId],
        queryFn: () => fetchPolicyDetails(policyId),
    });

    const updateDetails = async () => {
        dispatch(addVehicle({
            mv_file_no: data.mv_file_no,
            plate_no: data.plate_no,
            engine_no: data.engine_no,
            chassis_no: data.chassis_no,
            make: data.make,
            sub_model: data.sub_model,
            model_year: data.model_year,
            color: data.color,
            type_of_use: data.type_of_use,
            policy_type: data.type,
            gross_premium: data.gross_premium
        }));
        dispatch(addAssured({
            fname: data.fname,
            mname: data.mname,
            lname: data.lname,
            email: data.email,
            mobile_no: data.mobile_no,
            province_name: data.province_name,
            province_code: data.province_code,
            city_name: data.city_name,
            city_code: data.city_code,
            barangay_name: data.barangay_name,
            barangay_code: data.barangay_code,
            address1: data.address1,
        }));
        
        const statusDtls = {
            policy_status: data.policy_status,
        }
        dispatch(addStatus(statusDtls));
        localStorage.setItem("statusDtls", JSON.stringify(statusDtls))

        const coverDtls = {
            start_date: firebaseTimestampToInputDateFormat(data.start_date),
            expiry_date: firebaseTimestampToInputDateFormat(data.expiry_date),
        }
        dispatch(addCover(coverDtls));
        localStorage.setItem("coverDtls", JSON.stringify(coverDtls))

        navigate(serviceUtils.getServicePage(data.policy_type) + '/' + policyId);
    }

    const cancelQuotation = (id) => {
        openConfirmModal();
    }
    const [confirmModal, setConfirmModal] = useState(false);
    const openConfirmModal = () => {
      navigate('?confirm=true');
      setConfirmModal(true);
    };
    const closeConfirmModal = () => {
      setConfirmModal(false);
    };
    const setSelectedConfirmation = async (value) => {
        if(value === 'Y') {
            setCancelQuotationLoading(true);
            await updatePolicyStatusById(policyId, 'Cancelled');
            navigate(-1);
        }
    };

    return(
        <>
            <StatusBar title="Quotation Details"/>
            {isLoading ? (
                <div className='center-loading'>
                    <i className='spinner-border'></i><p>Loading...</p>
                </div>
            ) : (
                <>
                    <ConfirmModal onClose={closeConfirmModal} onSave={setSelectedConfirmation} title='Confirm Cancel' message='Do you want to cancel this quotation?'/>
                    
                    <div className="note mx-2 mt-2">
                        <span>This quotation has been sent and is currently awaiting encoding and issuance by our underwriters.</span>
                    </div>
                    
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
                            <button type="button" className="btn btn-primary w-100" onClick={updateDetails}>Update Details</button>
                            <button type="button" className="btn btn-primary w-100 mt-3" onClick={cancelQuotation}>
                                {isCancelQuotationLoading ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Loading...</>) : (<>Cancel Quotation</>)}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Component