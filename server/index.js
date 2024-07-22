const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

const myUrl = '192.168.1.153'
const distPath = path.join(__dirname, '..', 'client', 'dist');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server , { cors: { origin: "*" } });
app.use(express.static(distPath));



io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);













  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});




const currentDir = __dirname;

// Cambia al directorio superior y luego a 'cliente/dist/index'
const targetPath = path.join(currentDir, '..', 'client', 'dist', 'index.html');

server.listen(3000, () => {
  console.log("listening on *:3000");
});

app.get("*", (req, res) => {
  // res.json({ message: "Hello World" });
  res.sendFile(path.join(targetPath));
});


