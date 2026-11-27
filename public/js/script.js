const socket = io()
const chatForm = document.getElementById("messageForm")
const messagesDiv = document.getElementById("messages")

const username = localStorage.getItem("username")
const room = localStorage.getItem("room")

if (!username || !room) {
    window.location.href = "index.html"
}

socket.on("connect" , ()=>{
    socket.emit("joinRoom" , { username , room })
})

socket.on("message" , message=>{
    showMsg(message)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
})

socket.on("roomUsers" , users=>{
    const list = document.getElementById("userListItems")
    list.replaceChildren()
    users.forEach(name=>{
        const li = document.createElement("li")
        li.textContent = name   
        list.appendChild(li)
    })
})


function showMsg(message){
    const messageList = document.getElementById("messageList")
    const time = new Date(message.time).toLocaleTimeString("ar-EG" , { hour: "2-digit" , minute: "2-digit" })

    // نبني العناصر واحد واحد بدل ما نبني string فيها HTML
    const div = document.createElement("div")
    div.className = "message"

    const header = document.createElement("p")
    header.className = "username"
    header.textContent = message.username + " "     // textContent: نص بس، مش HTML

    const timestamp = document.createElement("span")
    timestamp.className = "timestamp"
    timestamp.textContent = time
    header.appendChild(timestamp)

    const text = document.createElement("p")
    text.className = "message-text"
    text.textContent = message.text                  // هنا بيتأمن نص الرسالة

    div.append(header , text)
    messageList.appendChild(div)
}

chatForm.addEventListener("submit" , (event)=>{
    event.preventDefault()
    const userMsg = event.target.elements.messageInput.value
    socket.emit("chatMessage" , userMsg)
    event.target.elements.messageInput.value=""
    event.target.elements.messageInput.focus()

})