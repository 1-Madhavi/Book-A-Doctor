const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Appointment = require("../models/Appointment");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");


// ===============================
// GET ALL USERS (ADMIN)
// ===============================
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ===============================
// GET ALL APPOINTMENTS (ADMIN)
// ===============================
router.get(
  "/appointments",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate("patientId", "name email")
        .populate("doctorId", "name email")
        .sort({ createdAt: -1 });

      res.json(appointments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ===============================
// DELETE USER
// ===============================
router.delete(
  "/user/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ===============================
// DASHBOARD STATS
// ===============================
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.countDocuments();
      const doctors = await User.countDocuments({ role: "doctor" });
      const patients = await User.countDocuments({ role: "patient" });

      const totalAppointments = await Appointment.countDocuments();
      const pending = await Appointment.countDocuments({ status: "pending" });
      const approved = await Appointment.countDocuments({ status: "approved" });
      const rejected = await Appointment.countDocuments({ status: "rejected" });

      res.json({
        users,
        doctors,
        patients,
        totalAppointments,
        pending,
        approved,
        rejected,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ===============================
// UPDATE APPOINTMENT STATUS + SOCKET
// ===============================
router.put(
  "/appointment/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).populate("patientId doctorId");

      // realtime update
      req.app.get("io").emit("appointmentUpdated", appointment);

      res.json(appointment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);


// ===============================
// APPROVE DOCTOR + SOCKET
// ===============================
router.put(
  "/doctor/approve/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      );

      req.app.get("io").emit("doctorApproved", user);

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;