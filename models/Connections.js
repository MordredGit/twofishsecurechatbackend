const mongoose = require("mongoose");

const ConnectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  connections: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("connection", ConnectionSchema);
