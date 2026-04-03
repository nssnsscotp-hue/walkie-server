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

  socket.on("join-channel", (channel) => {
    socket.join(channel);
    socket.join("global");
  });

  socket.on("audio-stream", ({ channel, audio }) => {
    socket.to(channel).emit("audio-stream", {
      type: "normal",
      audio
    });
  });

  socket.on("emergency-stream", (audio) => {
    io.emit("audio-stream", {
      type: "emergency",
      audio
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running");
});