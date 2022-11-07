const { handleSignup, handleSignin } = require('../controller/userController');

const route = require('express').Router();

route.post("/signup", handleSignup);
route.post("/login", handleSignin);

module.exports = route;