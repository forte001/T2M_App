const express = require("express")

const socketio = require("socket.io")

const app = express()

app.set("view engine", "ejs") // sets the view to the view directory

app.use(express.static("public")) // holds statid user files like pix, vids, audio etc.

app.get("/", (req,res) =>{
  res.render("index")
})

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
})

// Initialize socket for server
const io = socketio(server)

io.on("connection", socket => {
  console.log("New user connected");

  socket.username = "Anonymous";

  socket.on("change_username", data => {
    socket.username = data.username
  })

  // Handles the message event
  socket.on('new_message', data => {
    console.log("new message")
    io.sockets.emit('receive_message', {message: data.message, username: socket.username})
  })

  // Emits typing event
  socket.on('typing', data => {
    socket.broadcast.emit('typing', {username: socket.username})
  })
})
