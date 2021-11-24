const express = require('express')
const path = require('path')
const cors = require('cors')
// const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const peerServer = ExpressPeerServer(server, { debug: true });
const port = 3001
app.use(cors())
app.use('/peerjs', peerServer)
app.use(express.static(path.join(__dirname, 'public')))
// app.get('/', (req, res) => {
//     res.redirect(`/${uuidv4()}`)
// })
// app.get('/:roomId', (req, res) => {
//     res.render('room', { roomId: req.params.roomId })
// })
// just sharing the peer id between user 
io.on("connection", (socket) => {
    // after user connects listen to join room and user pass its id here 
    console.log('got a connection!')
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId)
        console.log('user join room  ', roomId, socket.rooms)
        socket.on('disconnect', () => {
            console.log('user disonncted', userId)
            socket.to(roomId).emit('ud', userId)


        })
        // sending to all the member of room expect this socket 
        socket.to(roomId).emit('user-connected', userId)
    })

})
server.listen(port, () => console.log(`Example app listening on port ${port}`))
