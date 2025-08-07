const express = require("express");
const route = express.Router();
const Patient = require("../model/patientModel.js");
const multer = require("multer");

route.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: "Server Error", error: error.message });
};

route.get("/patient", async (req, res) => {
  try {
    const patients = await Patient.find().populate("assignedDoctor", "name");
    res.status(200).json(patients);
  } catch (error) {
    handleError(res, error);
  }
});

route.get("/patient/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    handleError(res, error);
  }
});

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

route.post("/patient", upload.single("image"), async (req, res) => {
  try {
    let formData = { ...req.body };
    if (req.file) {
      formData.image = req.file.filename;
    }

    // Check if email already exists
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
    const result = new Patient(formData);
    await result.save();
    res.status(201).json({ message: "Patient created", data: result });
  } catch (error) {
    handleError(res, error);
  }
});

route.put("/patient/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    if (
      !updateData.assignedDoctor ||
      updateData.assignedDoctor === "" ||
      updateData.assignedDoctor === "null"
    ) {
      delete updateData.assignedDoctor;
    }

    delete updateData._id;

    console.log("Update payload:", updateData);
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

route.delete("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPatient = await Patient.deleteOne({ _id: id });
    res
      .status(200)
      .json({ message: "Patient deleted successfully", data: deletedPatient });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = route;
