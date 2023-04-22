const express = require("express");
const app = express()
const http = require('http').createServer(app);
const { chatController } = require('../Controllers/chat')
const { Server } = require("socket.io")

const io = new Server(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});


const socket_init = () => {
    io.on('connection', (socket) => {
        console.log('user connected', socket.id);

        //   // socket.on('online', async (wkr_pkey) => {
        //   //   await chatController.setOnlineStatus({ wkr_pkey: wkr_pkey, wkr_soket_id: socket.id }).then((result) => { console.log(result) })
        //   // })

        socket.on("join_room", async (data) => {
            console.log(data)
            let roomId = await chatController.AddUser(data).then((result) => { return result; })
            socket.join(roomId);
            console.log("User Joined Room: " + roomId);
        });

        socket.on("send_message", async (data) => {
            console.log(">>>>", data);
            let obj = await chatController.getRoomId(data).then((result) => { return result; })
            // console.log("objjj", obj);
            // socket.emit("receive_message", obj.content);
            obj === null ? null : socket.to(obj.roomId).emit("receive_message", obj.content);
        });


        socket.on('disconnect', async () => {
            // await chatController.setOfflineStatus(socket.id).then((result) => { console.log(result) })
            console.log('user disconnected');
        });
    });

}



module.exports = socket_init;

