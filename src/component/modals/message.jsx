import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

const MyModal = ({ onClose, onSave }) => {
  const navigate = useNavigate();
  const isOpen = new URLSearchParams(location.search).get('confirmDelete') === 'true';

  const handleYes = () => {
    handleCancel();
    onSave('Y');
  };
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <span>Comfirm Delete</span>
        <i className="bi bi-x-lg" onClick={handleCancel}></i>
      </Modal.Header>
      <Modal.Body>
        <span>Do you want to delete this draft?</span>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn my-btn-red-sm" onClick={handleYes}>Yes</button>
        <button type="button" className="btn my-btn-red-sm" onClick={handleCancel}>Cancel</button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
