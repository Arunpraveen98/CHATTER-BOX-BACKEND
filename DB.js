const mongoose = require("mongoose");
require("dotenv").config();
// ---------------------------
const Connect_DB = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connetion Successfull");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// ---------------------------
module.exports = { Connect_DB };
// ---------------------------