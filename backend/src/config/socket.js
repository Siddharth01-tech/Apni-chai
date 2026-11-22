let io = null;

const initSocket = (httpServer) => {
  try {
    const { Server } = require("socket.io");

    io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    return io;
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND") {
      console.warn("socket.io package is not installed. Run 'npm install socket.io' when ready.");
      return null;
    }
    throw err;
  }
};

const getIO = () => {
  if (!io) {
    return null;
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
