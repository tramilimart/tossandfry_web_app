import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailInputOnly, textInputOnly } from '../utils/appUtils';
import { registerUser } from '../utils/firebaseUtils';
import { validateEmail } from '../utils/emailValidation'
import WaveBg from "../../src/assets/wave.svg";

const Component = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: 'LIMART L SALOMON',
    email: 'salomonlimart@gmail.com',
    password: 'password',
    rePassword: 'password'
  });

  const handleDataChange = (e) => {
    e.target.classList.remove('invalid');
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value
    });
    setError('');
 }  
  const handleRegister = async () => {
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
      if (userDetails.password === userDetails.rePassword) {
        const result = await validateEmail(userDetails.email);
        if(result.isValid) {
          processRegistration();
        } else {
          setError(result.message);
        }
      } else {
        setError("Password do not match.");
      }
    } else {
      setError('Please fill out all required fields.');
    }
  };

  const processRegistration = async () => {
    setLoading(true);
    try {
      const result = await registerUser(userDetails.fullName, userDetails.email, userDetails.password);
      console.log('processRegistration result', result);
      if (result.isSuccess) {
        const nextPage = 'home';
        const uid = result.uid;
        const code = result.code;
        const email = userDetails.email; 
        navigate('/verify', { state: { nextPage, uid, code, email } });
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.log('Error:', error);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <>
      <img src={WaveBg} style={{position: 'absolute', zIndex: '-1'}}/>
      <div className='center-div'>
        <div className='mt-6 mw-330px'>
          <i className="-ml-5 bi bi-arrow-left-short cur-p h0" onClick={ () => navigate('/') }></i>
          <div className='mt-3'>
            <h3><b>Register</b></h3>
            <p>Enter your Personal Information</p>
          </div>
          <div className='mt-4' ref={formRef}>
            <p className='mt-2'>Full Name</p>
            <input name="fullName" type="text" className="form-control" value={userDetails.fullName} onInput={(e) => {textInputOnly(e);}} onChange={handleDataChange} placeholder='Enter your full name'></input>
            <p className='mt-2'>Email</p>
            <input name="email" type="text" className="form-control" value={userDetails.email} onInput={(e) => {emailInputOnly(e);}} onChange={handleDataChange} placeholder='Enter your email'></input>
            <p className='mt-2'>Password</p>
            <input name="password" type="password" className="form-control" value={userDetails.password} onChange={handleDataChange} placeholder='Enter your password'></input>
            <p className='mt-2'>Confirm Password</p>
            <input name="rePassword" type="password" className="form-control" value={userDetails.rePassword} onChange={handleDataChange} onKeyDown={handleKeyDown} placeholder='Confirm your password'></input>
            {error && <p className="text-danger mt-1">{error}</p>}
            <div className='signin-btn mt-3' onClick={handleRegister}>
                {loading ? <><i className='spinner-border spinner-border-sm'></i><span>Creating Account...</span></> : <><span>Register</span></>}
            </div>
          </div>
          <p className='mt-5 text-center'>
            Already have an account? <span className='link-text' onClick={() => navigate('/')}>Signin</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Component;
