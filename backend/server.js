// const cors = require("cors");
const express = require('express'); 
const app = express();
const cors = require("cors");
app.use(express.json());
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const user = require("./routes/userRoutes");
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler, notFound } = require('./middleware/errormiddleware');
connectDB();

app.use(cors()); 

app.get('/', (req, res) => {

    res.status(200).send("Hello Home");
})

app.use('/api/user',user)

app.use("/api/chat",chatRoutes);


app.use(notFound)
app.use(errorHandler);




const PORT = process.env.PORT || 3002;

app.listen(PORT,console.log('the app is running on PORT ', PORT))
