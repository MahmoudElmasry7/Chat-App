import express from 'express'
import path from 'path'
import { fileURLToPath } from 'node:url'
import http from 'http'
import {Server} from 'socket.io'

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app)
const io = new Server(server)
const port = 3000

app.use(express.static(path.join(__dirname , "public")))

io.on("connection" , (socket)=>{

  socket.on("joinRoom" , ({ username , room } = {})=>{

    if (typeof username !== "string" || typeof room !== "string") return
    if (!username.trim() || !room.trim() || username.length > 30) return

    socket.join(room)

    socket.data.username = username
    socket.data.room = room

    socket.emit("message" , "اهلا وسهلا بيك في الدردشه")
    socket.to(room).emit("message" , `${username} انضم للدردشه`)
  })

  socket.on("chatMessage" , (msg)=>{
    const { room } = socket.data           
    if (!room) return                       
    io.to(room).emit("message" , msg)       
  })

  socket.on("disconnect" , ()=>{
    const { room , username } = socket.data
    if (!room) return
    io.to(room).emit("message" , `${username} غادر الدردشه`)  
  })

})

server.listen(port , ()=>{
    console.log(`server listen on port ${port}!`)
})
