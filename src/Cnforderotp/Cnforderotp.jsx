import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSnackbar } from "notistack"; // ✅ import Snackbar hook
import "./Cnforderotp.css";
import { useNavigate } from "react-router-dom";

function Cnforderotp() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); // ✅ Snackbar instance

  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (mobile.trim().length !== 10 || !/^[0-9]+$/.test(mobile)) {
      enqueueSnackbar("Please enter a valid 10-digit mobile number!", {
        variant: "error",
      });
      return;
    }

    setIsOtpSent(true);
    enqueueSnackbar(`OTP sent successfully to ${mobile}`, {
      variant: "success",
    });
  };

  const handleSubmit = () => {
    if (!otp.trim()) {
      enqueueSnackbar("Please enter OTP!", { variant: "warning" });
      return;
    }

    enqueueSnackbar(`OTP verified successfully!`, {
      variant: "success",
    });

    setTimeout(() => {
        navigate("/ordsummery");
    }, 1200);
  };

  return (
    <section className="otp-section py-4">
      <Container>
        <h4 className="mb-4 section-title">Enter OTP</h4>

        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-sm otp-card">
              <div className="card-header-custom">
                <h5 className="fw-semibold mb-0">Confirm Order</h5>
              </div>

              <Card.Body className="p-4">
                <p
                  className="text-muted small mb-4"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Dear Customer,
                  <br />
                  To confirm your order, please verify your mobile number using
                  the OTP:
                </p>

                <Form>
                  {/* Mobile Input + Send OTP */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      Enter Mobile Number
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2 otp-row">
                      <Form.Control
                        type="text"
                        placeholder="Enter your Mobile number"
                        value={mobile}
                        maxLength={10}
                        onChange={(e) => setMobile(e.target.value)}
                        className="form-input"
                      />
                      <Button
                        className="form-btn"
                        onClick={handleSendOtp}
                        disabled={isOtpSent}
                      >
                        {isOtpSent ? "OTP Sent" : "Send OTP"}
                      </Button>
                    </div>
                  </Form.Group>

                  {/* OTP Input + Submit */}
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <div className="d-flex align-items-center gap-2 otp-row">
                      <Form.Control
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                        className="form-input"
                      />
                      <Button
                        className="form-btn submit-btn"
                        variant="success"
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form.Group>

                  <p className="confidential-text mt-3 small text-muted text-center">
                    Your personal information, including your mobile number and
                    any verification details, will be kept strictly
                    confidential and will not be shared with any third party.
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Cnforderotp;
