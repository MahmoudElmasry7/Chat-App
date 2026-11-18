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

  socket.emit("message" , "اهلا وسهلا بيك في الدردشه")
  socket.broadcast.emit("message" , "مستخدم جديد انضم للدردشه")
  socket.on("disconnect" , ()=>{
    io.emit("message" , "مستخدم غادر الدردشه")
  })
  socket.on("chatMessage" , (msg)=>{
    io.emit("message" , msg)
  })

})

server.listen(port , ()=>{
    console.log(`server listen on port ${port}!`)
})
