import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/login`,
          { email, password }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/register`,
          { name, email, password }
        );

        setIsLogin(true); // auto switch to login
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg,#0d47a1,#1976d2,#42a5f5)",
        overflow: "hidden",
      }}
    >
      {/* OUTER CONTAINER */}
      <Box
        sx={{
          width: "900px",
          height: "520px",
          display: "flex",
          borderRadius: "25px",
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        {/* SLIDING BACKGROUND PANEL */}
        <Box
          sx={{
            position: "absolute",
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(135deg,#7b1fa2,#26a69a)",
            transition: "all 0.6s ease-in-out",
            left: isLogin ? "0%" : "50%",
            zIndex: 1,
          }}
        />

        {/* LEFT PANEL (LOGIN INFO) */}
        <Box
          sx={{
            width: "50%",
            zIndex: 2,
            color: "white",
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: isLogin ? 1 : 0.7,
            transition: "0.4s",
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 60 }} />

          <Typography variant="h4" fontWeight="bold">
            Welcome Back
          </Typography>

          <Typography sx={{ mt: 2 }}>
            Login to continue your hospital dashboard access
          </Typography>

          <Button
            onClick={() => setIsLogin(true)}
            sx={{
              mt: 4,
              border: "2px solid white",
              color: "white",
              borderRadius: "20px",
            }}
          >
            Login
          </Button>
        </Box>

        {/* RIGHT PANEL (REGISTER INFO) */}
        <Box
          sx={{
            width: "50%",
            zIndex: 2,
            color: "white",
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            opacity: !isLogin ? 1 : 0.7,
            transition: "0.4s",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            New Here?
          </Typography>

          <Typography sx={{ mt: 2 }}>
            Create your hospital account in seconds
          </Typography>

          <Button
            onClick={() => setIsLogin(false)}
            sx={{
              mt: 4,
              border: "2px solid white",
              color: "white",
              borderRadius: "20px",
            }}
          >
            Register
          </Button>
        </Box>

        {/* LOGIN FORM */}
        <Box
          sx={{
            position: "absolute",
            width: "50%",
            height: "100%",
            left: 0,
            zIndex: 3,
            background: "white",
            transform: isLogin
              ? "translateX(0%)"
              : "translateX(100%)",
            transition: "0.6s ease-in-out",
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Login
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleAuth}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Box>

        {/* REGISTER FORM */}
        <Box
          sx={{
            position: "absolute",
            width: "50%",
            height: "100%",
            left: 0,
            zIndex: 3,
            background: "white",
            transform: isLogin
              ? "translateX(-100%)"
              : "translateX(0%)",
            transition: "0.6s ease-in-out",
            p: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Register
          </Typography>

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleAuth}
          >
            {loading ? "Loading..." : "Register"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AuthPage;