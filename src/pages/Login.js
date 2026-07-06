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
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginbg from "../myassets/loginbg.jpg";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        alert("Invalid server response");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
  sx={{
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(13,71,161,0.55), rgba(25,118,210,0.55)), url(${loginbg})`,
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
    display: {
      xs: "none",
      md: "block",
    },
  }}
>
  <Typography
    variant="h2"
    fontWeight="bold"
    sx={{
      mb: 2,
      textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
    }}
  >
    🏥 Sujatha Murthy
    <br />
    Hospital
  </Typography>
  <Typography
    variant="h5"
    sx={{
      mb: 4,
      textShadow: "1px 1px 8px rgba(0,0,0,0.5)",
    }}
  >
    Caring for Life with
    <br />
    Trust, Technology & Compassion
  </Typography>
<Box sx={{ mt: 5 }}>
  <Typography sx={{ mb: 2, fontSize: "18px" }}>
    ✅ 24×7 Emergency Services
  </Typography>
  <Typography sx={{ mb: 2, fontSize: "18px" }}>
    ✅ Expert Doctors
  </Typography>
  <Typography sx={{ mb: 2, fontSize: "18px" }}>
    ✅ Modern Medical Equipment
  </Typography>
  <Typography sx={{ fontSize: "18px" }}>
    ✅ Trusted Patient Care
  </Typography>
</Box>
<Box
  sx={{
    mt: 5,
    width: "320px",
    bgcolor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    borderRadius: 4,
    p: 3,
    border: "1px solid rgba(255,255,255,0.3)",
  }}
>
  <Typography
    variant="h5"
    fontWeight="bold"
    color="white"
  >
    Excellence in Healthcare
  </Typography>

  <Typography
    sx={{
      mt: 2,
      color: "#f5f5f5",
      lineHeight: 1.8,
    }}
  >
    ✔️ 50+ Specialist Doctors
    <br />
    ✔️ 10,000+ Happy Patients
    <br />
    ✔️ Advanced Medical Technology
    <br />
    ✔️ 24×7 Emergency Support
  </Typography>
</Box>
</Box>
          {/* LOGIN CARD */}

          <Paper
            elevation={12}
            sx={{
  width: 420,
  p: 5,
  borderRadius: "25px",
  backdropFilter: "blur(18px)",
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  transition: "all 0.3s ease",

  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
  },
}}
        >
            <Box textAlign="center" mb={2}>
  <LocalHospitalIcon
    sx={{
      fontSize: 60,
      color: "#1976d2",
    }}
  />
  <Typography
    variant="h4"
    fontWeight="bold"
    color="primary"
  >
    Sujatha Murthy Hospital
  </Typography>

  <Typography color="text.secondary">
    Welcome Back
  </Typography>
</Box>

            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 1, mb: 4 }}
            >
              Login to your account
            </Typography>

            <TextField
  fullWidth
  label="Email Address"
  type="email"
  margin="normal"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <EmailIcon color="primary" />
      </InputAdornment>
    ),
  }}
  sx={{
    // "& .MuiOutlinedInput-root": {
    //   borderRadius: "15px",
    // },
    "& .MuiOutlinedInput-root": {
  borderRadius: "15px",
  backgroundColor: "#fafafa",

  "&:hover": {
    backgroundColor: "#ffffff",
  },

  "&.Mui-focused": {
    backgroundColor: "#ffffff",
  },
},
  }}
/>

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
        <LockIcon color="primary" />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
  sx={{
    // "& .MuiOutlinedInput-root": {
    //   borderRadius: "15px",
    // },
    "& .MuiOutlinedInput-root": {
  borderRadius: "15px",
  backgroundColor: "#fafafa",

  "&:hover": {
    backgroundColor: "#ffffff",
  },

  "&.Mui-focused": {
    backgroundColor: "#ffffff",
  },
},
  }}
/>

<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 1,
    mb: 2,
  }}
>
  <FormControlLabel
    control={<Checkbox color="primary" />}
    label="Remember Me"
  />

  <Link
    href="#"
    underline="hover"
    sx={{
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    Forgot Password?
  </Link>
</Box>
            <Button
  fullWidth
  variant="contained"
  size="large"
  onClick={handleLogin}
  disabled={loading}
  sx={{
  mt: 3,
  py: 1.6,
  borderRadius: "15px",
  fontWeight: "bold",
  fontSize: "16px",
  background: "linear-gradient(90deg,#1976d2,#42a5f5)",
  textTransform: "none",

  transform: "scale(1)",
  transition: "all 0.3s ease",

  "&:hover": {
    background: "linear-gradient(90deg,#1565c0,#1e88e5)",
    transform: "scale(1.03)",
  },
}}
>
  {loading ? "Logging in..." : "Login"}
</Button>

            <Typography
              align="center"
              sx={{
                mt: 3,
                color: "text.secondary",
              }}
            >
              Don't have an account?
            </Typography>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 1,
                borderRadius: "15px",
                py:1.2,
                textTransform:"none",
                fontWeight:"bold",
              }}
              onClick={() => navigate("/register")}
            >
             Create New Account
            </Button>

<Box
  sx={{
    mt: 3,
    display: "flex",
    justifyContent: "center",
    gap: 1,
    flexWrap: "wrap",
  }}
>
  <Typography
    sx={{
      bgcolor: "#E3F2FD",
      color: "#1976D2",
      px: 2,
      py: 0.8,
      borderRadius: "20px",
      fontWeight: "bold",
      fontSize: "13px",
    }}
  >
    🏥 Trusted Care
  </Typography>

  <Typography
    sx={{
      bgcolor: "#E8F5E9",
      color: "#2E7D32",
      px: 2,
      py: 0.8,
      borderRadius: "20px",
      fontWeight: "bold",
      fontSize: "13px",
    }}
  >
    👨‍⚕️ Expert Doctors
  </Typography>

  <Typography
    sx={{
      bgcolor: "#FFF3E0",
      color: "#EF6C00",
      px: 2,
      py: 0.8,
      borderRadius: "20px",
      fontWeight: "bold",
      fontSize: "13px",
    }}
  >
    🚑 24×7 Care
  </Typography>
</Box>


<Box sx={{ mt: 4, textAlign: "center" }}>
  <Typography
    variant="body2"
    color="text.secondary"
  >
    © 2026 Sujatha Murthy Hospital
  </Typography>

  <Typography
    variant="caption"
    color="text.secondary"
  >
    Caring for Life with Trust & Compassion
  </Typography>
</Box>


          </Paper>

        </Box>
      </Container>
    </Box>
  );
}

export default Login;