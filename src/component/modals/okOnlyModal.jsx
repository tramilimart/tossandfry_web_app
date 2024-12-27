import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const MyModal = ({ onClose, onSave, title, message }) => {
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get('ok') === 'true';

  const handleAgree = () => {
    handleClose();
    onSave('Y');
  };
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>{title}</span>
        <i className="bi bi-x-lg" onClick={handleClose}></i>
      </Modal.Header>
      <Modal.Body>
        <span>{message}</span>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={handleAgree}>OK</button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
