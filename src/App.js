import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Tabs, Tab, Button, Modal, Form, Stack } from 'react-bootstrap';
import { Plus, BoxArrowDown, Trash } from 'react-bootstrap-icons';
import themes from './themes.json';
import PromptButton from './PromptButton';
import LogEntry from './LogEntry';

// placeholder for api
import { getNewPrompt } from './api.js';

const App = () => {
  const [stories, setStories] = useState([]);
  const [activeStoryId, setActiveStoryId] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [addStoryModalActive, setAddStoryModalActive] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [newStoryValidated, setNewStoryValidated] = useState(false);
  const [deleteStoryModalActive, setDeleteStoryModalActive] = useState(false);
  const [deleteStoryId, setDeleteStoryId] = useState('');

  function exportToCSV() {
    const activeStory = stories.filter(story => story.id === activeStoryId)[0];
    console.log(activeStory.log);
    //eslint-disable-next-line
    const csvContent = `data:text/csv;charset=utf-8,${activeStory.title}\n${getThemeNameFromStoryId(activeStory.id)}\n\nStory Log:\nTimestamp,Prompt,Keywords,Response\n` + activeStory.log.map(log => [log.timestamp, `"${log.prompt.replace('"', '\"')}"`, (log.keywords)?`"${log.keywords.replace('"', '\"')}"`:'', `"${log.response.replace('"', '\"')}"`].join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ttrpg_prompts_story_log.csv');
    document.body.appendChild(link);
    link.click();
  }

  const getThemeNameFromStoryId = (story_id) => {
    const story = stories.find(story => story.id === story_id);
    if (story) {
      const theme = themes.find(theme => theme.id === story.theme);
      if (theme) {
        return theme.name;
      }
    }
    return '';
  };
  

  // const getThemeNameFromStoryId = (story_id) => {
  //   return themes.filter(theme => theme.id === stories.filter(story => story.id === story_id)[0].theme)[0].name;
  // };
  
  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('stories'));
    if (savedStories && savedStories.length) {
      setStories(savedStories);
      const savedActiveStoryId = JSON.parse(localStorage.getItem('activeStoryId'));
      if (savedActiveStoryId) {
        setActiveStoryId(+savedActiveStoryId);
      }
    } else {
      setAddStoryModalActive(true);
    }
    
  }, []);

  useEffect(() => {
    const activeStory = stories.filter(story => story.id === activeStoryId);
    if (activeStory.length) {
      const theme_id = activeStory[0].theme;
      const activeTheme = themes.filter(theme => theme.id === theme_id);
      setPrompts(activeTheme[0].prompts);
    }
  }, [activeStoryId, stories]);

  useEffect(() => {
    setFilteredPrompts(prompts);
  }, [prompts]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setNewStoryValidated(true);
    } else {
      setNewStoryValidated(true);
      addStory();
    }

  };

  const addStory = () => {
    const newStory = {
      id: Math.floor(Date.now()),
      title: title,
      theme: +selectedTheme,
      log: []
    }
    const updatedStories = [...stories, newStory];
    setStories(updatedStories);
    resetNewStoryForm()
    setAddStoryModalActive(false);
    setActiveStoryId(+newStory.id);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
  };

  const resetNewStoryForm = () => {
    setTitle('');
    setSelectedTheme('');
    setNewStoryValidated(false);
  };

  const handleDeleteStoryButtonClick = (event) => {
    const id = event.target.dataset.id;
    setDeleteStoryModalActive(true);
    setDeleteStoryId(+id);
  };

  const handleDeleteStoryButtonCancel = () => {
    setDeleteStoryId('');
    setDeleteStoryModalActive(false);
  };

  const deleteStory = () => {
    const updatedStories = [...stories].filter(story => story.id !== deleteStoryId);
    setStories(updatedStories);
    setActiveStoryId(+updatedStories[0].id);
    setDeleteStoryId('');
    setDeleteStoryModalActive(false);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
  };

  const handleChangeActiveStory = (id) => {
    setActiveStoryId(+id);
    localStorage.setItem('activeStoryId', JSON.stringify(id));
  };

  const handleAddStoryButtonClick = () => {
    setAddStoryModalActive(true);
  };

  const handleAddStoryButtonCancel = () => {
    setAddStoryModalActive(false);
    resetNewStoryForm()
  };

  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = prompts.filter(prompt => prompt.toLowerCase().includes(term.toLowerCase()));
    setFilteredPrompts(filtered);
  };

  const renderPromptButtons = () => {
    const sortedPrompts = filteredPrompts.sort((a, b) => a.localeCompare(b));
  
    return sortedPrompts.map((prompt, index) => (
      <PromptButton
        key={index}
        prompt={prompt}
        onPromptClick={(p, k) => handlePromptButtonClick(p, k, false)}
      />
    ));
  };

  const handlePromptButtonClick = async (prompt, keywords, elaboration = false) => {
    setLoading(true);
    const newEntry = await getNewPrompt(prompt, keywords, elaboration, stories.filter(obj => (obj.id === activeStoryId)));
    if (newEntry) {
      const updatedStories = [...stories].map(story => {
        if (story.id === activeStoryId) {
          story.log = [...story.log, newEntry];
        }
        return story;
      });
      setStories(updatedStories);
      localStorage.setItem('stories', JSON.stringify(updatedStories));
    }
    setLoading(false);
  }

  const handleDeleteEntryButtonClick = (log_id) => {
    const updatedStories = [...stories].map(story => {      
      if (story.id === activeStoryId) {
        story.log = [...story.log].filter(log => log.id !== log_id);
      }
      return story;
    });
    setStories(updatedStories);
    localStorage.setItem('stories', JSON.stringify(updatedStories));
  }
  
  const handleElaborateButtonClick = (prompt) => {
    handlePromptButtonClick(prompt, null, true);
  }

  return (
    <>
      <Container>
        <div className="my-2">
          <h1>TTRPG Prompts</h1>
        </div>
        <Tabs 
          className="mx-1 flex-column flex-lg-row"
          fill 
          activeKey={activeStoryId}
          onSelect={(i) => {
            const id = parseInt(i);
            if ([...stories.map(x => x.id )].includes(id)) {
              handleChangeActiveStory(id);
            } else {
              handleAddStoryButtonClick();
            }
          }}
        >
          {stories.map(story => (
            <Tab key={story.id} eventKey={story.id} title={<><span className="tab-title">{story.title}</span><span className="tab-subtitle">{getThemeNameFromStoryId(story.id)}</span></>}>
              <Card>
                <Card.Header>
                  <Stack className="my-2" direction="horizontal" gap={3}>
                    <Form.Control 
                      className="me-auto" 
                      placeholder="Search prompts..." 
                      value={searchTerm}
                      onChange={handleSearchInputChange} />
                    <Button className="text-nowrap" variant="outline-primary" title="Download story log." onClick={exportToCSV}><BoxArrowDown /> Download</Button>
                    <Button className="text-nowrap" variant="outline-danger" title="Delete story." data-id={story.id} onClick={handleDeleteStoryButtonClick}><Trash /> Delete</Button>
                  </Stack>
                </Card.Header>
                <Card.Body>
                  <Stack className="my-2 flex-wrap justify-content-center" direction="horizontal" gap={2}>
                    {renderPromptButtons()}
                  </Stack>
                  <Container>
                    <h3>Story Log</h3>
                    <hr />
                    {story.log.length > 0 && (
                      story.log.map((entry) => (
                      <LogEntry key={entry.id} entry={entry} onDelete={handleDeleteEntryButtonClick} onPromptClick={handleElaborateButtonClick} />
                    )))
                    }
                  </Container>
                </Card.Body>
              </Card>
            </Tab>
          ))}
          <Tab eventKey="-1" title={<><span className="tab-title"><Plus title="Add a new story." />Add Story</span></>}></Tab>
        </Tabs>
      </Container>
      {addStoryModalActive && (
      <Modal
        show={true}
        onHide={handleAddStoryButtonCancel}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a new story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={newStoryValidated} onSubmit={handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                required
                onChange={handleTitleChange}
              />
              <Form.Control.Feedback type="invalid">
                Enter a title for your story.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="theme">
              <Form.Label>Theme</Form.Label>
              <Form.Control 
                as="select"
                required
                onChange={handleThemeChange}
              >
                <option></option>
                {themes.map(theme => (
                  <option key={`theme_id_${theme.id}`} value={theme.id}>{theme.name}</option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Select a theme for this story.
              </Form.Control.Feedback>
            </Form.Group>
            <Stack direction="horizontal" className="justify-content-center mt-4" gap={3}>
              <Button type="submit" variant="outline-success">
                <Plus /> Add Story
              </Button>
              <Button type="button" variant="outline-secondary" onClick={handleAddStoryButtonCancel}>
                Cancel
              </Button>
            </Stack>
          </Form>
        </Modal.Body>
      </Modal>
      )}
      {deleteStoryModalActive && (
        <Modal
        show={true}
        onHide={handleDeleteStoryButtonCancel}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this story? You will not be able to recover the story log after deletion.</p>
          <p>If you want to save your story log, use the <span className="btn btn-sm btn-outline-primary disabled"><BoxArrowDown/> Download</span> button near the top of the page.</p>
          <Stack direction="horizontal" className="justify-content-center my-3" gap={3}>
            <Button variant="outline-danger" onClick={deleteStory}><Trash /> Delete Story</Button>
            <Button variant="outline-secondary" onClick={handleDeleteStoryButtonCancel}>Cancel</Button>
          </Stack>
        </Modal.Body>
      </Modal>
      )}
      {loading && (
        <div className="loading-overlay">
          <div>
          <Spinner animation="grow" role="status" variant="primary" className="m-2"/>
          <Spinner animation="grow" role="status" variant="primary" className="m-2" style={{ animationDelay: '100ms' }} />
          <Spinner animation="grow" role="status" variant="primary" className="m-2" style={{ animationDelay: '200ms' }} />
          <Spinner animation="grow" role="status" variant="primary" className="m-2" style={{ animationDelay: '300ms' }} />
          <Spinner animation="grow" role="status" variant="primary" className="m-2" style={{ animationDelay: '400ms' }} />
          </div>
        </div>
      )}
    </>
  );
};

export default App;
