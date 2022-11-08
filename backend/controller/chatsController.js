const expressAsyncHandler = require("express-async-handler");
const chats = require("../data/data");
const Chat = require("../models/chat.model");
const User = require("../models/user.mode");

const findandcreate = expressAsyncHandler(async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        res.status(404).send("please add the user id to create chat with");
    }
    var checkifChatthere = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: user_id } } },
      ],
    })
      .populate("users", "-password")
        .populate("latestMessage");
    
    if (checkifChatthere) {
        checkifChatthere = await User.populate(checkifChatthere, {
          path: "latestMessage.sender",
          select: "name email avatar",
        });
    }
    
    if (checkifChatthere) {
       res.status(200).send(checkifChatthere);
    } else {
        
        try {
            const data = {
                chatName: "sender",
                isGroupChat: false,
                users: [user_id, req.user._id],
            };
            
            const createedChat = await Chat.create(data);
            const getChat = await Chat.findById({
              _id: createedChat._id,
            }).populate("users", "-password");
            res.status(200).send(getChat);
        } catch (error) {
                    res
                      .status(401)
                      .send(`Somthing went Wrong ${error.message}`);
        }
    }
})

module.exports = {findandcreate}