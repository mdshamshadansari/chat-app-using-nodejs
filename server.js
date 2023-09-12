const express = require('express');
const http = require('http');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const connect = require('./config/dbConfiguration');
const Chat = require('./models/userSchema')

app.use(express.static(__dirname + '/public'));

let users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');   
})

io.on('connection', (socket) => {
    // console.log("New user connected with socketId: " + socket.id);
    socket.on('new-user-joined', (username) => {
        users[socket.id] = username;
        // console.log(users);
        
        socket.broadcast.emit('user-connected', username);
        io.emit('user-list', users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
        io.emit('user-list', users);
    })

    socket.on('message', async (data) => {
        
        const chat = await Chat.create({
            user : data.user,
            content : data.msg
        });

        // console.log(chat);
        socket.broadcast.emit('message', { ...data, status: 'incoming' });
    })
})

server.listen(PORT, async() => {
    console.log(`Server is running on port ${PORT}`);
    await connect();
    console.log('Database connected');
})