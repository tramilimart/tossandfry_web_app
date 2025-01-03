import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, facebook_provider, signInWithPopup } from '../../utils/firebaseConnect';
import FacebookIcon from '../../assets/fb_icon.svg';

const FacebookButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);

    try {
      await signInWithPopup(auth, facebook_provider);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className='signin-btn facebook-btn' onClick={handleSignIn}>
      {loading ? (
        <>
          <i className='spinner-border spinner-border-sm'></i>
          <span>Authenticating...</span>
        </>
      ) : (
        <>
          <img src={FacebookIcon} alt="Facebook Icon" />
          <span>Sign In with Facebook</span>
        </>
      )}
    </div>
  );
};

export default FacebookButton;
