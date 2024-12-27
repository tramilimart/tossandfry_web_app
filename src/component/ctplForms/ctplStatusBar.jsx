import React from 'react';
import { useNavigate } from 'react-router-dom';
import useClearLocalStorage from '../../utils/clearStorage.js'; 

function Component({position, title}) {
  const navigate = useNavigate();
  const clearLocalStorage = useClearLocalStorage();

  const navigateBack = () => {
    if(position == 1) {
      clearLocalStorage();
    }
    navigate(-1);
  };

  return (
    <div className='status-bar'>
        <div className='d-flex align-items-center'>
            <i className="bi bi-arrow-left-short cur-p h0" onClick={navigateBack}></i>
            <span className="mx-2 mb-1">{title}</span>
        </div>
        <div className='stepper'>
          <span className={position >= 1 ? 'dot-position dot-active' : 'dot-position'}>1</span>
          <span className={position >= 2 ? 'dot-position dot-active' : 'dot-position'}>2</span>
          <span className={position >= 3 ? 'dot-position dot-active' : 'dot-position'}>3</span>
        </div>
    </div>
  );
}

export default Component;
