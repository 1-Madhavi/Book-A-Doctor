import { useEffect, useState, useRef } from "react";
import api from "../api";
import { io } from "socket.io-client";

import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Avatar,
  TextField,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const dashboardRef = useRef(null);
  const bookingRef = useRef(null);
  const appointmentsRef = useRef(null);
  const profileRef = useRef(null);

  const drawerWidth = 240;

  const patient =
    JSON.parse(localStorage.getItem("user")) || {};

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}></Card>

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ================= FETCH APPOINTMENTS =================
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments/my");
      setAppointments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH DOCTORS =================
  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/auth/doctors");
      console.log("Doctor:",res.data);
      setDoctors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH BOOKED SLOTS =================
  const fetchBookedSlots = async (doctor, date) => {
    if (!doctor || !date) {
      setBookedSlots([]);
      return;
    }

    try {
      const res = await api.get("/api/appointments/booked-slots", {
        params: {
          doctorId: doctor,
          appointmentDate: date,
        },
      });

      setBookedSlots(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= BOOK APPOINTMENT =================
  const bookAppointment = async () => {
    try {
      if (!doctorId || !appointmentDate || !appointmentTime) {
        alert("Please select doctor, date and time");
        return;
      }

      await api.post("/api/appointments", {
        doctorId,
        appointmentDate,
        appointmentTime,
      });

      alert("Appointment booked successfully");

      setAppointmentTime("");
      fetchAppointments();
      fetchBookedSlots(doctorId, appointmentDate);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Booking failed");
    }
  };


  // ================= CANCEL APPOINTMENT =================
  const cancelAppointment = async (id) => {
    try {
      await api.put(`/api/appointments/cancel/${id}`);

      alert("Appointment cancelled");

      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Cancel failed");
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  // ================= SLOT UPDATE =================
  useEffect(() => {
    if (doctorId && appointmentDate) {
      fetchBookedSlots(doctorId, appointmentDate);
    }
  }, [doctorId, appointmentDate]);

  // ================= SOCKET =================
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("appointmentUpdated", () => {
      fetchAppointments();

      if (doctorId && appointmentDate) {
        fetchBookedSlots(doctorId, appointmentDate);
      }
    });

    return () => socket.disconnect();
  }, [doctorId, appointmentDate]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
      }}
    >
      {/* ================= APP BAR ================= */}

      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(90deg,#0d47a1,#1976d2)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            🏥 Sujatha Murthy Hospital
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography fontWeight="bold">
              Welcome, {patient.name}
            </Typography>

            <Button
              color="error"
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}

      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            background: "linear-gradient(180deg,#1565c0,#42a5f5)",
            color: "white",
          },
        }}
      >
        <Toolbar />

        <Box sx={{ textAlign: "center", py: 3 }}>
          <LocalHospitalIcon sx={{ fontSize: 60 }} />

          <Typography variant="h6" fontWeight="bold">
            Patient Panel
          </Typography>

          <Typography variant="body2">
            Welcome Patient
          </Typography>
        </Box>

        <Divider sx={{ bgcolor: "rgba(255,255,255,.3)" }} />

        <List>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                dashboardRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <DashboardIcon sx={{ mr: 2 }} />
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                bookingRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <MedicalServicesIcon sx={{ mr: 2 }} />
              <ListItemText primary="Book Appointment" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                appointmentsRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <CalendarMonthIcon sx={{ mr: 2 }} />
              <ListItemText primary="My Appointments" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                profileRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              <PersonIcon sx={{ mr: 2 }} />
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

        </List>
      </Drawer>

      {/* ================= MAIN CONTENT ================= */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
       
<Grid container spacing={3}>
  <Grid item xs={12} md={3}>
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Typography color="#1976d2" fontWeight="bold">
        📅 Total Appointments
      </Typography>

      <Typography variant="h3" fontWeight="bold">
        {appointments.length}
      </Typography>
    </Card>
  </Grid>

  <Grid item xs={12} md={3}>
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Typography color="#fb8c00" fontWeight="bold">
        ⏳ Pending
      </Typography>

      <Typography variant="h3" fontWeight="bold">
        {appointments.filter((a) => a.status === "pending").length}
      </Typography>
    </Card>
  </Grid>

  <Grid item xs={12} md={3}>
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Typography color="#2e7d32" fontWeight="bold">
        ✅ Approved
      </Typography>

      <Typography variant="h3" fontWeight="bold">
        {appointments.filter((a) => a.status === "approved").length}
      </Typography>
    </Card>
  </Grid>

  <Grid item xs={12} md={3}>
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Typography color="#d32f2f" fontWeight="bold">
        ❌ Rejected
      </Typography>

      <Typography variant="h3" fontWeight="bold">
        {appointments.filter((a) => a.status === "rejected").length}
      </Typography>
    </Card>
  </Grid>
</Grid>

        {/* ================= MY APPOINTMENTS ================= */}
       <Box ref={bookingRef} sx={{ mt: 5 }}>
  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
    📅 Book Appointment
  </Typography>

  <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Select Doctor</InputLabel>
      <Select
        value={doctorId}
        label="Select Doctor"
        onChange={(e) => setDoctorId(e.target.value)}
      >
        {doctors.map((doc) => (
          <MenuItem key={doc._id} value={doc._id}>
            {doc.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      fullWidth
      type="date"
      value={appointmentDate}
      onChange={(e) => setAppointmentDate(e.target.value)}
      sx={{ mb: 2 }}
      // InputLabelProps={{ shrink: true }}
    />


<Grid container spacing={1} sx={{ mb: 2 }}>
  {timeSlots.map((time) => {
    const isBooked = bookedSlots.includes(time);

    return (
      <Grid item key={time}>
        <Button
          variant={appointmentTime === time ? "contained" : "outlined"}
          color={isBooked ? "error" : "primary"}
          disabled={isBooked}
          onClick={() => setAppointmentTime(time)}
        >
          {isBooked ? `${time} Booked` : time}
        </Button>
      </Grid>
    );
  })}
</Grid>

    <Button
      variant="contained"
      fullWidth
      onClick={bookAppointment}
      sx={{
        borderRadius: 3,
        py: 1.5,
      }}
    >
      Book Appointment
    </Button>
  </Card>
</Box>
        <Box ref={appointmentsRef} sx={{ mt: 5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            My Appointments
          </Typography>
          <Grid container spacing={2}>
            {appointments.map((a) => (
              <Grid item xs={12} key={a._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 3,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      👨‍⚕️ {a.doctorId?.name}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                      📅 {new Date(a.appointmentDate).toLocaleDateString()}
                    </Typography>

                    <Typography>
                      🕒 {a.appointmentTime}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={a.status.toUpperCase()}
                        color={
                          a.status === "approved"
                            ? "success"
                            : a.status === "rejected"
                            ? "error"
                            : "warning"
                        }
                      />
                    </Box>

                    {a.medicineInstructions && (
                      <Card
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "#E8F5E9",
                          borderLeft: "5px solid green",
                        }}
                      >
                        <Typography fontWeight="bold">
                          💊 Medicine Instructions
                        </Typography>

                        <Typography>
                          {a.medicineInstructions}
                        </Typography>
                      </Card>
                    )}

                    {a.status === "pending" && (
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ mt: 2 }}
                        onClick={() => cancelAppointment(a._id)}
                      >
                        Cancel Appointment
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ================= PROFILE ================= */}
        <Box ref={profileRef} sx={{ mt: 5, mb: 5 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            My Profile
          </Typography>

          <Card
            sx={{
              borderRadius: 4,
              p: 3,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">
              👤 {patient.name}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              📧 {patient.email}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              🏥 Role: Patient
            </Typography>
          </Card>
        </Box>

      </Box>
    </Box>
  );
}

export default PatientDashboard;