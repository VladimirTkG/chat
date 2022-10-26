const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  console.log(userId, 'getUser')
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.", users);

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log(userId, 'SoketAddUser')
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text, membersChat }) => {
    console.log(senderId, receiverId, text)
    receiverId.forEach(element => {
      const user = getUser(element);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
          membersChat
        });
      }
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
