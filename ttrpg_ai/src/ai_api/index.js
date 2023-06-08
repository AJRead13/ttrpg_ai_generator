// require('dotenv').config()
// import { Configuration, OpenAIApi } from "openai";
// const configuration = new Configuration({
//     organization: "",
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

const openaiApi = require('./openAiApi');

const userInput = 'User input goes here'; // Replace with the actual user input

(async () => {
  try {
    const response = await openaiApi(userInput);
    console.log(response);
    // Process and handle the API response as needed
  } catch (error) {
    // Handle errors
  }
})();
