import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendVerificationCode, generateRandomCode, emailInputOnly } from '../utils/appUtils';
import { getUserIdByEmail, updateVerificationCodeById } from '../utils/firebaseUtils';
import WaveBg from "../../src/assets/wave.svg";

const Component = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendCode();
    }
    setError('');
  };

  const handleSendCode = async () => {
    setLoading(true);
    const userResult = await getUserIdByEmail(email);
    console.log('userResult', userResult);
    if (userResult.isSuccess) {
      const uid = userResult.uid;
      const code = generateRandomCode();
      const sendResult = await sendVerificationCode(email, code);
      console.log('sendResult', sendResult);
      if (sendResult.isSuccess) {
        const updateResult = await updateVerificationCodeById(uid, code);
        console.log('updateResult', updateResult);
        if (updateResult.isSuccess) {

          // Add 'disabled' class to the button
          const button = document.querySelector('.signin-btn');
          button.classList.add('disabled');  
          button.style.pointerEvents = 'none';

          const nextPage = 'updatePassword';
          navigate('/verify', { state: { nextPage, uid, code, email } });
        } else {
          setError(updateResult.message);
          setLoading(false);
        }
      } else {
        setError(sendResult.message);
        setLoading(false);
      }
    } else {
      setError(userResult.message);
      setLoading(false);
    }
  }

  return (
    <>
      <img src={WaveBg} style={{position: 'absolute', zIndex: '-1'}}/>
      <div className='center-div'>
        <div className='mt-6 mw-330px'>
          <i className="-ml-5 bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
          <div className='mt-5'>
            <h3><b>Forgot password</b></h3>
            <p>Please enter your email to reset password.</p>
          </div>
          <div className='mt-4' ref={formRef}>
            <p className='mt-2'>Email</p>
            <input type="text" className="form-control" value={email} onInput={(e) => {emailInputOnly(e);}} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder='Enter you email'></input>
          </div>
          {error && <p className="text-danger mt-1">{error}</p>}
          <div className='signin-btn mt-3' onClick={handleSendCode}>
              {loading ? <><i className='spinner-border spinner-border-sm'></i><span>Sending...</span></> : <><span>Send Verification Code</span></>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Component;
