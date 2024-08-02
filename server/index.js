const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
require('dotenv').config({ path: '../.env' });
const apiUrl = process.env.API_URL;


const myUrl = apiUrl
const distPath = path.join(__dirname, '..', 'client', 'dist');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server , { cors: { origin: "*" } });
app.use(express.static(distPath));






let allPlayers = []


io.on("connection", (socket) => {
  socket.once("find", (data) => {
    
      allPlayers.push({
        id: socket.id,
      })

      
     
      
    // }
    socket.emit('waitForPlayer',allPlayers)

    
    
    
      io.emit('userRegister',allPlayers)
   

    
  })

  socket.on("whiteMoved", (data) => {
    
    
    io.emit("whiteActualize", data);
  });

  socket.on("blackMoved", (data) => {
    
    
    io.emit("blackActualize", data);
  });

  socket.on('peonWhiteInGoal', (data) => {
    io.emit('peonWhiteChange', data)
  })
  socket.on('peonBlackInGoal', (data) => {
    io.emit('peonBlackChange', data)
  })

  socket.on('changeAlert', (data) => {
    io.emit('turnAlert', data)
  })
  socket.on('blackKillKing', (data) => {
    io.emit('blackWin', data)
  })

  socket.on('whiteKillKing', (data) => {
    io.emit('whiteWin', data)
  })













  socket.on("disconnect", () => {
    console.log("user disconnected");
    allPlayers = allPlayers.filter(p => p.id != socket.id)

    io.emit('userIsDisconected',allPlayers)
    
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


