import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import logo from "../assets/MainLogoBlack.png";
import { useNavigate } from "react-router-dom";
import { sendForgotPasswordOTP } from "../api/userAuth";
import { useSnackbar } from "notistack";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      enqueueSnackbar("Please enter your email", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await sendForgotPasswordOTP(email);
      if (response.success) {
        enqueueSnackbar("OTP sent to your email", { variant: "success" });
        // Store email in sessionStorage for OTP verification
        sessionStorage.setItem("resetEmail", email);
        navigate("/otp");
      } else {
        // If success is false, show error and don't navigate
        enqueueSnackbar(response.message || "Failed to send OTP", { variant: "error" });
      }
    } catch (error) {
      // Ensure we don't navigate to OTP screen if user doesn't exist
      enqueueSnackbar(error.message || "Failed to send OTP. Please check if the email is registered.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="login-container">
        {/* Logo */}
        <div className="logo-container mb-3">
          <img src={logo} alt="CHOISEX" className="logo" />
        </div>

        {/* Title */}
        <h5 className="login-title">Forgot password</h5>

        {/* Login Card */}
        <div className="login-card">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label>Enter Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              className="login-btn w-100"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default ForgetPassword;
