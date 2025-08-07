const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/config.js");

const roleControl = require("./controls/rolecontrol.js");
const patientControl = require("./controls/patientControl.js");
const departmentControl = require("./controls/DepartmentControl.js");
const appointmentControl = require("./controls/AppointmentControl.js");

const userRoutes = require("./controls/RegistrationControl.js");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("This is the server");
});
console.log("🔌 Calling connectDB()...");
app.use("/api", roleControl);
app.use("/api", departmentControl);
app.use("/api", appointmentControl);

app.use("/api", userRoutes);
app.use("/api", patientControl);
app.use("/upload", express.static("upload"));
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
connectDB().then(() => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
