const { isAuth } = require("../middleware/isAuth");
const { findandcreate, getAllChats, creategroup, renamegroup, addtogroup, removeFromgroup } = require("../controller/chatsController");

const routes = require("express").Router()

routes.post("/Createchat", isAuth, findandcreate);
routes.get("/getallChat", isAuth, getAllChats);
routes.post("/creategroup", isAuth, creategroup);
routes.put("/renamegroup", isAuth, renamegroup);
routes.post("/addtogroup", isAuth, addtogroup);
routes.put("/removefromgroup", isAuth, removeFromgroup);

module.exports = routes ;