import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const MyModal = ({ onClose, onSave, title, message }) => {
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get('confirm') === 'true';

  const handleAgree = () => {
    handleCancel();
    onSave('Y');
  };
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>{title}</span>
        <i className="bi bi-x-lg" onClick={handleCancel}></i>
      </Modal.Header>
      <Modal.Body>
        <span>{message}</span>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={handleAgree}>Yes</button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
