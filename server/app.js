if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/* eslint-disable no-unused-vars */
const express = require("express");
const { createServer } = require("http"); //socket io setup
const { Server } = require("socket.io"); //socket io setup

const app = express();
const httpServer = createServer(app); //socket io setup
const io = new Server(httpServer, {
  cors: {
    origin: true,
  },
});

const port = process.env.PORT || 3000;
const router = require("./routes/router");
const errorHandler = require("./middlewares/ErrorHandler");

const cors = require("cors"); // nyalakan cors kalau mau hilangkan socket io.
app.use(cors()); // nyalakan cors kalau mau hilangkan socket io.

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);
app.use(errorHandler);

let isBidClosed = false; // Initialize bid status

io.on("connection", (socket) => {
  socket.emit("message", "Halo, selamat datang di realtime bid");
  socket.emit("bidClosed", isBidClosed); // Send initial bid status to the client

  socket.on("newBid", (newCount) => {
    io.emit("highestBid", newCount);
  });
}); //socket io setup

app.post("/closeBid", (req, res) => {
  isBidClosed = true; // Update bid status
  io.emit("bidClosed", isBidClosed); // Emit event to all clients with the updated bid status
  res.send("Bid closed successfully");
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); //socket io setup ganti app dengan httpServer

module.exports = app;
