const axios = require('axios');

const openaiApi = async (userInput) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: userInput,
      max_tokens: 100,
      temperature: 0.7,
      n: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    throw error;
  }
};

module.exports = openaiApi;
