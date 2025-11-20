import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./Login.css";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/MainLogoBlack.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/");
      } else {
        enqueueSnackbar(result.message || "Login failed", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Login failed", { variant: "error" });
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
        <h5 className="login-title">Log in</h5>

        {/* Login Card */}
        <div className="login-card">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="password-wrapper">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="text-end mb-3">
              <NavLink to={'/forgetpassword'} className="forgot-link">
                Forgot password ?
              </NavLink>
            </div>

            <Button
              type="submit"
              className="login-btn w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <div className="text-center mt-3">
              <p className="signup-text">
                Don't have an Account ?{" "}
                <NavLink to={'/register'} className="create-link">
                  Register
                </NavLink>
              </p>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
