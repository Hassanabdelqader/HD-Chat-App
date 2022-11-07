// const cors = require("cors");
const express = require('express'); 
const chats = require('./data/data');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.get('/', (req, res) => {

    res.status(200).send("Hello Home");
})

app.get('/api/chat', (req, res) => {
    res.status(200).json({
        chats
    })
})

app.get("/api/chat/:id", (req, res) => {
    const chat = chats.find(chat => chat._id === req.params.id)
    if (chat) {
        res.status(200).json({
          chat,
        });
        
    } else {
       res.status(203).json({
         msg : "No chat with this ID ",
       });
     
    }
});




const PORT = process.env.PORT || 3002;

app.listen(PORT,console.log('the app is running on PORT ', PORT))
