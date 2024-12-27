import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
//import { useDispatch } from 'react-redux';
//import { clearUser } from '../store/userSlice';

const Component = () => {
  const navigate = useNavigate();
  //const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return (
    <button type="button" className="btn my-btn-dark" onClick={handleLogout}>
        {loading ? <><i className="spinner-border spinner-border-sm"></i>Loading...</> : <><i className="bi bi-box-arrow-left mr-1"></i>Logout</>}
    </button>
  );
};

export default Component;
