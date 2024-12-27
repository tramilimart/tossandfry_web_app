import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat } from '../../utils/appUtils'

function Component() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
   
    const handleSubmit = async (e) => {

    };

    return(
        <>
            <div className="commission-div">
                <div className="comm-amt">
                    <span>COMMISION AMOUNT</span>
                    <span>₱ {currencyFormat(1500)}</span>
                </div>
                <button type="button" className="btn my-btn-dark btn-w" onClick={handleSubmit}>
                    {loading ? <><i className="spinner-border spinner-border-sm"></i> Loading...</> : <>View Summary</>}
                </button>
            </div>
        </>
    )
}

export default Component