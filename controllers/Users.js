const User = require("../models/User_Model");
const Avatar = require("../models/Avatar_Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// ---------------------------
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// ---------------------------
const User_Login = async (req, res) => {
  try {
    // console.log(req.body);
    const { Email, Password } = req.body;
    // console.log(Email, Password);
    const user = await User.findOne({ email: Email });
    // console.log(user);
    if (!user) {
      res.status(401).json({ message: "❗Please Signup and Login." });
    } else {
      const isPasswordValid = await bcrypt.compare(Password, user.password);
      // console.log(isPasswordValid);
      if (isPasswordValid) {
        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_TIME_OUT,
        });

        // console.log(token);
        const response = {
          _id: user._id,
          username: user.username,
          email: user.email,
          user_token: token,
          isAvatarImageSet: user.isAvatarImageSet,
          avatarImage: user.avatarImage,
        };
        res
          .status(200)
          .json({ message: "👍Successfully User Logged-in", response });
      } else {
        res.status(422).json({
          message: "❗Incorrect Username/Password",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "❗Internal Server Error" });
  }
};
// ---------------------------
const User_Register = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, password } = req.body;
    // console.log(username, email, password);
    const userEmailCheck = await User.findOne({ email: email });
    const usernameCheck = await User.findOne({ username: username });
    // console.log(usernameCheck);
    if (userEmailCheck) {
      res.json({
        message: "❗Email id already exists",
        Email: userEmailCheck.email,
      });
    } else {
      if (usernameCheck) {
        res.json({
          message: "❗Try Your Name with mixed lower && upper case",
          Username: usernameCheck.username,
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const Register_user = new User({
          username: username,
          email: email,
          password: hash,
        });
        // console.log(Register_user);
        await Register_user.save();
        res.status(201).json({ message: "👍successfully User Registered" });
        // console.log(Register_user);
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error);
  }
};
// ---------------------------
const Get_All_Users = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Get_All_Users error" });
  }
};
// ---------------------------
const Set_Avatar = async (req, res) => {
  try {
    // console.log(req.params);
    // console.log(req.body);
    const userId = req.params.id;
    const avatarImage = req.body.image;
    // console.log(avatarImage);
    const userData = await User.findByIdAndUpdate(
      { _id: userId },
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    // console.log(userData);
    return res.status(200).json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Set_Avata  error" });
  }
};
// ---------------------------
const set_Default_Avatar = async (req, res) => {
  try {
    const AvatarData = await Avatar.aggregate([
      { $project: { Avatar_Img: 1, _id: 0 } },
    ]);
    // console.log(AvatarData);
    res.status(200).json(AvatarData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// ---------------------------
const User_Logout = (req, res) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Logout error" });
  }
};
// ---------------------------
module.exports = {
  User_Login,
  User_Register,
  Get_All_Users,
  Set_Avatar,
  set_Default_Avatar,
  User_Logout,
};
// ---------------------------
