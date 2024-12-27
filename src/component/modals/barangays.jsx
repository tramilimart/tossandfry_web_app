import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

const MyModal = ({ onClose, onSave, provinceName, cityCode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [barangays, setBarangays] = useState([]);
  const isOpen = new URLSearchParams(location.search).get('barangay') === 'true';

  useEffect(() => {
    setIsLoading(true);
    const fetchCities = async () => {
      try {
        const api_endpoint = provinceName == 'NCR' 
        ? `https://psgc.cloud/api/cities/${cityCode}/barangays` 
        : `https://psgc.cloud/api/cities-municipalities/${cityCode}/barangays`;
        const response = await axios.get(api_endpoint);
        const sortedBarangays = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setBarangays(sortedBarangays);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [cityCode]);

  const handleSave = (code, name) => {
    onSave({'code': code,
            'name': name});
    handleClose();
  };
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>Select Barangay</span>
        <i className="bi bi-x-lg" onClick={handleClose}></i>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {isLoading ? (
          <>
            <div className='ml-1'>
              <i className='spinner-border spinner-border-sm'></i>
            </div>
          </>
        ) : (
          <ul className="list-group">
            {barangays.map((brgy) => (
              <li
                className="list-group-item my-modal-list-item"
                key={brgy.code}
                onClick={() => handleSave(brgy.code, brgy.name)}
              >
                {brgy.name}
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
