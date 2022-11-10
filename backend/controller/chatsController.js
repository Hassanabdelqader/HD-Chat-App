const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chat.model");
const User = require("../models/user.mode");

const findandcreate = expressAsyncHandler(async (req, res) => {
  console.log("create")
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
    .populate({ path: "users", select: "-password" })
    .populate({ path: "latestMessage" });
    
  if (checkifChatthere) {
    checkifChatthere = await User.populate(checkifChatthere, {
      path: "latestMessage.sender",
      select: "name email avatar",
    });
  }
    
  if (checkifChatthere.length > 0) {
    res.status(200).send(checkifChatthere[0]);
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
});

const getAllChats = expressAsyncHandler(async (req, res) => {
  try {
    const Chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("latestMessage", "-password")
      .populate("groupAdmin", "-password")
      .populate("users", "-password")
      .sort({ updatedAt: -1 });
    
    //to be refactor again 
    const fetchdata = await User.populate(Chats, {
      path: "latestMessage.sender",
      select: "name email avatar",
    });
    res.status(200).json({ with: fetchdata, without: Chats });
  } catch (error) {
    res.status(404).send(`Something went Wrong ${error.message}`);
  }
  
  
  
});

const creategroup = expressAsyncHandler(async (req, res) => {
  var { name, users } = req.body;

  users = JSON.parse(users)
  
  console.log("Hassan ~ file: chatsController.js ~ line 86 ~ users", users)

  if (!name || !users) {
    res.status(400).send("please Fill all Data");
  }
  
  if (users.length < 3) {
    res.status(401).send("Group should be more than 2");
  }
  users.push(req.user);
 
  const group = await Chat.create({
    chatName: name,
    isGroupChat: true,
    users,
    groupAdmin : req.user,
  });

  const populateedGroup = await Chat.findById({ _id: group._id })
    .populate("users", "-password")
    .populate("groupAdmin" , "-password"); 
res.status(201).send(populateedGroup)

});

const renamegroup = expressAsyncHandler(async (req, res) => {
  const { name, chat_id } = req.body;
  if (!name || !chat_id) {
        res.status(401).send("please add the user id to create chat with");
      }
      const updated = await Chat.findByIdAndUpdate(
        chat_id,
        {
          chatName: name,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    if(!updated){
      res.status(404).send("Error , there is no Chat with this found");
    } else {
      res.status(202).send(updated);
    }
    
})

const addtogroup = expressAsyncHandler(async (req, res) => {
  const { chat_id, user_id } =  req.body;
  if (!user_id || !chat_id) {
    res.status(401).send("please add the user id to create chat with");
  }

  const updated = await Chat.findByIdAndUpdate(
    chat_id,
    {
      $addToSet: {users:user_id }
      // $push: { users: user_id },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
 if (!updated) {
   res.status(404).send("there is no such Group ");
 } else {
   res.status(200).send(updated);
 }

});
const removeFromgroup = expressAsyncHandler(async (req, res) => {
   const { chat_id, user_id } = req.body;
   if (!user_id || !chat_id) {
     res.status(401).send("please add the user id to rmeove from chat ");
   }

   const updated = await Chat.findByIdAndUpdate(
     chat_id,
     {
       $pull: { users: user_id },
     },
     {
       new: true,
     }
   )
     .populate("users", "-password")
     .populate("groupAdmin", "-password");

   if (!updated) {
     res.status(404).send("there is no such Group ");
   } else {
     res.status(200).send(updated);
   }
});


module.exports = { findandcreate, renamegroup, addtogroup, removeFromgroup, getAllChats, creategroup };
