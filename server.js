const express = require("express");
const cors = require("cors");
require("./models/index");
const app = express();
const fs = require("fs");
// const socket_init = require("./socket/socket");
const Routes = require("./routes");
const http = require("http").createServer(app);
const { chatController } = require("./Controllers/chat");
const { Server } = require("socket.io");

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("uploads/"));
app.use("/api", Routes);

// simple route

app.get("/", (req, res) => {
  res.json({ message: "Welcome to My Room App platefrom." });
});

const PORT = process.env.PORT || 3000;

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  //   // socket.on('online', async (wkr_pkey) => {
  //   //   await chatController.setOnlineStatus({ wkr_pkey: wkr_pkey, wkr_soket_id: socket.id }).then((result) => { console.log(result) })
  //   // })

  socket.on("join_room", async (data) => {
    await chatController.AddUser(data).then((result) => {
      socket.join(result);
      console.log("User Joined Room: " + result);
    });
  });

  socket.on("send_message", async (data) => {
    console.log(">>>>", data);
    let obj = await chatController.getRoomId(data).then((result) => {
      return result;
    });
    // console.log("objjj", obj);
    // socket.emit("receive_message", obj.content);
    obj === null
      ? null
      : socket.to(obj.roomId).emit("receive_message", obj.content);
  });

  socket.on("disconnect", async () => {
    // await chatController.setOfflineStatus(socket.id).then((result) => { console.log(result) })
    console.log("user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
