import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./OrdSummery.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";
import { useSnackbar } from "notistack";
import Loader, { useLoadingWithDelay } from "../Loader";

function OrdSummery() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const showLoader = useLoadingWithDelay(loading, 1000);
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
        } else {
          throw new Error(response.message || "Failed to load order");
        }
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to load order", {
          variant: "error",
        });
        navigate("/");
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
    return (
      <section className="order-success-section py-5">
        <Container>
          <h5 className="text-center mt-5">Order not specified!</h5>
          <div className="text-center mt-3">
            <Button 
              variant="primary" 
              onClick={() => navigate("/")}
              className="track-btn"
            >
              Return to Home
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  if (showLoader) {
    return (
      <section className="order-success-section py-5">
        <Container>
          <Loader fullScreen={true} size="large" />
        </Container>
      </section>
    );
  }

  if (!checkoutData) {
    return (
      <section className="order-success-section py-5">
        <Container>
          <h5 className="text-center mt-5">No order data found!</h5>
          <div className="text-center mt-3">
            <Button 
              variant="primary" 
              onClick={() => navigate("/")}
              className="track-btn"
            >
              Return to Home
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const { cart, address, totalAmount, date, paymentMethod } = checkoutData;

  // Total is already GST-inclusive
  const totalInclusive = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  
  // Calculate base price: Total / 1.18
  const basePrice = Number((totalInclusive / 1.18).toFixed(2));
  
  // Calculate GST: Total - Base Price
  const gst = Number((totalInclusive - basePrice).toFixed(2));

  return (
    <section className="order-success-section py-5">
      <Container>
        <Row className="align-items-start">
          {/* LEFT SIDE — Thank you and Billing info */}
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <div className="thankyou-box">
              <div>
                <h1 className="fw-bold mb-3">Thank you for your purchase!</h1>
                <p className="text-muted mb-4">
                  Your order will be processed within 24 hours during working
                  days. We will notify you by email once your order has been
                  shipped.
                </p>

                <div className="billing-info mb-4">
                  <h6 className="fw-semibold mb-3">Billing address</h6>
                  <p className="mb-2">
                    <strong>Name:</strong> {address?.name || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Address:</strong> {address?.address || "N/A"},{" "}
                    {address?.area || ""}, {address?.city || ""},{" "}
                    {address?.state || ""} - {address?.postal || ""}
                  </p>
                  <p className="mb-2">
                    <strong>Mobile No.:</strong> +91 {address?.mobile || "N/A"}
                  </p>
                  <p className="mb-0">
                    <strong>Email:</strong> {address?.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                <Button 
                  className="track-btn" 
                  onClick={() => navigate(`/track/${orderId}`)}
                >
                  Track Your Order
                </Button>
               
              </div>
            </div>
          </Col>

          {/* RIGHT SIDE — Order summary */}
          <Col xs={12} lg={6}>
            <div className="receipt-wrapper mx-auto">
              <Card className="receipt-card">
                <Card.Header className="receipt-header">
                  <h5 className="fw-semibold mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="summary-top mb-3">
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Date:</span>
                      <span>{date ? new Date(date).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Order Number:</span>
                      <span  style={{ maxWidth: "200px" }}>
                        {orderId}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>Payment Method:</span>
                      <span>{paymentMethod || "N/A"}</span>
                    </div>
                  </div>

                  <hr className="my-3" />

                  {/* Scrollable Product List */}
                  <div className="scrollable-product-list mb-3">
                    {cart.map((product, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-3 border-bottom pb-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image me-3"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60";
                          }}
                        />
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-semibold small text-truncate">
                            {product.name}
                          </p>
                          <div className="d-flex flex-wrap gap-2">
                            <p className="text-muted small mb-0">
                              Qty: {product.quantity}
                            </p>
                            <p className="text-muted small mb-0">
                              Model: {product.SKU}
                            </p>
                          </div>
                        </div>
                        <div className="ms-auto fw-semibold small text-nowrap">
                          ₹{(Number(product.price) * Number(product.quantity)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between small mb-2">
                    <span>Sub Total (Base Price)</span>
                    <span>₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>

                  <hr className="my-3" />

                  <div className="d-flex justify-content-between fw-bold pt-2">
                    <span>Total Amount (Inclusive of GST)</span>
                    <span className="text-success">₹{totalInclusive.toFixed(2)}</span>
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