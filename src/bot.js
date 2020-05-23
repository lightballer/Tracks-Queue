'use strict';


const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js');
const token = config.token; 
const bot = new TelegramBot(token, { polling: true });


const channelId = config.channelId;
const channelName = config.channelName;
const five5minutes = 300000;
const one1minute = 60000;
const twenty20seconds = 20000;
let tracksQueue;

fs.readFile('database.json', 'utf-8', (error, data) => {
  if(error) return;
  if(data == undefined) tracksQueue = [];
  else tracksQueue = JSON.parse(data);
} );


const writeToDatabase = delay => {
  setInterval(() => {
    const serialized = JSON.stringify(tracksQueue)
    fs.writeFile('database.json', serialized, (error) => {
      if(error) return;
    });
  }, delay);
};

writeToDatabase(twenty20seconds);

bot.on('audio', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Audio received');
  tracksQueue.push(msg.message_id);
});

bot.onText(/\/publish/, (msg) => {
  const chatId = msg.chat.id;
  let trackId;
  try {
    trackId = tracksQueue.shift();
    console.log('Posted track with id: ' + trackId);
    bot.forwardMessage(channelId, chatId, trackId);
    // bot.editMessageCaption('hello', {
    //   chat_id: chatId,
    //   message_id: track_id
    // }); 
// doesn't work 
  } catch (e) {
    console.log('Empty queue!');
  }
});

