import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import hospital from "../myassets/hospital.png";

function Home() {
  const navigate = useNavigate();

  return (
    <Box>

      {/* ================= HERO SECTION ================= */}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "90vh",
          backgroundImage: `url(${hospital})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
          }}
        />

        {/* Hero Content */}
        <Container
          sx={{
            position: "relative",
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              letterSpacing: 3,
              color: "#90caf9",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            24 × 7 EMERGENCY CARE
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Welcome to
            <br />
            Sujatha Murthy Hospital
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              mb: 4,
            }}
          >
            Caring for Life with Trust, Technology and Compassion.
            We provide advanced healthcare with experienced doctors,
            modern facilities and quality treatment.
          </Typography>

          <Button
            variant="contained"
            color="success"
            size="large"
            sx={{ mr: 2 }}
            onClick={() => navigate("/login")}
          >
            Book Appointment
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              color: "white",
              borderColor: "white",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Container>
      </Box>





      {/* ================= ABOUT SECTION ================= */}

      <Box
        sx={{
          py: 8,
          bgcolor: "#f5f9ff",
        }}
      >
        <Container>

          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            About Sujatha Murthy Hospital
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            sx={{
              maxWidth: "900px",
              mx: "auto",
              mt: 2,
              mb: 6,
            }}
          >
            Sujatha Murthy Hospital is committed to providing
            world-class healthcare with compassion, advanced medical
            technology, experienced doctors, and patient-centered
            treatment.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >

            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                width: 220,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary">
                50+
              </Typography>

              <Typography fontWeight="bold">
                Expert Doctors
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                width: 220,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary">
                100+
              </Typography>

              <Typography fontWeight="bold">
                Hospital Beds
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                width: 220,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary">
                10000+
              </Typography>

              <Typography fontWeight="bold">
                Happy Patients
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "white",
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                width: 220,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary">
                24×7
              </Typography>

              <Typography fontWeight="bold">
                Emergency Care
              </Typography>
            </Box>

          </Box>

        </Container>
      </Box>

      {/* ================= SERVICES ================= */}

      <Box
        sx={{
          py: 8,
          bgcolor: "white",
        }}
      >
        <Container>

          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Our Medical Services
          </Typography>

          <Typography
            align="center"
            color="text.secondary"
            sx={{
              mb: 5,
            }}
          >
            We offer comprehensive healthcare services with experienced
            specialists and modern medical technology.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: 3,
            }}
          >

            {[
              "🫀 Cardiology",
              "🧠 Neurology",
              "🦴 Orthopedics",
              "👶 Pediatrics",
              "🩺 General Medicine",
              "🚑 Emergency Care",
            ].map((service) => (
              <Box
                key={service}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  boxShadow: 3,
                  textAlign: "center",
                  bgcolor: "#fafafa",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {service}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Quality healthcare services delivered by experienced
                  medical professionals.
                </Typography>
              </Box>
            ))}

          </Box>

        </Container>
      </Box>
      {/* ================= WHY CHOOSE US ================= */}

      <Box sx={{ py: 8, bgcolor: "#e3f2fd" }}>
        <Container>

          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Why Choose Us
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 3,
              mt: 5,
            }}
          >

            <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                👨‍⚕️ Experienced Doctors
              </Typography>

              <Typography sx={{ mt: 2 }}>
                Our highly qualified doctors provide quality healthcare with years of experience.
              </Typography>
            </Box>

            <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                🏥 Modern Equipment
              </Typography>

              <Typography sx={{ mt: 2 }}>
                Advanced medical technology for accurate diagnosis and treatment.
              </Typography>
            </Box>

            <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                ❤️ Patient Care
              </Typography>

              <Typography sx={{ mt: 2 }}>
                Compassionate care with a patient-first approach every day.
              </Typography>
            </Box>

          </Box>

        </Container>
      </Box>

      {/* ================= EMERGENCY ================= */}

      <Box
        sx={{
          bgcolor: "#d32f2f",
          color: "white",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          🚑 24 × 7 Emergency Services
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Call us anytime for immediate medical assistance.
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          sx={{ mt: 3 }}
        >
          Call Now
        </Button>
      </Box>

      {/* ================= FOOTER ================= */}

      <Box
        sx={{
          bgcolor: "#0d47a1",
          color: "white",
          py: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Sujatha Murthy Hospital
        </Typography>

        <Typography sx={{ mt: 1 }}>
          Providing Trusted Healthcare with Excellence
        </Typography>

        <Typography sx={{ mt: 1 }}>
          📍 Anantapur, Andhra Pradesh
        </Typography>

        <Typography>
          📞 +91 98765 43210
        </Typography>

        <Typography>
          ✉️ info@sujathamurthyhospital.com
        </Typography>

        <Typography sx={{ mt: 3 }}>
          © 2026 Sujatha Murthy Hospital. All Rights Reserved.
        </Typography>
      </Box>

    </Box>
  );
}

export default Home;