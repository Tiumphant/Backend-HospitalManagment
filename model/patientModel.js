// const mongoose = require("mongoose");

// const patientSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     unique: true
//   },
//   number: {
//     type: String,
//     required: true
//   },
//   age: {
//     type: Number,
//     required: true
//   },
//   gender: {
//     type: String,
//    required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },

//   assignedDoctor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Role"
//   },
//   fileName: String,
//   filePath: String,
//     uploadedAt: { type: Date, default: Date.now }
// });

// const patient = mongoose.model("Patient", patientSchema);
// module.exports = patient;
const mongoose = require("mongoose");
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  number: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
});

const patient = mongoose.model("Patient", patientSchema);
module.exports = patient;
