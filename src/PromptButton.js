import React, { useState } from 'react';
import { Button, ButtonGroup, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { ThreeDotsVertical, Pen } from 'react-bootstrap-icons';

const PromptButton = ({ prompt, onPromptClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [keywords, setKeywords] = useState('');

  const handlePromptSubmit = () => {
    onPromptClick(prompt, keywords);
    setShowModal(false);
    setKeywords('');
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setKeywords('');
  };

  return (
    <>
      <ButtonGroup className='m-1'>
        <Button variant="light" onClick={() => onPromptClick(prompt)}>{prompt}</Button>
        <Button variant="light" onClick={handleModalOpen}>
          <ThreeDotsVertical />
        </Button>
      </ButtonGroup>
      

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Generate {prompt}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label>Keywords</Form.Label>
          <InputGroup>
            <FormControl
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="outline-primary" onClick={handlePromptSubmit}>
            <Pen /> Generate
          </Button>
          <Button variant="outline-secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PromptButton;
