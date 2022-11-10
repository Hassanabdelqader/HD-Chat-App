const JWT = require("jsonwebtoken");
const User = require("../models/user.mode");

const isAuth = async (req, res, next) => {
  let token;
  
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
       try {
           token = req.headers.authorization.split(" ")[1]
           const decoded = JWT.verify(token, process.env.JWT_SECRET);
        // Query.select("-Image");
           req.user = await User.findById(decoded.id).select("-password");
           
        return next();
      } catch (error) {
        res.status(401).json({ msg: "not Authorize" });
      }
    } else {
     res.status(404).json({ msg: "please Provide us with Token" });
     
    }

}
module.exports = {isAuth}
