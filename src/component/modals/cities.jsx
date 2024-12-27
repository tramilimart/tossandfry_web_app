import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

const MyModal = ({ onClose, onSave, provinceName, provinceCode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const isOpen = new URLSearchParams(location.search).get('city') === 'true';
  
  useEffect(() => {
    setIsLoading(true);
    const fetchCities = async () => {
      try {
        const api_endpoint = provinceName == 'NCR' 
        ? 'https://psgc.cloud/api/regions/1300000000/cities'
        : `https://psgc.cloud/api/provinces/${provinceCode}/cities-municipalities`;
        const response = await axios.get(api_endpoint);
        const sortedCities = response.data.sort((a, b) => a.name.localeCompare(b.name));
        setCities(sortedCities);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, [provinceCode]);

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
        <span>Select City</span>
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
            {cities.map((city) => (
              <li
                className="list-group-item my-modal-list-item"
                key={city.code}
                onClick={() => handleSave(city.code, city.name)}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
