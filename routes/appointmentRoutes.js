const express = require("express");
const router = express.Router();

const Appointment = require("../models/Appointment");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * 📌 Book Appointment (Patient Only)
 */
router.post("/", protect, authorizeRoles("patient"), async (req, res) => {
  try {
    let { doctorId, appointmentDate, appointmentTime } = req.body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    appointmentTime = appointmentTime.trim();

    const start = new Date(appointmentDate);
    const end = new Date(appointmentDate);
    end.setDate(end.getDate() + 1);

    // Prevent duplicate booking
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: start,
        $lt: end,
      },
      appointmentTime,
      status: { $in: ["pending", "approved"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked.",
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      appointmentDate: start,
      appointmentTime,
      status: "pending",
    });

    // Populate doctor & patient for frontend
    await appointment.populate("patientId doctorId");

    // Socket Notification
    const io = req.app.get("io");
    io.emit("appointmentUpdated", appointment);

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error booking appointment",
    });
  }
});

/**
 * 📌 Get Booked Slots
 */
router.get("/booked-slots", async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.query;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({
        message: "doctorId and appointmentDate are required",
      });
    }

    const start = new Date(appointmentDate);
    const end = new Date(appointmentDate);
    end.setDate(end.getDate() + 1);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: start,
        $lt: end,
      },
      status: { $in: ["pending", "approved"] },
    });

    const bookedSlots = appointments
      .map((a) => a.appointmentTime)
      .filter(Boolean);

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching booked slots",
    });
  }
});

/**
 * 📌 Patient Appointments
 */
router.get("/my", protect, authorizeRoles("patient"), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
    })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching patient appointments",
    });
  }
});

/**
 * 📌 Doctor Appointments
 */
router.get("/doctor", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
    })
      .populate("patientId", "name email")
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching doctor appointments",
    });
  }
});

/**
 * 📌 Approve / Reject Appointment (Doctor Only)
 */
router.put("/status/:id", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    // const { status } = req.body;
    const { status, medicineInstructions } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    appointment.status = status;
    appointment.medicineInstructions =
  medicineInstructions || appointment.medicineInstructions;
    await appointment.save();

    await appointment.populate("patientId doctorId");

    const io = req.app.get("io");
    io.emit("appointmentUpdated", appointment);

    res.status(200).json({
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating appointment",
    });
  }
});

/**
 * 📌 Cancel Appointment (Patient Only)
 */
router.put("/cancel/:id", protect, authorizeRoles("patient"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (appointment.status !== "pending") {
      return res.status(400).json({
        message: "Only pending appointments can be cancelled",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    await appointment.populate("patientId doctorId");

    const io = req.app.get("io");
    io.emit("appointmentUpdated", appointment);

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error cancelling appointment",
    });
  }
});

module.exports = router;