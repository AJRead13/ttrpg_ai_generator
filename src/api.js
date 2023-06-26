import axios from 'axios';
import themes from './themes.json';

export const getNewPrompt = async (prompt, keywords = null, elaboration = false, story) => {

  story = story[0];
  const activeThemes = themes.filter(theme => theme.id === story.theme);
  const theme = activeThemes[0];

  let messages = [
    {"role": "system", "content": "I am a story telling generator that works off of your prompts and feedback. I am best used as a companion for tabletop roleplaying games by providing randomly generated descriptions, names and details of characters, monsters, magical items, places, geographic features, quests, puzzles, and many other elements. Ask me to generate something and I will do my best to give you a brief but detailed description using unique names that are thematically appropriate to your story."},
    {"role": "system", "content": "Before we get started, what is your story title and theme?"},
    {"role": "user", "content": `My story is titled ${story.title}, the theme is ${theme.name}.`},
    {"role": "system", "content": "Ask me to generate something or to elaborate on something I've already written."}
  ];
  story.log.forEach(entry => {
    if (entry.elaboration) {
      messages.push({"role": "user", "content": `Elaborate on the following, while providing unique names for characters, places and things if applicable: ${entry.prompt}.`});
    } else {
      messages.push({"role": "user", "content": `Generate a ${entry.prompt}${(entry.keywords !== null) ? " using the following keywords: " + entry.keywords : ''}.`});
    }
    messages.push({"role": "system", "content": entry.response});
  });
  if (elaboration) {
    messages.push({"role": "user", "content": `Elaborate on the following, while providing unique names for characters, places and things if applicable: ${prompt}`});
  } else {
    messages.push({"role": "user", "content": `Generate a "${prompt}"${(keywords !== null) ? " using the following keywords: " + keywords : ''}.`});
  }

  let data = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages
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

  return axios.request(config)
  .then((response) => {
    const text = response.data.choices[0].message.content.trim();
    const newEntry = {
      id: Math.floor(Date.now()),
      timestamp: new Date(),
      elaboration,
      prompt,
      keywords,
      response: text
    };
    return newEntry;
  })
  .catch((error) => {
    console.error(error);
    return false;
  });
};

