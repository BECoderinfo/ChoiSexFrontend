import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./OrdSummery.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";
import { useSnackbar } from "notistack";

function OrdSummery() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await orderAPI.getOrder(orderId);
        if (response.success) {
          setCheckoutData(response.data);
        }
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to load order", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      enqueueSnackbar("Please login to see order summary", {
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    loadOrder();
  }, [orderId, isAuthenticated, enqueueSnackbar, navigate]);

  if (!orderId) {
    return <h5 className="text-center mt-5">Order not specified!</h5>;
  }

  if (loading) {
    return <h5 className="text-center mt-5">Loading order...</h5>;
  }

  if (!checkoutData)
    return <h5 className="text-center mt-5">No order data found!</h5>;

  const {  cart, address, totalAmount, date, paymentMethod } = checkoutData;

  const subTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const tax = (subTotal * 3) / 100;
  const grandTotal = subTotal + tax;

  return (
    <section className="order-success-section py-5">
      <Container>
        <Row className="align-items-start">
          {/* ✅ LEFT SIDE — Thank you and Billing info */}
          <Col md={6} className="mb-4">
            <div className="thankyou-box">
              <h1 className="fw-bold mb-3">Thank you for your purchase!</h1>
              <p className="text-muted mb-4">
                Your order will be processed within 24 hours during working
                days. We will notify you by email once your order has been
                shipped.
              </p>

              <div className="billing-info mb-4">
                <h6 className="fw-semibold mb-3">Billing address</h6>
                <p className="mb-1"><strong>Name:</strong> {address.name}</p>
                <p className="mb-1">
                  <strong>Address:</strong> {address.address}, {address.area},{" "}
                  {address.city}, {address.state} - {address.postal}
                </p>
                <p className="mb-1">
                  <strong>Mobile No.:</strong> +91 {address.mobile}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {address.email}
                </p>
              </div>

              <Button className="track-btn" onClick={() => navigate(`/track/${orderId}`)}>
                Track Your Order
              </Button>
            </div>
          </Col>

          {/* ✅ RIGHT SIDE — Order summary */}
          <Col md={6}>
            <div className="receipt-wrapper mx-auto">
              <Card className="receipt-card">
                <Card.Header className="receipt-header">
                  <h5 className="fw-semibold mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="summary-top mb-3">
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Date:</span>
                      <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Order Number:</span>
                      <span>{orderId}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Payment Method:</span>
                      <span>{paymentMethod}</span>
                    </div>
                  </div>

                  <hr />

                  {/* ✅ Scrollable Product List */}
                  <div className="scrollable-product-list mb-3">
                    {cart.map((product, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3 border-bottom pb-2"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image me-3"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-semibold small">{product.name}</p>
                          <p className="text-muted small mb-0">
                            Qty: {product.quantity}
                          </p>
                          <p className="text-muted small mb-0">
                            Model: {product.SKU}
                          </p>
                        </div>
                        <div className="ms-auto fw-semibold small">
                          ₹{Number(product.price) * Number(product.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between small mb-1">
                    <span>Sub Total</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Tax (3%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default OrdSummery;
