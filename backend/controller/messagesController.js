const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.mode");


const handleSendMessage = expressAsyncHandler(async (req, res) => {
    try {
        const { content, chat_id } = req.body;
          if (!content || !chat_id) {
            return res.sendStatus(404);
          }
        

        const newMessage = {
          sender: req.user._id,
          content,
          chat: chat_id,
        };
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name avatar");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name avatar email",
        });

        await Chat.findByIdAndUpdate(chat_id, {
          latestMessage: message,
        });

        res.status(201).send(message);

    } catch (error) {
    console.log("Hassan ~ file: messagesController.js ~ line 21 ~ error", error)
    res.status(500).send(error)    
    }
});

const handleGetMessage = expressAsyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const messages = await Message.find({ chat: id })
            .populate("sender", "email avatar name")
            .populate("chat")
        
        res.status(200).send(messages)


    } catch (error) {
        res.status(404).send(error)
    }
})

module.exports = { handleSendMessage, handleGetMessage };





