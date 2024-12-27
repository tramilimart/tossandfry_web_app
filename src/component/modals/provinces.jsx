import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import axios from 'axios';

const MyModal = ({ onClose, onSave }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const isOpen = new URLSearchParams(location.search).get('province') === 'true';

  useEffect(() => {
    setIsLoading(true);
    const fetchProvinces = async () => {
      try {
        console.log('fetching provinces...');
        const response = await axios.get('https://psgc.cloud/api/provinces');
        const newProvince = { code: '1300000000', name: 'NCR' };
        const sortedProvinces = [...response.data, newProvince].sort((a, b) => a.name.localeCompare(b.name));
        setProvinces(sortedProvinces);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

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
      <span>Select Province</span>
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
            {provinces.map((province) => (
              <li
                className="list-group-item my-modal-list-item"
                key={province.code}
                onClick={() => handleSave(province.code, province.name)}
              >
                {province.name}
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
