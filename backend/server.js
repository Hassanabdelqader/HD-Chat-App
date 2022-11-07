// const cors = require("cors");
const express = require('express'); 
const app = express();
app.use(express.json());
const chats = require('./data/data');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const user = require("./routes/userRoutes");
const { errorHandler, notFound } = require('./middleware/errormiddleware');
connectDB();

app.get('/', (req, res) => {

    res.status(200).send("Hello Home");
})

app.use('/api/user',user)

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


app.use(notFound)
app.use(errorHandler);




const PORT = process.env.PORT || 3002;

app.listen(PORT,console.log('the app is running on PORT ', PORT))
