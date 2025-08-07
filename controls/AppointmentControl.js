const express = require("express");
const Appointment = require("../model/AppointmentModel.js");
const Role = require("../model/rolemodel.js");
const route = express.Router();
route.use(express.json());
const handleError = (res, err) => {
  console.log(err);
  res.status(500).json({ message: "Error", error: err.message });
};

route.get("/summary", async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const totalDoctors = await Role.countDocuments();

    res.status(200).json({
      totalAppointments,
      totalDoctors,
    });
  } catch (err) {
    handleError(res, err);
  }
});

route.get("/appointment", async (req, res) => {
  try {
    let result = await Appointment.find()
      .populate("patient_id", "name")
      .populate("doctor_id", "name")
      .populate("department_id", "name");
    res.status(200).json(result);
  } catch (err) {
    handleError(res, err);
  }
});

route.get("/appointment/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const appointments = await Appointment.findById(req.params.id)
      .populate("patient_id", "name")
      .populate("doctor_id", "name")
      .populate("department_id", "name");
    console.log("appointment data:", appointments);
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Error fetching department", error });
  }
});

route.post("/appointment", async (req, res) => {
  try {
    let result = await new Appointment(req.body).save();
    result = await result.populate("patient_id", "name");
    res
      .status(201)
      .json({ message: "Post appointment successfully", data: result });
  } catch (err) {
    handleError(res, err);
  }
});

route.put("/appointment/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let result = await Appointment.updateOne({ _id: id }, { $set: req.body });
    res
      .status(200)
      .json({ message: "Appointment updated successfully", data: result });
  } catch (err) {
    handleError(res, err);
  }
});

route.delete("/appointment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await Appointment.deleteOne({ _id: id });
    if (!result) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = route;
