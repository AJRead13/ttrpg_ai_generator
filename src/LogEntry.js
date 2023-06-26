import React, { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const LogEntry = ({ entry, onDelete, onPromptClick }) => {
  const [selectedWords, setSelectedWords] = useState('');

  const handleWordSelection = (e) => {
    const selectedText = window.getSelection().toString();
    setSelectedWords(selectedText);
  };

  const handleWordSubmit = () => {
    onPromptClick(selectedWords.trim());
    setSelectedWords('');
  };

  const handleDelete = () => {
    onDelete(entry.id);
  }

  const renderEntryText = (text) => {
    const words = text.split(' ');

    return words.map((word, index) => (
      <span key={index} onMouseUp={handleWordSelection} onTouchEnd={handleWordSelection}>
        {word}{' '}
      </span>
    ));
  };

  const date = new Date(entry.timestamp);
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const formattedDate = date.toLocaleString(undefined, options);

  return (
    <Card className="m-4">
      <Card.Header>
        <Stack direction="horizontal" gap={2}>
          <p>{formattedDate}</p>
          <p className="text-muted">|</p>
          <p>{entry.prompt}</p>
          {entry.keywords && (<><p className="text-muted">|</p><p className="text-italic">{entry.keywords}</p></>)}
        </Stack>
      </Card.Header>
      <Card.Body>
        <div className="log-entry-content">{renderEntryText(entry.response)}</div>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        {/* <Button variant="primary" onClick={onRefresh}>
          Refresh
        </Button> */}
        <Button className="m-2" variant="outline-primary" onClick={handleWordSubmit} disabled={!selectedWords}>Elaborate on {selectedWords}</Button>
        <Button className="m-2" variant="outline-danger" onClick={handleDelete}>
          <Trash /> Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default LogEntry;
