import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import{TextField} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import GroupIcon from "@mui/icons-material/Group";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({});
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);

  const dashboardRef = useRef(null);
  const usersRef = useRef(null);
  const appointmentsRef = useRef(null);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const API = process.env.REACT_APP_API_URL;

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, authHeader);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- FETCH APPOINTMENTS ----------------
  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/appointments`, authHeader);
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- FETCH STATS ----------------
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/stats`, authHeader);
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- DELETE USER ----------------
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/api/admin/user/${id}`, authHeader);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- APPROVE DOCTOR ----------------
  const approveDoctor = async (id) => {
    try {
      await axios.put(`${API}/api/admin/doctor/approve/${id}`, {}, authHeader);
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- UPDATE APPOINTMENT STATUS ----------------
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/admin/appointment/${id}`,
        { status },
        authHeader
      );

      fetchAppointments();
      fetchStats();
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchAppointments();
      fetchStats();
    }
  }, [token]);

  // ---------------- SOCKET ----------------
  useEffect(() => {
    socketRef.current = io(API);

    socketRef.current.on("doctorApproved", (doctor) => {
      setNotifications((prev) => [
        {
          message: `Doctor ${doctor.name} approved`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    socketRef.current.on("appointmentUpdated", (updated) => {
      setAppointments((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
    });

    return () => socketRef.current.disconnect();
  }, []);

  // ---------------- FILTERS ----------------
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === "all") return true;
    return a.status === statusFilter;
  });

  const drawerWidth = 240;

  return (
  <Box sx={{ display: "flex", background: "#f4f6f8", minHeight: "100vh" }}>
    {/* TOP BAR */}
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
        background: "linear-gradient(90deg,#0d47a1,#1976d2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          🏥 Sujatha Murthy Hospital Admin
        </Typography>
        <Button
          color="error"
          variant="contained"
          onClick={handleLogout}
          sx={{ borderRadius: "10px", fontWeight: "bold" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
    {/* SIDEBAR */}
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg,#1565c0,#42a5f5)",
          color: "white",
        },
      }}
    >
      <Toolbar />


<Box
  sx={{
    textAlign: "center",
    py: 3,
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  }}
>
  <LocalHospitalIcon sx={{ fontSize: 55, color: "#fff" }} />

  <Typography
    variant="h6"
    fontWeight="bold"
    sx={{ color: "white", mt: 1 }}
  >
    Sujatha Murthy
  </Typography>
  <Typography
    variant="body2"
    sx={{ color: "#E3F2FD" }}
  >
    Hospital
  </Typography>
</Box>
      <Box sx={{ p: 2 }}>
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 2,
  }}
>
  <NotificationsIcon />
  <Typography variant="h6" fontWeight="bold">
    Notifications
  </Typography>
</Box>
        {notifications.slice(0, 5).map((n, i) => (
          <Card
            key={i}
            sx={{
              mt: 1,
              p: 1,
              background: "rgba(255,255,255,0.15)",
              color: "white",
            }}
          >
            <Typography variant="body2">{n.message}</Typography>
            <Typography variant="caption">{n.time}</Typography>
          </Card>
        ))}
      </Box>
      <List>
  {[
    {
      text: "Dashboard",
      ref: dashboardRef,
      icon: <DashboardIcon />,
    },
    {
      text: "Users",
      ref: usersRef,
      icon: <PeopleIcon />,
    },
    {
      text: "Appointments",
      ref: appointmentsRef,
      icon: <EventNoteIcon />,
    },
  ].map((item,i) => (

          <ListItem key={i} disablePadding>
            <ListItemButton
              onClick={() =>
                item.ref.current?.scrollIntoView({
                  behavior: "smooth",
                  block:"start",
                })
              }
              sx={{
                "&:hover": {
                  background: "rgba(255,255,255,0.2)",
                },
              }}
            >
              
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
  }}
>
  {item.icon}
  <ListItemText primary={item.text} />
</Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>

    {/* MAIN CONTENT */}
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />

      {/* DASHBOARD CARDS */}
<Box ref={dashboardRef}>
  <Grid container spacing={3}>
    {[
  {
    label: "Users",
    value: stats.users,
    color: "#1976d2",
    icon: <GroupIcon sx={{ fontSize: 45, color: "#1976d2" }} />,
  },
  {
    label: "Doctors",
    value: stats.doctors,
    color: "#8E24AA",
    icon: <MedicalServicesIcon sx={{ fontSize: 45, color: "#8E24AA" }} />,
  },
  {
    label: "Patients",
    value: stats.patients,
    color: "#2E7D32",
    icon: <PersonIcon sx={{ fontSize: 45, color: "#2E7D32" }} />,
  },
  {
    label: "Appointments",
    value: stats.totalAppointments,
    color: "#EF6C00",
    icon: <CalendarMonthIcon sx={{ fontSize: 45, color: "#EF6C00" }} />,
  },
].map((s, i) => (
      <Grid item xs={12} md={3} key={i}>
        <Card
          sx={{
            p: 2,
            borderRadius: "15px",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
        sx={{
          color: s.color,
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {s.label}
      </Typography>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mt: 1 }}
      >
        {s.value || 0}
      </Typography>
    </Box>

    {s.icon}
  </Box>
</CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>


      {/* USERS + APPOINTMENTS BELOW (NO CHANGE IN LOGIC) */}
      <Box ref={usersRef} sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold">
          Users
        </Typography>
        <TextField
  label="Search Users"
  variant="outlined"
  size="small"
  value={userSearch}
  onChange={(e) => setUserSearch(e.target.value)}
  sx={{
    mt: 2,
    mb: 2,
    width: 300,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
    },
  }}
/>
          {/** KEEP YOUR ORIGINAL TABLE BODY HERE (UNCHANGED) */}
        {/* </TableContainer> */} 
        <TableContainer
  component={Paper}
  sx={{
    mt: 2,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
  }}
>
  <Table>
   
<TableHead>
  <TableRow
    sx={{
      background: "linear-gradient(90deg,#1565c0,#42a5f5)",
      "& th": {
        color: "white",
        fontWeight: "bold",
        fontSize: "15px",
      },
    }}
  >

        <TableCell>Name</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Role</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredUsers.map((u) => (
      <TableRow
  key={u._id}
  hover
  sx={{
    transition: "0.3s",
    "&:hover": {
      backgroundColor: "#E3F2FD",
    },
  }}
>
          <TableCell>{u.name}</TableCell>
          <TableCell>{u.email}</TableCell>

          <TableCell>
            <Chip
              label={u.role}
              color={
                u.role === "admin"
                  ? "error"
                  : u.role === "doctor"
                  ? "primary"
                  : "success"
              }
            />
          </TableCell>

          <TableCell>
            {u.role !== "admin" && (
              <Button
                color="error"
                variant="contained"
                onClick={() => deleteUser(u._id)}
              >
                Delete
              </Button>
            )}

            {u.role === "doctor" && !u.isApproved && (
              <Button
                sx={{ ml: 1 }}
                color="success"
                variant="contained"
                onClick={() => approveDoctor(u._id)}
              >
                Approve
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

      </Box>

      {/* <Box ref={appointmentsRef} sx={{ mt: 5 }}>
        <Typography variant="h6" fontWeight="bold">
          Appointments
        </Typography>

        <TableContainer
  component={Paper}
  sx={{
    mt: 2,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
  }}
>
          
        </TableContainer>
        <Table>
  <TableHead>
    <TableRow>
      <TableCell>Patient</TableCell>
      <TableCell>Doctor</TableCell>
      <TableCell>Date</TableCell>
      <TableCell>Time</TableCell>
      <TableCell>Status</TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {filteredAppointments.map((a) => (
      <TableRow
  key={a._id}
  hover
  sx={{
    transition: "0.3s",
    "&:hover": {
      backgroundColor: "#E3F2FD",
    },
  }}
>
        <TableCell>{a.patientId?.name}</TableCell>
        <TableCell>{a.doctorId?.name}</TableCell>
        <TableCell>
          {new Date(a.appointmentDate).toLocaleDateString()}
        </TableCell>
        <TableCell>{a.appointmentTime}</TableCell>

        <TableCell>
          <Chip
  label={a.status.toUpperCase()}
  color={
    a.status === "approved"
      ? "success"
      : a.status === "rejected"
      ? "error"
      : "warning"
  }
  sx={{
    fontWeight: "bold",
    borderRadius: "8px",
  }}
/>

          {a.status === "pending" && (
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                color="success"
                onClick={() => updateStatus(a._id, "approved")}
              >
                Approve
              </Button>

              <Button
                size="small"
                color="error"
                onClick={() => updateStatus(a._id, "rejected")}
              >
                Reject
              </Button>
            </Box>
          )}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      </Box> */}
      <Box ref={appointmentsRef} sx={{ mt: 5 }}>
  <Typography variant="h6" fontWeight="bold">
    Appointments
  </Typography>

  <TableContainer
    component={Paper}
    sx={{
      mt: 2,
      borderRadius: 4,
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
    }}
  >
    <Table>
      <TableHead>
        <TableRow
          sx={{
            background: "linear-gradient(90deg,#1565c0,#42a5f5)",
            "& th": {
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
            },
          }}
        >
          <TableCell>Patient</TableCell>
          <TableCell>Doctor</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {filteredAppointments.map((a) => (
          <TableRow
            key={a._id}
            hover
            sx={{
              transition: "0.3s",
              "&:hover": {
                backgroundColor: "#E3F2FD",
              },
            }}
          >
            <TableCell>{a.patientId?.name}</TableCell>
            <TableCell>{a.doctorId?.name}</TableCell>
            <TableCell>
              {new Date(a.appointmentDate).toLocaleDateString()}
            </TableCell>
            <TableCell>{a.appointmentTime}</TableCell>

            <TableCell>
              <Chip
                label={a.status.toUpperCase()}
                color={
                  a.status === "approved"
                    ? "success"
                    : a.status === "rejected"
                    ? "error"
                    : "warning"
                }
                sx={{
                  fontWeight: "bold",
                  borderRadius: "8px",
                }}
              />

              {a.status === "pending" && (
                <Box sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    color="success"
                    onClick={() => updateStatus(a._id, "approved")}
                  >
                    Approve
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => updateStatus(a._id, "rejected")}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>

    </Box>
  </Box>
);

}

export default AdminDashboard;