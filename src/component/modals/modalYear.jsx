import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const MyModal = ({ onClose, onSave }) => {
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get('yearModel') === 'true';

  const handleSave = (year) => {
    onSave(year);
    handleClose();
  };
  const handleClose = () => {
    navigate(-1);
  };
  const years = [];
  const toYear = new Date().getFullYear() + 1;
  for (let year = toYear; year >= 1990; year--) {
    years.push(year);
  }
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>Select Year Model</span>
        <i className="bi bi-x-lg" onClick={handleClose}></i>
      </Modal.Header>
      <Modal.Body>
      <ul className="list-group">
          {years.map((year) => (
            <li
              className="list-group-item my-modal-list-item"
              key={year}
              onClick={() => handleSave(year)}
            >
              {year}
            </li>
          ))}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
