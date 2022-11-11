const router = require("express").Router();
const { handleSendMessage, handleGetMessage } = require("../controller/messagesController");
const { isAuth } = require("../middleware/isAuth");



router.post("/", isAuth, handleSendMessage);
router.get("/:id", isAuth, handleGetMessage);

module.exports = router;
