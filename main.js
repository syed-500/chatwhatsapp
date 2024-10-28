
const { Client ,LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');



const client = new Client({    authStrategy: new LocalAuth()
});


client.once('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});
client.on('ready', () => {
        const number = "+917842134739";
    
        // Your message.
       const text = "Hey sir, this is a bot";
      
       
       const chatId = number.substring(1) + "@c.us";
      
       // Sending message.
       client.sendMessage(chatId, text);
    });

// Start your client
client.initialize();