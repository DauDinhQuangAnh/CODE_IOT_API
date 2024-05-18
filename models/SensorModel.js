const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SensorSchema = new Schema(
  {
    id_device: String,
    temperature: String,
    humidity: String,
    light: String,
    status_light: String,
  },
  {
    timestamps: true,
  }
);

const SensorModel = model("Sensor", SensorSchema);

module.exports = SensorModel;
