import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, google_provider, facebook_provider, signInWithPopup } from '../firebase';

const FacebookLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  
  const handleFacebookLogin = () => {
    
  if (!facebook_provider) {
    console.error('Facebook provider is not initialized.');
    return;
  }
    signInWithPopup(facebook_provider)
      .then((result) => {
        // Handle successful login
        console.log('Facebook login successful', result.user);
        navigate('/home');
      })
      .catch((error) => {
        // Handle errors
        console.error('Error signing in with Facebook:', error);
      });
  };

  return (    
    <button type="button" className="btn my-btn-red" onClick={handleFacebookLogin}>
        {loading ? <><i className="spinner-border spinner-border-sm"></i>Loading...</> : <><i className="bi bi-facebook"></i>Sign in with Facebook</>}
    </button>
  );
};

export default FacebookLogin;
