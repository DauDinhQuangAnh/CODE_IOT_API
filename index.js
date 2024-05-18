const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DeviceModel = require("./models/DeviceModel");
const SensorModel = require("./models/SensorModel");
const UserModel = require("./models/UserModel");

const app = express();
const port = process.env.PORT || 3001;

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3000', // Thay thế bằng URL frontend của bạn
  credentials: true
}));

app.use(bodyParser.json());

// Kết nối đến MongoDB
mongoose
  .connect(
    "mongodb+srv://20521059:VGVSh6jBMwHvT3wZ@podify.oauoj72.mongodb.net/?retryWrites=true&w=majority&appName=podify",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
  });

// Đăng ký người dùng
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Đăng nhập người dùng
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Thêm sensor mới
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

// Thêm device mới
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

// Lấy tất cả các device
app.get("/api/getAllDevices", async (req, res) => {
  try {
    const devices = await DeviceModel.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error getting devices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lấy tất cả các sensor
app.get("/api/getAllSensors", async (req, res) => {
  try {
    const sensors = await SensorModel.find();
    res.status(200).json(sensors);
  } catch (error) {
    console.error("Error getting sensors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lấy device theo id
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

// Cập nhật sensor theo id_device
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

// Bắt đầu server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
