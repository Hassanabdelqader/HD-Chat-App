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
const path = require("path")
connectDB();

app.use(cors());



app.use("/api/user", user);

app.use("/api/chat", chatRoutes);

app.use("/api/messages", messagesRoutes);

// Start deplyment Codes *********************

const _dirname1 = path.resolve();
if (process.env.NODE_ENV === "productions") {
  app.use(express.static(path.join(_dirname1, "/frontend/build")));
  app.get("*", (req,res) => {
    res.sendFile(
      path.resolve(
        _dirname1,
        "frontend",
        "build",
        "index.html"
      )
    );
  })
} else {
  app.get("/", (req, res) => {
    res.status(200).send("Hello Home");
  });
}
  // End of deployment *********************

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
  console.log("");

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
    console.log("")
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("start typing", (room) => {
    socket.in(room).emit("start typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessage) => {
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
