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
const BOT_NAME = "النظام"

function formatMessage(username, text) {
  return { username, text, time: Date.now() }
}

app.use(express.static(path.join(__dirname , "public")))


async function sendRoomUsers(room) {
  const sockets = await io.in(room).fetchSockets()
  const users = sockets.map(s => s.data.username)
  io.to(room).emit("roomUsers" , users)
}


io.on("connection" , (socket)=>{

  socket.on("joinRoom" , async({ username , room } = {})=>{

    if (typeof username !== "string" || typeof room !== "string") return
    if (!username.trim() || !room.trim() || username.length > 30) return

    socket.join(room)

    socket.data.username = username
    socket.data.room = room

    socket.emit("message" , formatMessage(BOT_NAME , "اهلا وسهلا بيك في الدردشه"))
    socket.to(room).emit("message" , formatMessage(BOT_NAME , `${username} انضم للدردشه`))
    await sendRoomUsers(room)
  })

  socket.on("chatMessage" , (msg)=>{
    const { room , username} = socket.data           
    if (!room) return                 
    if (typeof msg !== "string") return
    const text = msg.trim()
    if (!text || text.length > 500) return
      
    io.to(room).emit("message" ,formatMessage(username , text))       
  })

  socket.on("disconnect" , async()=>{
    const { room , username } = socket.data
    if (!room) return
    io.to(room).emit("message" , formatMessage(BOT_NAME , `${username} غادر الدردشه`))  
    await sendRoomUsers(room)
  })

})

server.listen(port , ()=>{
    console.log(`server listen on port ${port}!`)
})
