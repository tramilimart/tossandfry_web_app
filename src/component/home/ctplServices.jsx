import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat } from '../../utils/appUtils.js';
import AgentContext from '../../utils/agentContext.jsx';

function Component() {
    const navigate = useNavigate();
    const { agentContext } = useContext(AgentContext);

    const gotoForm = async (id) => {
        //const button = document.getElementById(e.target.id);
        //button.innerHTML = '<i class="spinner-border spinner-border-sm"></i>';
        navigate('/ctpl/' + id + '/0');
    };
    const viewMoreVehicle = (e) => {
        const button = document.getElementById(e.target.id);
        button.innerHTML = '<i className="spinner-border spinner-border-sm"></i>Loading...';
    };

    agentContext.services.sort((a, b) => a.gross_premium - b.gross_premium);

    return(
        <div className="services-div">
            <div className="get-ctpl-div">
                <div className='title'>Get CTPL now</div>
                <div className='ctpl-type-div'>
                    {agentContext.services.slice(0, 6).map((vehicle, index) => (
                        <div className='ctpl-item' key={index} onClick={() => gotoForm(vehicle.subline)}>
                            <div className='thumbnail'>
                                <img src={vehicle.icon} alt="" loading="lazy"/>
                            </div>
                            <div className='details'>
                                <span className='vehicle-name'>{vehicle.label.substring(4)}</span>
                                <span className='vehicle-price'>₱ {currencyFormat(vehicle.gross_premium)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Component