import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { CheckCircle, UserCheck, Truck, Package } from "lucide-react";
import "./Track.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";
import { useSnackbar } from "notistack";
import Loader, { useLoadingWithDelay } from "../Loader";

function Track() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const showLoader = useLoadingWithDelay(loading, 1000);
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
          setOrderData(response.data);
        } else {
          throw new Error(response.message || "Failed to load order");
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
      setLoading(false);
      return;
    }

    loadOrder();
  }, [orderId, isAuthenticated, enqueueSnackbar]);

  if (!orderId) {
    return (
      <section className="track-section py-5">
        <Container>
          <h5 className="text-center mt-4">Order not specified!</h5>
        </Container>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="track-section py-5">
        <Container>
          <h5 className="text-center mt-4">Please login to track orders.</h5>
        </Container>
      </section>
    );
  }

  if (showLoader) {
    return (
      <section className="track-section py-5">
        <Container>
          <Loader fullScreen={true} size="large" />
        </Container>
      </section>
    );
  }

  if (!orderData) {
    return (
      <section className="track-section py-5">
        <Container>
          <h5 className="text-center mt-4">No order found!</h5>
        </Container>
      </section>
    );
  }

  const { cart, status, date, paymentMethod, address } = orderData;

  const fixDate = (str) => {
    if (!str) return new Date();
    
    try {
      const [datePart, timePart] = str.split(", ");
      const [day, month, year] = datePart.split("/");
      
      let [time, modifier] = timePart.split(" ");
      let [hours, minutes, seconds] = time.split(":");

      hours = parseInt(hours);
      if (modifier.toLowerCase() === "pm" && hours < 12) {
        hours += 12;
      }
      if (modifier.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
      return new Date(`${year}-${month}-${day}T${formattedTime}`);
    } catch (error) {
      console.error("Date parsing error:", error);
      return new Date();
    }
  };

  // Define tracking steps
  const steps = [
    { label: "Order confirmed", icon: <CheckCircle size={20} /> },
    { label: "Picked by courier", icon: <UserCheck size={20} /> },
    { label: "On the way", icon: <Truck size={20} /> },
    { label: "Ready for pickup", icon: <Package size={20} /> },
  ];

  // Set current progress dynamically
  const statusIndex =
    status === "Confirmed"
      ? 0
      : status === "Picked by the courier"
      ? 1
      : status === "On the way"
      ? 2
      : 3;

  // Calculate totals
  const subTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const tax = (subTotal * 3) / 100;
  const total = subTotal + tax;

  return (
    <section className="track-section py-4">
      <Container>
        <h5 className="section-title">Order Tracking</h5>

        <Card className="shadow-sm tracking-card">
          <Card.Body className="p-0">
            <p className="fw-semibold small text-muted mb-3">
              Order ID:{" "}
              <span className="text-dark text-truncate-container">
                {orderId}
              </span>
            </p>

            <Row className="mb-4">
              <Col xs={12} sm={6} md={3}>
                <p className="small mb-1 text-muted">Estimated Delivery:</p>
                <p className="fw-semibold">
                  {fixDate(date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <p className="small mb-1 text-muted">Shipping BY:</p>
                <p className="fw-semibold">BlueDart - +91 98675 98644</p>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <p className="small mb-1 text-muted">Status:</p>
                <p className="fw-semibold">{status || "Processing"}</p>
              </Col>
              <Col xs={12} sm={6} md={3}>
                <p className="small mb-1 text-muted">Payment:</p>
                <p className="fw-semibold">{paymentMethod || "N/A"}</p>
              </Col>
            </Row>

            {/* Dynamic Progress Tracker */}
            <div className="progress-tracker d-flex justify-content-between align-items-center mb-5">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`tracker-step ${
                      index <= statusIndex ? "completed" : ""
                    }`}
                  >
                    <div className="tracker-icon">{step.icon}</div>
                    <p className="tracker-label">{step.label}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`progress-line d-none d-md-block ${
                        index < statusIndex ? "completed" : ""
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Product List + Address */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4">
              {/* Product Info */}
              <div className="product-box w-100">
                <h6 className="fw-semibold mb-3">Products in your order</h6>
                {cart.map((product, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center mb-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image me-3"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/70";
                      }}
                    />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-1 text-truncate">
                        {product.name}
                      </p>
                      <div className="d-flex flex-wrap gap-2">
                        <p className="text-muted small mb-0">
                          <strong>Price:</strong> ₹{product.price}
                        </p>
                        <p className="text-muted small mb-0">
                          <strong>Qty:</strong> {product.quantity}
                        </p>
                        <p className="text-muted small mb-0">
                          <strong>SKU:</strong> {product.SKU}
                        </p>
                      </div>
                    </div>
                    <div className="ms-auto fw-semibold small text-nowrap">
                      ₹{(Number(product.price) * Number(product.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}

                {/* Order Summary Section */}
                <div className="order-summary mt-4">
                  <hr />
                  <div className="d-flex justify-content-between small mb-2">
                    <span>Sub Total</span>
                    <span>₹{subTotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-2">
                    <span>Tax (3%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold pt-1">
                    <span>Total Amount</span>
                    <span className="text-success">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="address-box">
                <h6 className="fw-semibold mb-3">Shipping Address</h6>
                <p className="mb-2">
                  <strong>{address?.name || "N/A"}</strong>
                </p>
                <p className="mb-1 small text-muted">
                  {address?.address || ""}, {address?.area || ""}
                </p>
                <p className="mb-1 small text-muted">
                  {address?.city || ""}, {address?.state || ""} - {address?.postal || ""}
                </p>
                <p className="mb-1 small text-muted">
                  <strong>Mobile:</strong> {address?.mobile || "N/A"}
                </p>
                <p className="mb-0 small text-muted">
                  <strong>Email:</strong> {address?.email || "N/A"}
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default Track;