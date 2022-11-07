const mongoose = require("mongoose"); 
  const bcrypt = require("bcrypt");


const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjX1E690OvzoSCU5QXKavl19XRonGcyOQNvVv0Mxs&s",
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function(next){
  if (!this.isModified) {
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userModel.methods.checkauth = async function(password) {
  return await bcrypt.compare(password,this.password);
}

const User = mongoose.model("User", userModel);

module.exports = User;