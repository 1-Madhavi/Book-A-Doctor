import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import registerbg from "../myassets/registerbg.jpg";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { name, email, password }
      );

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(123,31,162,0.55), rgba(0,150,136,0.55)), url(${registerbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 5,
            flexWrap: "wrap",
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              flex: 1,
              color: "white",
              display: { xs: "none", md: "block" },
            }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{ mb: 2, textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
            >
              🏥 Join
              <br />
              Sujatha Murthy
              <br />
              Hospital
            </Typography>

            <Typography
              variant="h5"
              sx={{ mb: 4, textShadow: "1px 1px 8px rgba(0,0,0,0.5)" }}
            >
              Start your journey of
              <br />
              trusted healthcare access
            </Typography>

            <Box sx={{ mt: 5 }}>
              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                ✅ Quick Patient Registration
              </Typography>
              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                ✅ Instant Doctor Access
              </Typography>
              <Typography sx={{ mb: 2, fontSize: "18px" }}>
                ✅ Secure Medical Records
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                ✅ 24×7 Hospital Support
              </Typography>
            </Box>
          </Box>

          {/* REGISTER CARD */}
          <Paper
            elevation={12}
            sx={{
              width: 420,
              p: 5,
              borderRadius: "25px",
              background: "rgba(255,255,255,0.93)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              transition: "all 0.3s ease",

              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
              },
            }}
          >
            {/* HEADER */}
            <Box textAlign="center" mb={2}>
              <LocalHospitalIcon
                sx={{ fontSize: 60, color: "#7b1fa2" }}
              />

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#7b1fa2" }}
              >
                Create Account
              </Typography>

              <Typography color="text.secondary">
                Join our hospital system
              </Typography>
            </Box>

            {/* NAME */}
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "#fafafa",
                  "&:hover": { backgroundColor: "#fff" },
                  "&.Mui-focused": { backgroundColor: "#fff" },
                },
              }}
            />

            {/* EMAIL */}
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "#fafafa",
                  "&:hover": { backgroundColor: "#fff" },
                  "&.Mui-focused": { backgroundColor: "#fff" },
                },
              }}
            />

            {/* PASSWORD */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#7b1fa2" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  backgroundColor: "#fafafa",
                  "&:hover": { backgroundColor: "#fff" },
                  "&.Mui-focused": { backgroundColor: "#fff" },
                },
              }}
            />

            {/* BUTTON */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleRegister}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.6,
                borderRadius: "15px",
                fontWeight: "bold",
                fontSize: "16px",
                background:
                  "linear-gradient(90deg,#7b1fa2,#26a69a)",
                textTransform: "none",
                transition: "all 0.3s ease",

                "&:hover": {
                  transform: "scale(1.03)",
                  background:
                    "linear-gradient(90deg,#6a1b9a,#00897b)",
                },
              }}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>

            {/* LOGIN LINK */}
            <Typography
              align="center"
              sx={{ mt: 3, color: "text.secondary" }}
            >
              Already have an account?
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                mt: 1,
                borderRadius: "15px",
                py: 1.2,
                fontWeight: "bold",
                textTransform: "none",
                borderColor: "#7b1fa2",
                color: "#7b1fa2",
              }}
            >
              Login Here
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Register;