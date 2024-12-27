import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendVerificationCode, verifyUserEmail, numInputOnly } from '../utils/appUtils';
import { checkVerificationCode } from '../utils/firebaseUtils';
import WaveBg from "../../src/assets/wave.svg";

const Component = () => {
  const location = useLocation();
  const { nextPage, uid, code, email } = location.state || {}; 
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState(null);
  const [codes, setCodes] = useState({
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: ''
  });

  const handleDataChange = (e) => {
    e.target.classList.remove('invalid');
    const { name, value } = e.target;
    setCodes({
      ...codes,
      [name]: value
    });
    setError('');
    setResendMessage('');
 }  
  const handleVerification = async () => {
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
        const verificationCode = `${codes.code1}${codes.code2}${codes.code3}${codes.code4}${codes.code5}`;
        const verifyResult = await checkVerificationCode(uid, verificationCode);
        if(verifyResult.isVerified) {
          const emailResult = await verifyUserEmail(uid);
          if(emailResult.isSuccess) {
            
            // Add 'disabled' class to the button
            const button = document.querySelector('.signin-btn');
            button.classList.add('disabled');
            button.style.pointerEvents = 'none';

            gotoNextPage();
          } else {
            setError(emailResult.message);
            setLoading(false);
          }
        } else {
          setError(verifyResult.message);
          setLoading(false);
        }
    } else {
      setError('Please fill out all required fields.');
      setLoading(false);
    }
  };
  const gotoNextPage = () => {
    if(nextPage === 'home') {
      setTimeout(() => {
        window.location.href = '/';
      }, 0);
    } else {
      navigate('/updatePassword', { state: { email } });
    }
  }

  const handleKeyDown = (e) => {
    const isLastInput = e.target.name === 'code5';
    // Trigger verification only if Enter is pressed on the last input field
    if (e.key === 'Enter' && isLastInput) {
      handleVerification();
    }
  };
  const handleKeyUp = (e) => {
    // Automatically move to the next field if a number key is pressed
    if (/^[0-9]$/.test(e.key)) {
      const nextInput = e.target.nextElementSibling;
      if (nextInput && nextInput.tagName === 'INPUT') {
        nextInput.focus(); // Move to the next input field automatically
      }
    }
  }

  const resendCode = async () => {
    setResendLoading(true);
    const result = await sendVerificationCode(email, code);
    if (result.isSuccess) {
      setResendMessage('Code successfully sent!');
    } else {
      setResendMessage(result.message);
    }
    setResendLoading(false);
  }

  return (
    <>
      <img src={WaveBg} style={{position: 'absolute', zIndex: '-1'}}/>
      <div className='center-div'>
        <div className='mt-6 mw-330px'>
          <i className="-ml-5 bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
          <div className='mt-5'>
            <h3><b>Verify Email</b></h3>
            <p>An email with verification code has been sent to {email}.</p>
          </div>
          <div className='code-input-div mt-5' ref={formRef}>
            <input name="code1" type="text" className="form-control" value={codes.code1} onInput={(e) => {numInputOnly(e);}} maxLength={1} onChange={handleDataChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}></input>
            <input name="code2" type="text" className="form-control" value={codes.code2} onInput={(e) => {numInputOnly(e);}} maxLength={1} onChange={handleDataChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}></input>
            <input name="code3" type="text" className="form-control" value={codes.code3} onInput={(e) => {numInputOnly(e);}} maxLength={1} onChange={handleDataChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}></input>
            <input name="code4" type="text" className="form-control" value={codes.code4} onInput={(e) => {numInputOnly(e);}} maxLength={1} onChange={handleDataChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}></input>
            <input name="code5" type="text" className="form-control" value={codes.code5} onInput={(e) => {numInputOnly(e);}} maxLength={1} onChange={handleDataChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}></input>
          </div>
          {error && <p className="text-danger mt-1">{error}</p>}
          <div className='signin-btn mt-3' onClick={handleVerification}>
              {loading ? <><i className='spinner-border spinner-border-sm'></i><span>Verifying...</span></> : <><span>Verify code</span></>}
          </div>
          <p className='mt-4 text-center'>
            Haven't got the email yet? <span className='link-text' onClick={resendCode}>Resend email</span>
          </p>
          <div className='mt-4 text-center text-gray'>
            { resendLoading ? 
              <i className='spinner-border spinner-border-sm'></i> 
              :
              <p>{resendMessage}</p>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default Component;
