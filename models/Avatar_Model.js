const mongoose = require("mongoose");
// ---------------------------
const AvatarSchema = mongoose.Schema(
  {
    id: { type: Number },
    Avatar_Img: { type: String },
  },
  {
    timestamps: true,
  }
);
// ---------------------------
module.exports = mongoose.model("avatars", AvatarSchema);
// ---------------------------