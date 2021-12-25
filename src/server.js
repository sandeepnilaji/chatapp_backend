const express = require("express");
const cors = require("cors");
const io = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());
// const users = [];
const http = require("http").Server(app);
const socket = io(http);
const connect = require("./configs/db.js");
const PORT = process.env.PORT || 8000;
const users = {};
var date_ob = new Date();

////// socket io
socket.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    // var hours = date_ob.getHours();
    // hours = ("0" + hours).slice(-2);
    // var minutes = date_ob.getMinutes();
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", {
      message: message,
      name: users[socket.id],
    });
    delete users[socket.id];
  });
  // io.on("connection", function (socket) {
  //   socket.emit("datetime", { datetime: new Date().getTime() });
  // });
});
// console.log(PORT);
////// socket io end

const userController = require("./controllers/user.controller");

app.use("/userlist", userController);

http.listen(PORT, async () => {
  await connect();
  console.log(`listening on port ${PORT} `);
});

// console.log(hours);
