const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { generatemessege, generatemessegelocation } = require('./utils/messeges.js')
const { adduser, getuser, getuserinroom, removeuser } = require('./utils/users.js')

//server created

const app = express()
const server = http.createServer(app)

const io = socketio(server)
const port = process.env.PORT || 5000

const publicdirectorypath = path.join(__dirname, '../public')
app.use(express.static(publicdirectorypath))


io.on('connection', (socket) => {
    console.log('new web socket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = adduser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('messege', generatemessege("admin", 'welcome!'))
        socket.broadcast.to(user.room).emit('messege', generatemessege("admin", user.username + ' has joined'))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getuserinroom(user.room)
        })
        callback()
    })

    socket.on('sendmessege', (messege, callback) => {
        const user = getuser(socket.id)

        io.to(user.room).emit('messege', generatemessege(user.username, messege))
        callback()
    })

    socket.on('sendlocation', (coords, callback) => {
        const user = getuser(socket.id)
        io.to(user.room).emit('locationmessege', generatemessegelocation(user.username, 'https://google.com/maps?q=' + coords.latitude + ',' + coords.longitude))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeuser(socket.id)

        if (user) {
            io.to(user.room).emit('messege', generatemessege(user.username, 'left'))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getuserinroom(user.room)
            })
        }


    })

})

server.listen(port, () => {
    console.log('new server')
})