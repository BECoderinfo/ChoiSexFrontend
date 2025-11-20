import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSnackbar } from "notistack";
import { changePassword } from "../api/userAuth";


function Chengepassin() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      return;
    }

    if (formData.newPassword.length < 6) {
      enqueueSnackbar("New password must be at least 6 characters", { variant: "error" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      enqueueSnackbar("New password and confirm password do not match", { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        enqueueSnackbar("Password updated successfully", { variant: "success" });
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        enqueueSnackbar(response.message || "Failed to update password", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to update password", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="setting-section">
      <Container>
      <h5 className="section-title mb-4">Change Password</h5>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Card className="shadow-sm setting-card mx-auto">
              <div className="card-header-custom text-center">
                <h5 className="fw-semibold mb-0 text-start">Update Password</h5>
              </div>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      placeholder="Enter your Old Password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      placeholder="Enter your New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Enter your Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="text-center mt-3">
                    <Button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </Button>
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

export default Chengepassin;
