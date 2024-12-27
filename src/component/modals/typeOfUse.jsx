import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const MyModal = ({ onClose, onSave }) => {
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get('typeOfUse') === 'true';

  const handleSave = (year) => {
    onSave(year);
    handleClose();
  };
  const handleClose = () => {
    navigate(-1);
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>Select Type of Use</span>
        <i className="bi bi-x-lg" onClick={handleClose}></i>
      </Modal.Header>
      <Modal.Body>
        <ul className="list-group">
            <li
              className="list-group-item my-modal-list-item"
              onClick={() => handleSave("MOTORCYCLE")}
            >
              MOTORCYCLE
            </li>
            <li
              className="list-group-item my-modal-list-item"
              onClick={() => handleSave("PRIVATE TRICYCLE")}
            >
              PRIVATE TRICYCLE
            </li>
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
