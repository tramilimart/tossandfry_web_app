import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updatePassword } from '../utils/appUtils';
import {  } from '../utils/firebaseUtils';
import WaveBg from "../../src/assets/wave.svg";
import OkOnlyModal from '../component/modals/okOnlyModal';

const Component = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; 
  const [okOnlyModal, setOkOnlyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordDetails, setPasswordDetails] = useState({
    password: '',
    rePassword: ''
  });

  const handleDataChange = (e) => {
    e.target.classList.remove('invalid');
    const { name, value } = e.target;
    setPasswordDetails({
      ...passwordDetails,
      [name]: value
    });
    setError('');
 }  
  const handleRegister = async () => {
    setLoading(true);
    const formElements = Array.from(formRef.current.querySelectorAll('input'));
    let isFormValid = true;

    formElements.forEach((element) => {
      if (element.type !== 'button' && !element.value) {
        element.classList.add('invalid');
        isFormValid = false;
      } else {
        element.classList.remove('invalid');
      }
    });
    
    if (isFormValid) {
      if (passwordDetails.password === passwordDetails.rePassword) {
        const updateResult = await updatePassword(email, passwordDetails.password);
        if (updateResult.isSuccess) {

          // Add 'disabled' class to the button
          const button = document.querySelector('.signin-btn');
          button.classList.add('disabled');
          button.style.pointerEvents = 'none';

          openOkOnlyModal();
        } else {
          setError(updateResult.message);
        }
      } else {
        setError("Password do not match.");
      }
    } else {
      setError('Please fill out all required fields.');
    }
    setLoading(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };
  const openOkOnlyModal = () => {
    navigate('?ok=true');
    setOkOnlyModal(true);
  };
  const closeOkOnlyModal = () => {
      setOkOnlyModal(false);
      setTimeout(() => {
        window.location.href = '/';
      }, 0);
  };
  const setSelectedConfirmation = async () => {
    setTimeout(() => {
      window.location.href = '/';
    }, 0);
  };

  return (
    <>

      <OkOnlyModal onClose={closeOkOnlyModal} onSave={setSelectedConfirmation} title='Success' message='Your password has been changed successfully.' />

      <img src={WaveBg} style={{position: 'absolute', zIndex: '-1'}}/>
      <div className='center-div'>
        <div className='mt-6 mw-330px'>
          <i className="-ml-5 bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
          <div className='mt-3'>
            <h3><b>Set a new password</b></h3>
            <p>Create new password. Ensure it differs from previous one for security.</p>
          </div>
          <div className='mt-4' ref={formRef}>
            <p className='mt-2'>Password</p>
            <input name="password" type="password" className="form-control" value={passwordDetails.password} onChange={handleDataChange} placeholder='Enter your password'></input>
            <p className='mt-2'>Confirm Password</p>
            <input name="rePassword" type="password" className="form-control" value={passwordDetails.rePassword} onChange={handleDataChange} onKeyDown={handleKeyDown} placeholder='Confirm your password'></input>
            {error && <p className="text-danger mt-1">{error}</p>}
            <div className='signin-btn mt-3' onClick={handleRegister}>
                {loading ? <><i className='spinner-border spinner-border-sm'></i><span>Updating Password...</span></> : <><span>Update Password</span></>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Component;
