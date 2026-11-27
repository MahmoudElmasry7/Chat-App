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


function showMsg(message){
    const messageList = document.getElementById("messageList")
    const time = new Date(message.time).toLocaleTimeString("ar-EG" , { hour: "2-digit" , minute: "2-digit" })
    const htmlMsg = `<div class="message">
                        <p class="username">${message.username} <span class="timestamp">${time}</span></p>
                        <p class="message-text">${message.text}</p>
                    </div>`
            messageList.insertAdjacentHTML("beforeend" , htmlMsg)
}

chatForm.addEventListener("submit" , (event)=>{
    event.preventDefault()
    const userMsg = event.target.elements.messageInput.value
    socket.emit("chatMessage" , userMsg)
    event.target.elements.messageInput.value=""
    event.target.elements.messageInput.focus()

})