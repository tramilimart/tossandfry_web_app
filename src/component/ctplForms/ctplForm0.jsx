import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useServiceUtils, numAndTextInput, textInputOnly, numInputOnly, allInput } from '../../utils/appUtils.js';
import { addVehicle } from '../../store/vehicleSlice.jsx';
import StatusBar from '../statusBar.jsx';
import ScanIcon from '../../assets/icon_scan.svg'
import KeyboardIcon from '../../assets/icon_keyboard.svg'

function Component({ policyType, existingPolicyId }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const serviceUtils = useServiceUtils();

  const gotoScanner = () => {
    navigate(`/scan-image/${policyType.split('-')[1]}`);
  }
 
  const gotoForm1 = () => {
    navigate(`/ctpl/${policyType.split('-')[1]}/1`);
  }

  return (
    <>
      <StatusBar position={0} title={serviceUtils.getServiceLabel(policyType)} />
      <div className='fill-form-body text-center' ref={formRef}>
        <span className='title my-3'>How would you like to fill?</span>
          <div className='p-4'>
            <div className='scan-button' onClick={gotoScanner}>
              <img className="icon-1" src={ScanIcon} alt="" loading="lazy"/>
              <div className='d-flex flex-column text-start'>
                <span className="main-text">Scan Certificate of Registration</span>
                <span className="other-text">Information on the document will be scanned to fill the form faster</span>
              </div>
            </div>
            <div className='my-4'>OR</div>
            <div className='scan-button' onClick={gotoForm1}>
              <img className="icon-2" src={KeyboardIcon} alt="" loading="lazy"/>
              <span className="main-text text-start">Enter Vehicle Details Manually</span>
            </div>
          </div>
      </div>
    </>
  );
};

export default Component;
