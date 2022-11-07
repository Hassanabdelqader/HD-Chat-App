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
             res.status(401);
             throw new Error("The user is already there");
        }
    
        const user = await User.create({
            name,email,password,pic
        })
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.name,
                token : generateToken(user._id)
            })
        } else {
            res.status(404);
            throw new Error("somtheing went wrong while creating the user ");
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

module.exports = { handleSignup, handleSignin };