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

let allPlayers = []
let index = 0

io.on("connection", (socket) => {
  socket.once("find", (data) => {
    const savedPlayer = allPlayers.find(p => p.id == data.id)

    console.log('data',data);

    
    if (!savedPlayer && allPlayers.length < 2) {
      allPlayers.push({
        id: socket.id,
      })

      index++
     
      
    }
    socket.emit('waitForPlayer',allPlayers)

    
    if (allPlayers.length == 2){
      io.emit('userRegister',allPlayers)
    }

    
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


