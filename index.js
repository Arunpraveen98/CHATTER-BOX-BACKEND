const express = require("express");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
const PORT = process.env.PORT || 8000;
require("dotenv").config();
// -----------------------
const authRoutes = require("./routes/Users_Auth_Route");
const messageRoutes = require("./routes/Messages_Route");
const { Connect_DB } = require("./DB");
// -----------------------
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
// -----------------------
Connect_DB();
// -----------------------
app.get("/", (request, response) =>
  response.status(200).send("Server Connected Successfully🔥")
);
// -----------------------

app.use("/USER/AUTH", authRoutes);
app.use("/USER/MESSAGES", messageRoutes);
// -----------------------
const server = app.listen(PORT, () => console.log(`Server started on ${PORT}`));
const io = socket(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});
// -----------------------
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
// -----------------------
