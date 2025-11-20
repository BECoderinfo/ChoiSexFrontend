import React, { useRef, useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import logo from "../assets/MainLogoBlack.png";
import { useNavigate } from "react-router-dom";
import { verifyOTP } from "../api/userAuth";
import { useSnackbar } from "notistack";

function OTP() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digit OTP
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      enqueueSnackbar("Please start from forgot password page", { variant: "error" });
      navigate("/forgetpassword");
    } else {
      setEmail(storedEmail);
    }
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      enqueueSnackbar("Please enter complete OTP", { variant: "error" });
      return;
    }

    if (!email) {
      enqueueSnackbar("Email not found. Please start again.", { variant: "error" });
      navigate("/forgetpassword");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOTP(email, otpString);
      if (response.success) {
        // Store reset token in sessionStorage
        sessionStorage.setItem("resetToken", response.resetToken);
        enqueueSnackbar("OTP verified successfully", { variant: "success" });
        navigate("/setPass");
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Invalid OTP", { variant: "error" });
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
        <h5 className="login-title">Enter OTP</h5>

        {/* Login Card */}
        <div className="login-card">
          <Form>
            <p className="signup-text text-center mb-3">Check your email for OTP</p>

            <div className="otp-container">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={digit}
                  maxLength="1"
                  className="otp-box"
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            <Button
              className="login-btn w-100 mt-3"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default OTP;
