const mongoose = require("mongoose");

const ConnectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  connections: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("connection", ConnectionSchema);
