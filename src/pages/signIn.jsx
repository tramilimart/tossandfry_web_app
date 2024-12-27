import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailInputOnly } from '../utils/appUtils';
import { auth, signInWithEmailAndPassword } from '../utils/firebaseConnect';

import GoogleButton from "../component/buttons/google_auth_btn";
import LoginIcon from "../../src/assets/icon_login.svg";
import EmailIcon from '../../src/assets/icon_email1.svg';
import WaveBg from "../../src/assets/wave.svg";

const SignInPage = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signInDetails, setSignInDetails] = useState({
    email: '',
    password: ''
  });
  
  const handleDataChange = (e) => {
    e.target.classList.remove('invalid');
    const { name, value } = e.target;
    setSignInDetails({
      ...signInDetails,
      [name]: value
    });
    setError('');
  }  

  const handleSignIn = async () => {
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
      try {
          const result = await signInWithEmailAndPassword(auth, signInDetails.email, signInDetails.password);
          console.log(result);
          if(!result.user.emailVerified) {
            const uid = result.user.uid;
            const email = result.user.email; 
            navigate('/verify', { state: { uid, email } });
          }
          setLoading(false);
      } catch (error) {
          console.log('error', error);
          setError('Invalid email or password.');
          setLoading(false);
      }
    } else {
      setError('Fill out all required fields.');
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <>
      <img src={WaveBg} style={{position: 'absolute', zIndex: '-1'}}/>
      <div className='center-div'>
        <div className='mt-6 mw-330px'>
          <h3>Welcome to <b>CTPL-Agent</b></h3>
          <p>Join us as an agent and start earning your commissions today!</p>          
          <div className='mt-5'>
            <div className='field' ref={formRef}>
              <p className="mt-1">Email</p>
              <input name="email" type="text" className="form-control" value={signInDetails.email} onInput={(e) => {emailInputOnly(e);}} onChange={handleDataChange} placeholder='Enter your email'></input>
              <p className="mt-1">Password</p>
              <input name="password" type="password" className="form-control" value={signInDetails.password} onChange={handleDataChange} onKeyDown={handleKeyDown} placeholder='Enter your password'></input>
              
              <div className="space-betweenX">
                <p className="text-danger text-start mt-1">{error}</p>
                <p className="link-text text-end mt-1 text-gray" onClick={() => navigate('/forgotPassword')}>Forgot password?</p>
              </div>
              
              <div className='signin-btn mt-3' onClick={handleSignIn}>
                  {loading ? <><i className='spinner-border spinner-border-sm'></i><span>Authenticating...</span></> : <><img src={EmailIcon}/><span>Sign In with Email</span></>}
              </div>
            </div>
          </div>

          <div className="or-container">
              <div className="or-line"></div>
              <div className="or-text">OR</div>
          </div>

          <div className='mt-3'>
            <GoogleButton/>
          </div>

          <p className='mt-5 text-center'>Don't have an account? <span className='link-text' onClick={() => navigate('/register')}>Register</span></p>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
