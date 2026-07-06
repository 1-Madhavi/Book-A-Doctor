import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [medicineInstructions, setMedicineInstructions] = useState({});
  const [error, setError] = useState("");

  const dashboardRef = useRef(null);
  const calendarRef = useRef(null);
  const appointmentsRef = useRef(null);
  const profileRef = useRef(null);

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_URL;

  const drawerWidth = 240;

  const doctor = JSON.parse(localStorage.getItem("user")) || {};

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${API}/api/appointments/doctor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data);
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/appointments/status/${id}`,
        {
          status,
          medicineInstructions:
            medicineInstructions[id] || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const filteredAppointments = appointments.filter((a) => {
    const apptDate = new Date(a.appointmentDate).toDateString();
    return apptDate === selectedDate.toDateString();
  });

  const totalAppointments = appointments.length;
  const approvedAppointments = appointments.filter(
    (a) => a.status === "approved"
  ).length;

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const rejectedAppointments = appointments.filter(
    (a) => a.status === "rejected"
  ).length;

  return (

    <Box
  sx={{
    display: "flex",
    background: "#f4f6f8",
    minHeight: "100vh",
  }}
>
  {/* APP BAR */}
  <AppBar
    position="fixed"
    sx={{
      zIndex: 1201,
      background: "linear-gradient(90deg,#0d47a1,#1976d2)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
    }}
  >
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Typography variant="h6" fontWeight="bold">
        🏥 Sujatha Murthy Hospital
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography fontWeight="bold">
          👨‍⚕️ {doctor.name}
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Toolbar>
  </AppBar>

  {/* SIDEBAR */}
  <Drawer
    variant="permanent"
    sx={{
      width: drawerWidth,
      "& .MuiDrawer-paper": {
        width: drawerWidth,
        background: "linear-gradient(180deg,#1565c0,#42a5f5)",
        color: "white",
        boxSizing: "border-box",
      },
    }}
  >
    <Toolbar />

    <Box sx={{ textAlign: "center", py: 3 }}>
      <LocalHospitalIcon sx={{ fontSize: 60 }} />
      <Typography variant="h6" fontWeight="bold">
        Doctor Panel
      </Typography>
      <Typography variant="body2">
        Welcome Doctor
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
            calendarRef.current?.scrollIntoView({
              behavior: "smooth",
            })
          }
        >
          <CalendarMonthIcon sx={{ mr: 2 }} />
          <ListItemText primary="Calendar" />
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
          <EventNoteIcon sx={{ mr: 2 }} />
          <ListItemText primary="Appointments" />
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

  {/* MAIN CONTENT */}
  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    <Toolbar />

    <Typography
      variant="h4"
      fontWeight="bold"
      gutterBottom
    >
      Doctor Dashboard
    </Typography>

    {error && (
      <Typography color="error" sx={{ mb: 2 }}>
        {error}
      </Typography>
    )}

    {/* DASHBOARD */}
    <Box ref={dashboardRef}>
      <Grid container spacing={3}>

        {[
          {
            title: "Appointments",
            value: totalAppointments,
            color: "#1976d2",
            icon: <CalendarMonthIcon sx={{ fontSize: 45 }} />,
          },
          {
            title: "Pending",
            value: pendingAppointments,
            color: "#fb8c00",
            icon: <PendingActionsIcon sx={{ fontSize: 45 }} />,
          },
          {
            title: "Approved",
            value: approvedAppointments,
            color: "#2e7d32",
            icon: <CheckCircleIcon sx={{ fontSize: 45 }} />,
          },
          {
            title: "Rejected",
            value: rejectedAppointments,
            color: "#d32f2f",
            icon: <CancelIcon sx={{ fontSize: 45 }} />,
          },
        ].map((card, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                transition: ".3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,.2)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      color={card.color}
                      fontWeight="bold"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight="bold"
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

      </Grid>
    </Box>

    {/* CALENDAR SECTION */}
    <Box ref={calendarRef} sx={{ mt: 5 }}>
      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Select Date
            </Typography>

            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box ref={appointmentsRef}>
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
              }}
            >
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Appointments for {selectedDate.toDateString()}
              </Typography>

              {loading && (
                <Typography>Loading appointments...</Typography>
              )}

              {!loading && filteredAppointments.length === 0 && (
                <Typography color="text.secondary">
                  No appointments found for this date.
                </Typography>
              )}

              {filteredAppointments.map((a) => (
                <Card
                  key={a._id}
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid #e0e0e0",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    👤 {a.patientId?.name}
                  </Typography>

                  <Typography>
                    📧 {a.patientId?.email}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
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

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Medicine Instructions"
                    sx={{ mt: 2 }}
                    value={medicineInstructions[a._id] || ""}
                    onChange={(e) =>
                      setMedicineInstructions({
                        ...medicineInstructions,
                        [a._id]: e.target.value,
                      })
                    }
                  />

                  {a.status === "pending" && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() =>
                          updateStatus(a._id, "approved")
                        }
                      >
                        Approve
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          updateStatus(a._id, "rejected")
                        }
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                </Card>
              ))}
            </Card>
          </Box>
        </Grid>

      </Grid>
    </Box>

    {/* PROFILE SECTION */}
    <Box ref={profileRef} sx={{ mt: 5 }}>
      <Card
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Doctor Profile
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Name:</strong> {doctor?.name || "Doctor"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Email:</strong> {doctor?.email || "Not Available"}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <strong>Role:</strong> Doctor
        </Typography>

        <Typography color="text.secondary">
          Welcome to the Sujatha Murthy Hospital Doctor Portal. Here you can
          manage appointments, approve or reject requests, and provide medicine
          instructions for your patients.
        </Typography>
      </Card>
    </Box>

  </Box>
</Box>
);
}

export default DoctorDashboard;