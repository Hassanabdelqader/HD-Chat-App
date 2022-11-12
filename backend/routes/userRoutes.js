const { handleSignup, handleSignin, getUser } = require('../controller/userController');
const { isAuth } = require('../middleware/isAuth');

const route = require('express').Router();

route.post("/signup", handleSignup);
route.post("/login", handleSignin);
route.get("/users",isAuth ,getUser);

module.exports = route;