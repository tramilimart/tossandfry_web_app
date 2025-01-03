import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useServiceUtils, getUserIpAddress, getFormattedDate } from '../../utils/appUtils.js';
import { insertPolicyDetails, updatePolicyDetails, updatePolicyStatusById } from '../../utils/firebaseUtils.js';
import { addCover } from '../../store/coverSlice.jsx';
import { addAssured } from '../../store/assuredSlice.jsx';
import { addStatus } from '../../store/statusSlice.jsx';
import AgentContext from '../../utils/appContext.jsx';
import ToastContext from '../../utils/toastContext.jsx';
import CtplStatusBar from './ctplStatusBar.jsx';
import useClearLocalStorage from '../../utils/clearStorage.js'; 

function Component({ policyType, existingPolicyId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clearLocalStorage = useClearLocalStorage();
  const serviceUtils = useServiceUtils();
  const { agentContext } = useContext(AgentContext);
  const { showToast } = useContext(ToastContext);
  const vehicleSlice = useSelector((state) => state.vehicle);
  const assuredSlice = useSelector((state) => state.assured);
  const coverSlice = useSelector((state) => state.cover);
  const statusSlice = useSelector((state) => state.status);
  const [isSendQuoteLoading, setSendQuoteLoading] = useState(false);
  const [isSaveDraftLoading, setSaveDraftLoading] = useState(false);
  const [isUpdateDtlsLoading, setUpdateDtlsLoading] = useState(false);
  const [coverDetails, setCoverDetails] = useState({
    start_date: coverSlice.start_date,
    expiry_date: coverSlice.expiry_date,
  });

  const handleYearInfoDataChange = (e) => {
    e.target.classList.remove('invalid');
    const { name, value } = e.target;

    // Calculate the expiry date by adding 1 year to the start date
    const startDate = new Date(value);
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(startDate.getFullYear() + 1);

    // Convert the expiry date back to a string in the format yyyy-mm-dd
    const expiryDateString = expiryDate.toISOString().split('T')[0];
    setCoverDetails({
      start_date: value,
      expiry_date: expiryDateString,
    });
    dispatch(addCover({ start_date: value, expiry_date: expiryDateString }));
  }

  const saveDraft = async(e) => {
    setSaveDraftLoading(true);
      if (existingPolicyId) {
        updateFirebaseData('Draft');
      } else {
        insertFirebaseData('Draft');
      }
  };

  const sendQuote = async(e) => {
    setSendQuoteLoading(true);
    if (existingPolicyId) {
      updateFirebaseData('For Issuance');
    } else {
      insertFirebaseData('For Issuance');
    }
  };

  const insertFirebaseData = async(status) => {
    insertPolicyDetails(status, agentContext.agent.uid, assuredSlice, vehicleSlice, coverSlice)
    .then((policyId) => {
      if (policyId) {
        clearLocalStorage();
        if(status === 'Draft') {
          showToast("Successfully save to drafts.", 'success');
        } else {
          showToast("Successfully sent for issuance.", 'success');
        }
        navigate('/');
      } else {
        showToast("Failed to save changes.", 'error');
      }
    })
    .catch((error) => {
      showToast("Failed to save changes.", 'error');
    });
  }
  
  const updateFirebaseData = async (status) => {
    updatePolicyDetails(status, existingPolicyId, assuredSlice, vehicleSlice, coverSlice)
    .then((policyId) => {
      if (policyId) {
        clearLocalStorage();
        if(status === 'Draft') {
          showToast("Successfully save to drafts.", 'success');
        } else {
          showToast("Successfully sent for issuance.", 'success');
        }
        navigate('/');
      } else {
        showToast("Failed to save changes.", 'error');
      }
    })
    .catch((error) => {
      showToast("Failed to save changes.", 'error');
    });
  }

  const updateDetails = async () => {
    try {
        setUpdateDtlsLoading(true);
        updatePolicyDetails('For Issuance', existingPolicyId, assuredSlice, vehicleSlice, coverSlice)
          .then((policyId) => {
            if (policyId) {
              clearLocalStorage();
              showToast("Successfully saved changes.", 'success');
              navigate('/');
            } else {
              showToast("Failed to save changes.", 'error');
            }
          })
          .catch((error) => {
            showToast("Failed to save changes.", 'error');
          });
    } catch (error) {
      showToast("Failed to save changes.", 'error');
    }
  }

  return (
    <>
      <CtplStatusBar position={3} title={serviceUtils.getServiceLabel(policyType)} />
      <div className='fill-form-body'>
        <span className='note'>
          Important Note: The coverage date for CTPL insurance should be determined based on the last digit of your vehicle's plate number.
        </span>
        <div className='field mt-3'>
          <label>1-Year Policy Date</label>
          <div className="input-group mb-2">
            <span className="input-group-text w-25">Start</span>
            <input name="start_date" type="date" className="form-control" onChange={handleYearInfoDataChange} value={coverDetails.start_date}/>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text w-25">Expire</span>
            <input name="expiry_date" type="date" className="form-control" onChange={handleYearInfoDataChange} value={coverDetails.expiry_date}/>
          </div>
        </div>
      </div>
      
      <div className='mx-3 my-4 d-grid gap-3'>
        { statusSlice.policy_status === 'For Issuance' ? (
          <button type="button" className="btn btn-primary w-100" onClick={updateDetails}>
            {isUpdateDtlsLoading ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Saving...</>) : (<>Save</>)}
          </button>
        ) : (
          <>
          <button type="button" className="btn btn-primary w-100" onClick={sendQuote}>
            {isSendQuoteLoading ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Sending...</>) : (<>Send for Issuance</>)}
          </button>
          <button type="button" className="btn btn-primary w-100" onClick={saveDraft}>
            {isSaveDraftLoading ? (<><i className="spinner-border spinner-border-sm mr-1"></i>Saving...</>) : (<>Save to Draft</>)}
          </button>
          </>
        )}
      </div>
    </>
  );
}

export default Component;