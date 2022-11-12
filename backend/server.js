// const cors = require("cors");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const user = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const { errorHandler, notFound } = require("./middleware/errormiddleware");
connectDB();

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Hello Home");
});

app.use("/api/user", user);

app.use("/api/chat", chatRoutes);

app.use("/api/messages", messagesRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;

const server = app.listen(
  PORT,
  console.log("the app is running on PORT ", PORT)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: `${process.env.ENDPOINT}`,
  },
});

io.on("connection", (socket) => {
  console.log("connected to server ");

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("joined with Room " + room);
  });

  socket.on("start typing", (room) => {
    socket.in(room).emit("start typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessage) => {
    console.log(newMessage);
    var chat = newMessage.chat;
    if (!chat.users) return console.log("user is not defind ");

    chat.users.forEach((user) => {
      if (user._id == newMessage.sender._id) return;

      socket.in(user._id).emit("got message", newMessage);
    });
  });

    socket.on("setup", (user) => {
      socket.join(user._id);
      socket.emit("connected");
    });

    socket.off("setup", (user) => {
        socket.leave(user._id)
    })
    
});
