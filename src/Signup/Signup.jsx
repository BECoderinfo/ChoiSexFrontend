import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/MainLogoBlack.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
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
      const result = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (result.success) {
        enqueueSnackbar("Account created successfully!", { variant: "success" });
        navigate("/");
      } else {
        enqueueSnackbar(result.message || "Signup failed", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Signup failed", { variant: "error" });
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
        <h5 className="login-title">Register</h5>

        {/* Login Card */}
        <div className="login-card">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="phone">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="password-wrapper">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
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
            <Form.Group className="mb-4" controlId="cnfpassword">
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
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="text-center mt-3">
              <p className="signup-text">
                Already have a Account ? {" "}
                <NavLink to={'/login'} className="create-link">
                  Login
                </NavLink>
              </p>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Signup;
