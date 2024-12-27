import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Component({title}) {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div className='status-bar'>
        <div className='d-flex align-items-center'>
            <i className="bi bi-arrow-left-short cur-p h0" onClick={navigateBack}></i>
            <span className="mx-2 mb-1">{title}</span>
        </div>
    </div>
  );
}

export default Component;
