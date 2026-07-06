const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    hospital: {
        type: String,
        required: true
    },

    consultationFee: {
        type: Number,
        required: true
    },

    availableDays: {
        type: [String],
        default: []
    },

    availableTime: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Doctor", doctorSchema);