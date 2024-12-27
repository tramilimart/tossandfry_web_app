import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { textInputOnly, emailInputOnly, numInputOnly, allInput, useServiceUtils } from '../../utils/appUtils.js';
import { addAssured } from '../../store/assuredSlice.jsx';
import CtplStatusBar from './ctplStatusBar.jsx';
import ProvinceModal from '../modals/provinces.jsx';
import CityModal from '../modals/cities.jsx';
import BarangayModal from '../modals/barangays.jsx';

function Component({ policyType, existingPolicyId }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const serviceUtils = useServiceUtils();
  const [errorMessage, setErrorMessage] = useState('');
  const assuredSlice = useSelector((state) => state.assured);

  console.log(policyType);

  const [assuredDtls, setAssuredDtls] = useState({
    fname: assuredSlice.fname,
    mname: assuredSlice.mname,
    lname: assuredSlice.lname,
    email: assuredSlice.email,
    mobile_no: assuredSlice.mobile_no,
    province_name: assuredSlice.province_name,
    province_code: assuredSlice.province_code,
    city_name: assuredSlice.city_name,
    city_code: assuredSlice.city_code,
    barangay_name: assuredSlice.barangay_name,
    barangay_code: assuredSlice.barangay_code,
    address1: assuredSlice.address1,
  });

  const handleAssuredInfoDataChange = (e) => {
      e.target.classList.remove('invalid');
      const { name, value } = e.target;
      setAssuredDtls({
          ...assuredDtls,
          [name]: name === 'email' ? value : value.toUpperCase()
      });
      setErrorMessage('');
  };
  const gotoNext = () => {
    const formElements = Array.from(formRef.current.querySelectorAll('input, select'));
    let firstInvalidElement = null;
    let isFormValid = true;

    formElements.forEach((element) => {
      if (element.type !== 'button' && !element.value) {
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
      localStorage.setItem("assuredDtls", JSON.stringify(assuredDtls))
      dispatch(addAssured(assuredDtls)); 
      navigate(`/ctpl/${policyType.split('-')[1]}/3/${existingPolicyId}`);
    }
  };

  const [provinceModal, setProvinceModal] = useState(false);
  const openProvinceModal = () => {
    navigate('?province=true');
    setProvinceModal(true);
  };
  const closeProvinceModal = () => {
    setProvinceModal(false);
  };
  const setSelectedProvince = (value) => {
    const field = document.getElementById("province")
    field.classList.remove('invalid');
    setAssuredDtls({
      ...assuredDtls,
      province_name: value.name,
      province_code: value.code,
      city_name: '',
      city_code: '',
      barangay_name: '',
      barangay_code: '',
      address1: ''
    });
  };

  const [cityModal, setCityModal] = useState(false);
  const openCityModal = () => {
    navigate('?city=true');
    setCityModal(true);
  };
  const closeCityModal = () => {
    setCityModal(false);
  };
  const setSelectedCity = (value) => {
    const field = document.getElementById("city")
    field.classList.remove('invalid');
    setAssuredDtls({
      ...assuredDtls,
      city_name: value.name,
      city_code: value.code,
      barangay_name: '',
      barangay_code: '',
      address1: ''
    });
  };

  const [barangayModal, setBarangayModal] = useState(false);
  const openBarangayModal = () => {
    navigate('?barangay=true');
    setBarangayModal(true);
  };
  const closeBarangayModal = () => {
    setBarangayModal(false);
  };
  const setSelectedBarangay = (value) => {
    const field = document.getElementById("barangay")
    field.classList.remove('invalid');
    setAssuredDtls({
      ...assuredDtls,
      barangay_name: value.name,
      barangay_code: value.code,
      address1: ''
    });
  };
  return (
    <>
      <CtplStatusBar position={2} title={serviceUtils.getServiceLabel(policyType)} />
      <div className='fill-form-body' ref={formRef}>
        <span className='title'>Assured Information</span>
        <div className='field'>
            <label>Name</label>
            <input name="fname" type="text" className="form-control" onInput={(e) => {textInputOnly(e);}} onChange={handleAssuredInfoDataChange} placeholder='First Name' value={assuredDtls.fname}/>
            <input name="mname" type="text" className="form-control mt-1" onInput={(e) => {textInputOnly(e);}} onChange={handleAssuredInfoDataChange} placeholder='Middle Name' value={assuredDtls.mname}/>
            <input name="lname" type="text" className="form-control mt-1" onInput={(e) => {textInputOnly(e);}} onChange={handleAssuredInfoDataChange} placeholder='Last Name' value={assuredDtls.lname}/>
        </div>
        <div className='field'>
            <label>Email Address</label>
            <input name="email" type="text" className="form-control" onInput={(e) => {emailInputOnly(e);}} onChange={handleAssuredInfoDataChange} placeholder='sample@email.com' value={assuredDtls.email}/>
        </div>
        <div className='field'>
            <label>Mobile Number</label>
            <input name="mobile_no" type="text" className="form-control" onInput={(e) => {numInputOnly(e);}} maxLength={11} onChange={handleAssuredInfoDataChange} placeholder='09...' value={assuredDtls.mobile_no}/>
        </div>

        <div className='divider'></div>
        
        <div className='field'>
          <label>Province</label>
          <div className="input-group">
            <input id="province" name="province" type="text" className="form-control" placeholder="Select Province" value={assuredDtls.province_name} readOnly />
            <button className="btn my-btn-arrow" type="button" onClick={openProvinceModal}>
              <i className="bi bi-chevron-down"></i>
            </button>
            <ProvinceModal onClose={closeProvinceModal} onSave={setSelectedProvince}/>
          </div>
        </div>
        {assuredDtls.province_name && 
         assuredDtls.province_code && (
          <div className='field'>
            <label>City</label>
            <div className="input-group">
              <input id="city" name="city" type="text" className="form-control" placeholder="Select City" value={assuredDtls.city_name} readOnly />
              <button className="btn my-btn-arrow" type="button" onClick={openCityModal}>
                <i className="bi bi-chevron-down"></i>
              </button>
              <CityModal onClose={closeCityModal} onSave={setSelectedCity} provinceName={assuredDtls.province_name} provinceCode={assuredDtls.province_code}/>
            </div>
          </div>
        )}
        {assuredDtls.province_name && 
         assuredDtls.province_code &&
         assuredDtls.city_name && 
         assuredDtls.city_code && (
          <div className='field'>
            <label>Barangay</label>
            <div className="input-group">
              <input id="barangay" name="barangay" type="text" className="form-control" placeholder="Select Barangay" value={assuredDtls.barangay_name} readOnly />
              <button className="btn my-btn-arrow" type="button" onClick={openBarangayModal}>
                <i className="bi bi-chevron-down"></i>
              </button>
              <BarangayModal onClose={closeBarangayModal} onSave={setSelectedBarangay} provinceName={assuredDtls.province_name} cityCode={assuredDtls.city_code}/>
            </div>
          </div>
        )}
        {assuredDtls.province_name && 
         assuredDtls.province_code &&
         assuredDtls.city_name && 
         assuredDtls.city_code &&
         assuredDtls.barangay_name && 
         assuredDtls.barangay_code && (
          <>
            <div className='field'>
              <label>Address 1</label>
              <input name="address1" type="text" className="form-control" onInput={(e) => {allInput(e);}} onChange={handleAssuredInfoDataChange} placeholder='Room #, Bldg Name, Street, Cluster, Purok...' value={assuredDtls.address1}/>
            </div>
          </>
        )}
        {errorMessage && (
          <span>{errorMessage}</span>
        )}
        <div className='mb-6'></div>
      </div>
      <div className='fill-form-bottom'>
            <button id="uv" type="button" className="btn btn-primary w-100" onClick={gotoNext}>Next</button>
      </div>
    </>
  );
}

export default Component;