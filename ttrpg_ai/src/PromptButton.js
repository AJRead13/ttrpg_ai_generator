import React from 'react';
import Button from 'react-bootstrap/Button';

const PromptButton = ({ prompt, onClick }) => {
  return (
    <Button variant="outline-light" onClick={onClick}>
      {prompt}
    </Button>
  );
};

export default PromptButton;