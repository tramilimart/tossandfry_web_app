import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Component() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const viewMoreServices = (e) => {
        const button = document.getElementById(e.target.id);
        button.innerHTML = '<i className="spinner-border spinner-border-sm"></i>Loading...';
    };

    return(
        <div className="other-service-div mb-5">
            <span className='title'>Other Insurance</span>
            <div className='details-div'>
                <div className='details-item'>
                    <div className='item-icon'>
                        <img src="/assets/icon_crash_car_512.png" alt="" loading="lazy"/>
                    </div>
                    <span>Compre</span>
                </div>
                <div className='details-item'>
                    <div className='item-icon'>
                        <img src="/assets/icon_bicycle_512.png" alt="" loading="lazy"/>
                    </div>
                    <span>Bicycle</span>
                </div>
                <div className='details-item'>
                    <div className='item-icon'>
                        <img src="/assets/icon_travel_512.png" alt="" loading="lazy"/>
                    </div>
                    <span>Travel</span>
                </div>
                <div className='details-item'>
                    <div className='item-icon'>
                        <img src="/assets/icon_fire_512.png" alt="" loading="lazy"/>
                    </div>
                    <span>Property</span>
                </div>
            </div>

            <div className='button-div'>
                <button id="view-more-services" type="button" className="btn my-btn-red-lg" onClick={viewMoreServices}>View more services</button>
            </div>
        </div>
    )
}

export default Component