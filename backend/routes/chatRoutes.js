const { isAuth } = require("../middleware/isAuth");
const { findandcreate } = require("../controller/chatsController");

const routes = require("express").Router()

routes.post("/chat",isAuth,findandcreate)

module.exports = { routes };