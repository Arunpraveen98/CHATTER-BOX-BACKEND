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
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
// -----------------------
//? Set up Socket.IO server
const io = socket(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// -----------------------
//? Store online users using a Map...
global.onlineUsers = new Map();
//? Handle Socket.IO connections...
io.on("connection", (socket) => {
  //? Store the socket object globally for easy access...
  global.chatSocket = socket;
  //? Event handler for when a user connects...
  socket.on("add-user", (userId) => {
    //? Associate the user ID with the socket ID in the onlineUsers map...
    onlineUsers.set(userId, socket.id);
  });

  //? Event handler for sending messages...
  socket.on("send-msg", (data) => {
    //? Retrieve the recipient's socket ID from the onlineUsers map...
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      //? If the recipient's socket ID is found, emit the "msg-recieve" event to that socket...
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
// -----------------------
