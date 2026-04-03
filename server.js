const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join channel
  socket.on("join-channel", (channel) => {
    console.log("Joined:", channel);
    socket.join(channel);
  });

  // 🎤 Live audio stream
  socket.on("audio-stream", (data) => {
    socket.to(data.channel).emit("audio-stream", data.audio);
  });

  // 🚨 Emergency (send to all)
  socket.on("emergency-stream", (audio) => {
    io.emit("audio-stream", audio);
  });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running");
});
