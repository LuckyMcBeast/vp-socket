const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
require('dotenv').config()


const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.REQUESTER_URL || ''
    }
})

const port = process.env.PORT || 3200

app.get('/ping', (req, res) => {
    res.send('LIVE')
})


class User {
    name;
    socketId;
    vote;
    context;
    
    constructor(socketId){
        this.socketId = socketId
    }

}

class Room {
    users = [];
    hostSocketId;
    constructor(hostUser){
        this.users = [hostUser],
        this.hostSocketId = hostUser.socketId
    }

    addUser(user) {
        this.users.push(user)
    }
}

const rooms = []


io.on('connection', socket => {
    console.log(socket.rooms)
    console.log(`Connection Established: ${socket.id}`)
    socket.on("test", (msg) => {
        console.log("Broadcasting Test...");
        socket.broadcast.emit("pass", msg);
      });
    socket.on('setName', (name) => {
        console.log(`ID: ${socket.id}, NAME: ${name}`)
        socket.broadcast.emit('nameSet', { name })
    })
    socket.on('disconnect', reason => {
        console.log(`Disconnecting: ${socket.id}, reason: ${reason}`)
    })
})

httpServer.listen(port)