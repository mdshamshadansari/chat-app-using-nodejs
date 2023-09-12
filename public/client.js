const socket = io(); 

let username;
let chats = document.querySelector('.chats');
let users_list = document.querySelector('.users-list');
let users_count = document.querySelector('.users-count');
let msg_send = document.querySelector('#msg-send');
let user_msg = document.querySelector('#user-msg');

do{
    username = prompt("Enter your name: ");
}while(!username);

/* It will be called whaen a new user joined*/
socket.emit('new-user-joined', username);

/* It will be called when a user joined*/
socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name,'joined');
})


/* It will be called when a user joined or left*/
function userJoinLeft(name, status){
    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p><b> ${name} </b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

/* It will be called when a user left*/
socket.on('user-disconnected', (socket_name) => {
    userJoinLeft(socket_name,'left');
})

/** Updating users list and user count*/
socket.on('user-list', (users) => {
    users_list.innerHTML = '';
    users_arr = Object.values(users);
    for(let i = 0; i < users_arr.length; i++){
        let p = document.createElement('p');
        p.innerText = users_arr[i];
        users_list.appendChild(p);
    }
    users_count.innerText = users_arr.length;
})

/* for sending messege*/ 
msg_send.addEventListener('click', () => {
    let data = {
        user : username,
        msg : user_msg.value
    };
    if(user_msg.value != ''){
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        user_msg.value = '';
    }

})

//configuring button with enter key
var input = document.getElementById("user-msg");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("msg-send").click();
    }
});

function appendMessage(data, status){
    let div = document.createElement('div');
    div.classList.add('message', status);
    let content = `
        <h5> ${data.user} </h5>
        <p> ${data.msg} </p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data, 'incoming');
})