import React from 'react';
import Button from 'react-bootstrap/Button';

const LogEntry = ({ entry, onRefresh, onDelete, onPromptClick }) => {
  const renderEntryText = (text) => {
    const regex = /\[(.*?)\]/g;
    const matches = text.match(regex);
    if (matches) {
      const parts = text.split(regex);
      return parts.map((part, index) => {
        if (matches.includes(`[${part}]`)) {
          return (
            <Button
              key={index}
              variant="link"
              onClick={() => onPromptClick(part)}
            >
              {part}
            </Button>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      });
    } else {
      return text;
    }
  };

  return (
    <div className="log-entry">
      <p>{renderEntryText(entry)}</p>
      <Button variant="secondary" onClick={onRefresh}>
        Refresh
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};

export default LogEntry;