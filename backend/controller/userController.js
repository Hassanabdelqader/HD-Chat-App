const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/user.mode");

const handleSignup = expressAsyncHandler(async (req, res) => {
    try {
        
        const { name, email, password, pic } = req.body;
    
        if (!name || !email || !password) {
            res.status(400)
            throw new Error("PLease Fill all data")
        }
    
        const checkUser = await User.findOne({ email })
        if (checkUser) {
             res.status(401).json({ msg: "The user is already there" });
        }
    
        const user = await User.create({
          name,
          email,
          password,
          avatar:pic,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token : generateToken(user._id)
            })
        } else {
            res
              .status(402)
              .json({ msg: "somtheing went wrong while creating the user " });
       
        }
    } catch (error) {
        console.log("Hassan ~ file: userController.js ~ line 34 ~ error", error)
        
        res.status(404).send(error.message)
    }

})

const handleSignin = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("Hassan ~ file: userController.js ~ line 46 ~ user", user)
    
    if (user && (await user.checkauth(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(404).json({ msg: "there is noi user " });
    }


})

const getUser = expressAsyncHandler(async (req, res) => {

  const query = req.query.search;
  if (!query) {
   return res.status(200).send("Enter query to search for somthing ")
  }
  const regex = new RegExp(query, "i");
    searchQuery = {
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };
   
  const users =await User.find(searchQuery).find({ _id: { $ne: req.user._id } })
  res.status(200).json({users})
  
})

module.exports = {
  handleSignup, handleSignin, getUser};