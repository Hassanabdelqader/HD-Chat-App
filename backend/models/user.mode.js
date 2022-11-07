const mongoose = require("mongoose"); 

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjX1E690OvzoSCU5QXKavl19XRonGcyOQNvVv0Mxs&s",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;