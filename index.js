const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const cors = require("cors");
const mongoose = require("mongoose");
const DeviceModel = require("./models/DeviceModel");
const SensorModel = require("./models/SensorModel");
app.use(bodyParser.json());
app.use(cors());

app.post("/api/addSensors", async (req, res) => {
  try {
    const { id_device, temperature, humidity, light, status_light } = req.body;
    const newSensor = new SensorModel({
      id_device,
      temperature,
      humidity,
      light,
      status_light,
    });
    const savedSensor = await newSensor.save();
    res.status(200).json(savedSensor);
  } catch (error) {
    console.error("Error creating sensor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/api/addDevices", async (req, res) => {
  try {
    const { user, name, isActive, message } = req.body;
    const newDevice = new DeviceModel({
      user,
      name,
      isActive,
      message,
    });
    const savedDevice = await newDevice.save();
    res.status(200).json(savedDevice);
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/getAllDevices", async (req, res) => {
  try {
    const devices = await DeviceModel.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error getting devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all sensors
app.get("/api/getAllSensors", async (req, res) => {
  try {
    const sensors = await SensorModel.find();
    res.status(200).json(sensors);
  } catch (error) {
    console.error("Error getting sensors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//get device (id)
app.get("/api/getDeviceById/:id_device", async (req, res) => {
  try {
    const { id_device } = req.params;
    const device = await SensorModel.findOne({ id_device });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json(device);
  } catch (error) {
    console.error("Error getting device by id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update sensor model based on id_device
app.put("/api/updateSensor/:id_device", async (req, res) => {
  try {
    const { id_device } = req.params;
    const { temperature, humidity, light, status_light } = req.body;

    let sensor = await SensorModel.findOne({ id_device });

    if (!sensor) {
      return res.status(404).json({ error: "Sensor not found" });
    }

    sensor.temperature = temperature;
    sensor.humidity = humidity;
    sensor.light = light;
    sensor.status_light = status_light;

    const updatedSensor = await sensor.save();

    res.status(200).json(updatedSensor);
  } catch (error) {
    console.error("Error updating sensor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

mongoose
  .connect(
    "mongodb+srv://20521059:VGVSh6jBMwHvT3wZ@podify.oauoj72.mongodb.net/?retryWrites=true&w=majority&appName=podify",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
