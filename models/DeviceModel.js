const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DeviceSchema = new Schema(
  {
    user: String,
    name: String,
    isActive: Boolean,
    message: String,
  },
  {
    timestamps: true,
  }
);

const DeviceModel = model("Device", DeviceSchema);

module.exports = DeviceModel;
