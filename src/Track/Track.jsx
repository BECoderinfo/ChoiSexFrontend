import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { CheckCircle, UserCheck, Truck, Package } from "lucide-react";
import "./Track.css";

function Track() {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("checkoutData"));
    setOrderData(stored);
  }, []);

  if (!orderData) return <h5 className="text-center mt-4">No order found!</h5>;

  const { orderId, cart, status, date, paymentMethod, address } = orderData;

  // ✅ Define tracking steps
  const steps = [
    { label: "Order confirmed", icon: <CheckCircle /> },
    { label: "Picked by courier", icon: <UserCheck /> },
    { label: "On the way", icon: <Truck /> },
    { label: "Ready for pickup", icon: <Package /> },
  ];

  // ✅ Set current progress dynamically
  const statusIndex =
    status === "Confirmed"
      ? 0
      : status === "Picked by the courier"
      ? 1
      : status === "On the way"
      ? 2
      : 3;

  // ✅ Calculate totals
  const subTotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const tax = (subTotal * 3) / 100;
  const total = subTotal + tax;

  return (
    <section className="track-section py-4">
      <Container>
        <h4 className="mb-4 fw-semibold">Order Tracking</h4>

        <Card className="shadow-sm tracking-card">
          <Card.Body>
            <p className="fw-semibold small text-muted mb-3">
              Order ID : <span className="text-dark">{orderId}</span>
            </p>

            <Row className="mb-4">
              <Col md={3} sm={6}>
                <p className="small mb-1 text-muted">Estimated Delivery Time:</p>
                <p className="fw-semibold">
                  {new Date(date).toLocaleDateString()}
                </p>
              </Col>
              <Col md={3} sm={6}>
                <p className="small mb-1 text-muted">Shipping BY:</p>
                <p className="fw-semibold">BlueDart - +91 98675 98644</p>
              </Col>
              <Col md={3} sm={6}>
                <p className="small mb-1 text-muted">Status:</p>
                <p className="fw-semibold">{status}</p>
              </Col>
              <Col md={3} sm={6}>
                <p className="small mb-1 text-muted">Payment:</p>
                <p className="fw-semibold">{paymentMethod}</p>
              </Col>
            </Row>

            {/* ✅ Dynamic Progress Tracker */}
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
                      className={`progress-line ${
                        index < statusIndex ? "completed" : ""
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* ✅ Product List + Address */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
              {/* ✅ Product Info - Multiple */}
              <div className="product-box w-100 mb-4">
                <h6 className="fw-semibold mb-3">Products in your order</h6>
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
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-1">{product.name}</p>
                      <p className="text-muted small mb-0">
                        <strong>Price:</strong> ₹{product.price}
                      </p>
                      <p className="text-muted small mb-0">
                        <strong>Quantity:</strong> {product.quantity}
                      </p>
                      <p className="text-muted small mb-0">
                        <strong>SKU:</strong> {product.SKU}
                      </p>
                    </div>
                    <div className="ms-auto fw-semibold small text-end">
                      ₹{(Number(product.price) * Number(product.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}

                {/* ✅ Order Summary Section (like image) */}
                <div className="order-summary mt-4">
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
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ✅ Address Info */}
              <div
                className="address-box p-3 rounded bg-light flex-shrink-0"
                style={{ minWidth: "280px" }}
              >
                <h6 className="fw-semibold mb-2">Shipping Address</h6>
                <p className="mb-0">
                  <strong>{address.name}</strong>
                </p>
                <p className="mb-0 small text-muted">
                  {address.address}, {address.area}
                </p>
                <p className="mb-0 small text-muted">
                  {address.city}, {address.state} - {address.postal}
                </p>
                <p className="small text-muted mb-0">
                  <strong>Mobile:</strong> {address.mobile}
                </p>
                <p className="small text-muted mb-0">
                  <strong>Email:</strong> {address.email}
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
