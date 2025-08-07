const mongoose = require("mongoose");
const AppointmentSchema = mongoose.Schema(
  {
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    appointment_date: { type: Date },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    reason: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Appointment", AppointmentSchema);
