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

socket.on("message" , msg=>{
    showMsg(msg)
    messagesDiv.scrollTop = messagesDiv.scrollHeight
})


function showMsg(msg){
    const messageList = document.getElementById("messageList")
    const htmlMsg = `<div class="message">
                        <p class="username"> الرد الالي<span class="timestamp">10:30 AM</span></p>
                        <p class="message-text">${msg}</p>
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