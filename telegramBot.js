import { Bot } from "grammy";

import * as dotenv from 'dotenv'

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Register listeners to handle messages
bot.on("message:text", async (ctx) => {
    const response = await callGPTAPI(ctx.message.text);
    ctx.reply("GPT-3.5: " + response)});
    
// Start the bot (using long polling)
bot.start();

async function callGPTAPI(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = "https://api.openai.com/v1/chat";
  
    const headers = {
      "Authorization": `Bearer ${apiKey}`
    };
  
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: `${prompt}\n`}],
      temperature: 0.5
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const responseData = await response.json();
      const generatedText = responseData.choices[0].message.content;
      return generatedText;
    } catch (error) {
      console.error(`Error calling GPT API: ${error}`);
    }
  }

export default bot