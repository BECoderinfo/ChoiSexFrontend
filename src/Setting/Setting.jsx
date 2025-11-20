import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "./Setting.css";
import { NavLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/userAuth";

function Setting() {
  const { user, checkAuth } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      enqueueSnackbar("Name is required", { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone?.trim() || "",
      });

      if (response.success) {
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
        await checkAuth();
      } else {
        enqueueSnackbar(response.message || "Failed to update profile", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to update profile", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="setting-section">
      <Container>
      <h5 className="section-title mb-4">Settings</h5>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Card className="shadow-sm setting-card mx-auto">
              <div className="card-header-custom text-center">
                <h5 className="fw-semibold mb-0 text-start">Update Profile</h5>
              </div>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      disabled
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Enter your mobile number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="text-center mt-3">
                    <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <NavLink to={'/changepassword'} className="change-password">
                      Change Password ?
                    </NavLink>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Setting;
