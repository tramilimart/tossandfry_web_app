import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useServiceUtils, numAndTextInput, textInputOnly, numInputOnly, allInput } from '../../utils/appUtils.js';
import { addVehicle } from '../../store/vehicleSlice.jsx';
import { addAssured } from '../../store/assuredSlice.jsx';
import CtplStatusBar from './ctplStatusBar.jsx';
import YearModal from '../modals/modalYear.jsx';
import TypeOfUseModal from '../modals/typeOfUse.jsx';

function Component({ policyType, existingPolicyId }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const serviceUtils = useServiceUtils();
  const [ errorMessage, setErrorMessage ] = useState('');
  const vehicleSlice = useSelector((state) => state.vehicle);
  const assuredSlice = useSelector((state) => state.assured);
  const coverSlice = useSelector((state) => state.cover);

  const [vehicleDetails, setVehicleDetails] = useState({
    policy_type: policyType,
    mv_file_no: vehicleSlice.mv_file_no,
    plate_no: vehicleSlice.plate_no,
    engine_no: vehicleSlice.engine_no,
    chassis_no: vehicleSlice.chassis_no,
    make: vehicleSlice.make,
    sub_model: vehicleSlice.sub_model,
    model_year: vehicleSlice.model_year,
    color: vehicleSlice.color,
    type_of_use: vehicleSlice.type_of_use,
    net_premium: serviceUtils.getServicePremium(policyType).net_premium,
    tax_and_fees: serviceUtils.getServicePremium(policyType).tax_and_fees,
    gross_premium: serviceUtils.getServicePremium(policyType).gross_premium,
  });
  const handleVehicleInfoDataChange = (e) => {
      e.target.classList.remove('invalid');
      const { name, value } = e.target;
        setVehicleDetails({
            ...vehicleDetails,
            [name]: value.toUpperCase()
        });
      setErrorMessage('');
  };

  const gotoNext = () => {
    const formElements = Array.from(formRef.current.querySelectorAll('input, select'));
    let firstInvalidElement = null;
    let isFormValid = true;

    formElements.forEach((element) => {
      if (element.type !== 'button' && !element.value && element.name !== 'color') {
        element.classList.add('invalid');
        if (!firstInvalidElement) {
          firstInvalidElement = element;
        }
        isFormValid = false;
      } else {
        element.classList.remove('invalid');
      }
    });

    if (!isFormValid) {
      //setErrorMessage('Please fill out all required fields.');
      if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth' });
        firstInvalidElement.focus();
      }
    } else { 
      setErrorMessage('');
      localStorage.setItem("vehicleDtls", JSON.stringify(vehicleDetails))
      dispatch(addVehicle(vehicleDetails)); 
      navigate(`/ctpl/${policyType.split('-')[1]}/2/${existingPolicyId}`);
    }
  };
  
  const [yearModal, setYearModal] = useState(false);
  const openYearModal = () => {
    navigate('?yearModel=true');
    setYearModal(true);
  };
  const closeYearModal = () => {
    setYearModal(false);
  };
  const setSelectedYear = (value) => {
    const field = document.getElementById("model_year")
    field.classList.remove('invalid');
    setVehicleDetails({
      ...vehicleDetails,
      model_year: value
    });
  };
  const [typeOfUseModal, setTypeOfUseModal] = useState(false);
  const openTypeOfUseModal = () => {
    navigate('?typeOfUse=true');
    setTypeOfUseModal(true);
  };
  const closeTypeOfUseModal = () => {
    setTypeOfUseModal(false);
  };
  const setSelectedTypeOfUse = (value) => {
    const field = document.getElementById("type_of_use")
    field.classList.remove('invalid');
    setVehicleDetails({
      ...vehicleDetails,
      type_of_use: value
    });
  };

  /*console.log('coverSlice', coverSlice);
  console.log('vehicleSlice', vehicleSlice);
  console.log('assuredSlice', assuredSlice);*/
  return (
    <>
      <CtplStatusBar position={1} title={serviceUtils.getServiceLabel(policyType)} />
      <div className='fill-form-body' ref={formRef}>
        <span className='title'>Vehicle Information</span>
        <div className='field'>
          <label>MV File Number</label>
          <input name="mv_file_no" type="text" className="form-control" onInput={(e) => {numInputOnly(e);}} maxLength={15} onChange={handleVehicleInfoDataChange} placeholder='Enter MV File Number' value={vehicleDetails.mv_file_no}/>
        </div>
        <div className='field'>
          <label>Plate Number</label>
          <input name="plate_no" type="text" className="form-control" onInput={(e) => {numAndTextInput(e);}} onChange={handleVehicleInfoDataChange} placeholder='Enter Plate Number' value={vehicleDetails.plate_no}/>
        </div>
        <div className='field'>
          <label>Engine Number</label>
          <input name="engine_no" type="text" className="form-control" onInput={(e) => {numAndTextInput(e);}} onChange={handleVehicleInfoDataChange} placeholder='Enter Engine Number' value={vehicleDetails.engine_no}/>
        </div>
        <div className='field'>
          <label>Chassis Number</label>
          <input name="chassis_no" type="text" className="form-control" onInput={(e) => {numAndTextInput(e);}} onChange={handleVehicleInfoDataChange} placeholder='Enter Chassis Number' value={vehicleDetails.chassis_no}/>
        </div>

        <div className='divider'></div>

        <div className='field'>
          <label>Make</label>
          <input name="make" type="text" className="form-control" onInput={(e) => {textInputOnly(e);}} onChange={handleVehicleInfoDataChange} placeholder='Enter Make Ex. (Honda, Yamaha, BMW)' value={vehicleDetails.make}/>
        </div>
        <div className='field'>
          <label>Sub Model</label>
          <input name="sub_model" type="text" className="form-control" onInput={(e) => {allInput(e);}} onChange={handleVehicleInfoDataChange} placeholder='Enter Sub Model' value={vehicleDetails.sub_model}/>
        </div>
        <div className='field'>
          <label>Model Year</label>
          <div className="input-group">
            <input id="model_year" name="model_year" type="text" className="form-control" placeholder="Select Model Year" value={vehicleDetails.model_year} readOnly />
            <button className="btn my-btn-arrow" type="button" onClick={openYearModal}>
              <i className="bi bi-chevron-down"></i>
            </button>
            <YearModal onClose={closeYearModal} onSave={setSelectedYear}/>
          </div>
        </div>
        <div className='field'>
          <label>Color</label>
          <input name="color" type="text" className="form-control" onInput={(e) => {textInputOnly(e);}} onChange={handleVehicleInfoDataChange} placeholder='Enter Color' value={vehicleDetails.color}/>
        </div>

        {policyType == 'ctpl-mc' && (
          <div className='field'>
          <label>Type of Use</label>
          <div className="input-group">
            <input id="type_of_use" name="type_of_use" type="text" className="form-control" placeholder="Select Type of Use" value={vehicleDetails.type_of_use} readOnly />
            <button className="btn my-btn-arrow" type="button" onClick={openTypeOfUseModal}>
              <i className="bi bi-chevron-down"></i>
            </button>
            <TypeOfUseModal onClose={closeTypeOfUseModal} onSave={setSelectedTypeOfUse}/>
          </div>
        </div>
        )}
        {errorMessage && (
          <span>{errorMessage}</span>
        )}
        <div className='mb-6'></div>
      </div>
      <div className='fill-form-bottom'>
        <span></span>
        <button id="uv" type="button" className="btn btn-primary w-100" onClick={gotoNext}>Next </button>
      </div>
    </>
  );
};

export default Component;
