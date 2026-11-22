const { setupDeliveryTracking } = require("./deliverytracking");

const registerSockets = (io) => {
  if (!io) return;
  setupDeliveryTracking(io);
};

module.exports = {
  registerSockets,
};
