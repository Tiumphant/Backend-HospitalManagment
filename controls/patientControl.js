const express = require("express");
const route = express.Router();
const Patient = require("../model/patientModel.js");

route.use(express.json());

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: "Server Error", error: error.message });
};

// Get all patients
route.get("/patient", async (req, res) => {
  try {
    const patients = await Patient.find().populate("assignedDoctor", "name");
    res.status(200).json(patients);
  } catch (error) {
    handleError(res, error);
  }
});

// Get single patient
route.get("/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    handleError(res, error);
  }
});

// Search patient by name/email
route.get("/patient/search/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const insensitive = new RegExp(key, "i");
    const result = await Patient.find({
      $or: [
        { name: { $regex: insensitive } },
        { email: { $regex: insensitive } },
      ],
    });
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
});

// Create patient
route.post("/patient", async (req, res) => {
  try {
    const formData = { ...req.body };

    if (formData.email) {
      const existing = await Patient.findOne({ email: formData.email });
      if (existing) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    if (
      !formData.assignedDoctor ||
      formData.assignedDoctor === "" ||
      formData.assignedDoctor === "null"
    ) {
      delete formData.assignedDoctor;
    }

    const newPatient = new Patient(formData);
    await newPatient.save();
    res.status(201).json({ message: "Patient created", data: newPatient });
  } catch (error) {
    handleError(res, error);
  }
});

// Update patient
route.put("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (
      !updateData.assignedDoctor ||
      updateData.assignedDoctor === "" ||
      updateData.assignedDoctor === "null"
    ) {
      delete updateData.assignedDoctor;
    }

    delete updateData._id;

    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Delete patient
route.delete("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = route;
