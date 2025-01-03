import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, google_provider, signInWithPopup } from '../../utils/firebaseConnect';
import GoogleIcon from '../../assets/icon_google.svg';

const GoogleButton = () => {
    const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, google_provider);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className='signin-btn google-btn' onClick={handleSignIn}>
        {loading ? <><i className='spinner-border spinner-border-sm'></i><span>Authenticating...</span></> : <><img src={GoogleIcon}/><span>Sign In with Google</span></>}
    </div>
  );
};

export default GoogleButton;
