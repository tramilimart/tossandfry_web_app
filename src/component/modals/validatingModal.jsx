import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const MyModal = ({ onClose}) => {
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get('validating') === 'true';

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>Analyzing</span>
      </Modal.Header>
      <Modal.Body>
        <span><i className="spinner-border spinner-border-sm mr-2"></i>Please wait! Analyzing photo...</span>
      </Modal.Body>
    </Modal>
  );
};

export default MyModal;
