import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import prompts from './prompts.json';
import PromptButton from './PromptButton';
import LogEntry from './LogEntry';
import env from "react-dotenv";

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState(prompts);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('logEntries'));
    if (storedEntries) {
      setLogEntries(storedEntries);
    }
  }, []);

  const refreshEntry = async (index) => {
    const prompt = logEntries[index];
      let data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "You are a tabletop rpg content description generator. You provide descriptions for items, characters and places based on a prompt, a list of possible keywords, as well as a theme and ruleset. Names that are capitalized should be enclosed in brackets."
          },
          {
            "role": "user",
            "content": "Prompt: Magic Item; Keywords: Sword, Frost; Theme: Medieval Fantasy; Ruleset: Dungeons & Dragons 5th Edition;"
          },
          {
            "role": "system",
            "content": "[The Sword of Freezing]: a +1 magical longsword made by the giant [Golak stormbane] in the [Fridged North]. On a hit, deals an additional 1d6 frost damage."
          },
          {
            "role": "user",
            "content": `Prompt: ${prompt}; Theme: Medieval Fantasy; Ruleset: Dungeons & Dragons 5th Edition;`
          }
        ]
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.openai.com/v1/chat/completions',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': process.env.OPENAI_API_KEY
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const newEntry = response.data.choices[0].message.content.trim();
        const updatedEntries = [...logEntries];
        updatedEntries[index] = newEntry;
        setLogEntries(updatedEntries);
        localStorage.setItem('logEntries', JSON.stringify(updatedEntries));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteEntry = (index) => {
    const updatedEntries = [...logEntries];
    updatedEntries.splice(index, 1);
    setLogEntries(updatedEntries);
    localStorage.setItem('logEntries', JSON.stringify(updatedEntries));
  };

  const handlePromptButtonClick = async (prompt) => {
    let data = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "You are a tabletop rpg content description generator. You provide descriptions for items, characters and places based on a prompt, a list of possible keywords, as well as a theme and ruleset. Names that are capitalized should be enclosed in brackets."
        },
        {
          "role": "user",
          "content": "Prompt: Magic Item; Keywords: Sword, Frost; Theme: Medieval Fantasy; Ruleset: Dungeons & Dragons 5th Edition;"
        },
        {
          "role": "system",
          "content": "[The Sword of Freezing]: a +1 magical longsword made by the giant [Golak stormbane] in the [Fridged North]. On a hit, deals an additional 1d6 frost damage."
        },
        {
          "role": "user",
          "content": `Prompt: ${prompt}; Theme: Medieval Fantasy; Ruleset: Dungeons & Dragons 5th Edition;`
        }
      ]
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/chat/completions',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': 'Bearer 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'
      },
      data : data
    };

    axios.request(config)
    .then((response) => {
      const newEntry = response.data.choices[0].message.content.trim();
      const updatedEntries = [...logEntries, newEntry];
      setLogEntries(updatedEntries);
      localStorage.setItem('logEntries', JSON.stringify(updatedEntries));
    })
    .catch((error) => {
      console.error(error);
    });
  };  

  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = prompts.filter((prompt) =>
      prompt.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPrompts(filtered);
  };
  

  return (
    <Container className="dark-theme">
      <Form.Control
        type="text"
        placeholder="Search prompts"
        value={searchTerm}
        onChange={handleSearchInputChange}
      />
      <div>
        {filteredPrompts.map((prompt, index) => (
          <PromptButton
            key={index}
            prompt={prompt}
            onClick={() => handlePromptButtonClick(prompt)}
          />
        ))}
      </div>
      <div>
        {logEntries.map((entry, index) => (
          <LogEntry
            key={index}
            entry={entry}
            onRefresh={() => refreshEntry(index)}
            onDelete={() => deleteEntry(index)}
            onPromptClick={handlePromptButtonClick}
          />
        ))}
      </div>
    </Container>
  );
};

export default App;