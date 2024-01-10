const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const users = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("set username", (username) => {
    users[socket.id] = username;

    console.log(`${username} has joined the chat`);
    io.emit("chat message", `<span>${username}</span> has joined the chat`);
  });

  socket.on("chat message", (msg) => {
    const username = users[socket.id] || "Anonymous";

    console.log(`${username}: ${msg}`);
    io.emit(
      "chat message",
      `<span>${username}</span>: <span id='msg'>${msg}</span>`
    );
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];

    if (username) {
      console(`${username} has left the chat`);
      io.emit("chat message", `<span>${username}</span> has left the chat`);
      delete users[socket.id];
    }

    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000/");
});
