import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/MainLogoBlack.png";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/userAuth";
import { useSnackbar } from "notistack";

function SetPassWord() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    // Check if reset token exists
    const resetToken = sessionStorage.getItem("resetToken");
    if (!resetToken) {
      enqueueSnackbar("Please complete OTP verification first", { variant: "error" });
      navigate("/forgetpassword");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resetToken = sessionStorage.getItem("resetToken");
    if (!resetToken) {
      enqueueSnackbar("Reset token not found. Please start again.", { variant: "error" });
      navigate("/forgetpassword");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    if (formData.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", { variant: "error" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(resetToken, formData.password);
      if (response.success) {
        // Clear session storage
        sessionStorage.removeItem("resetToken");
        sessionStorage.removeItem("resetEmail");
        enqueueSnackbar("Password reset successfully!", { variant: "success" });
        navigate("/login");
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to reset password", { variant: "error" });
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
        <h5 className="login-title">Set Password</h5>

        {/* Login Card */}
        <div className="login-card">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="newpassword">
              <Form.Label>New Password</Form.Label>
              <div className="password-wrapper">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {showPassword ? (
                  <Eye
                    className="eye-icon"
                    size={18}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <EyeOff
                    className="eye-icon"
                    size={18}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cnfpassword">
              <Form.Label>Confirm Password</Form.Label>
              <div className="password-wrapper">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {showConfirmPassword ? (
                  <Eye
                    className="eye-icon"
                    size={18}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <EyeOff
                    className="eye-icon"
                    size={18}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="login-btn w-100"
              disabled={loading}
            >
              {loading ? "Setting password..." : "Set Password"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default SetPassWord;
