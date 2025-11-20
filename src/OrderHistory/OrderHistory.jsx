import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import "./OrderHistory.css";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(stored.reverse()); // show latest first
  }, []);

  

  if (orders.length === 0)
    return <h5 className="text-center mt-5">No orders found!</h5>;

  return (
    <section className="order-history-section py-4">
      <Container>
        <h4 className="mb-4 fw-semibold">Order History</h4>

        {orders.map((order, index) => (
          <Card key={index} className="shadow-sm mb-4 order-card">
            <Card.Body>
              {/* Order Info Header */}
              <Row className="align-items-center mb-3">
                <Col md={8}>
                  <p className="small text-muted mb-1">
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p className="small text-muted mb-0">
                    <strong>Date:</strong> {order.date}
                  </p>
                  <p className="small text-muted mb-0">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`status-badge ${
                        order.status?.toLowerCase() === "confirmed"
                          ? "confirmed"
                          : "pending"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </p>
                </Col>
                <Col
                  md={4}
                  className="text-md-end text-center mt-3 mt-md-0 order-summary-actions"
                >
                  <Button
                    className="track-btn"
                    size="sm"
                    onClick={() => {
                      localStorage.setItem("checkoutData", JSON.stringify(order));
                      navigate("/track");
                    }}
                  >
                    Track Order
                  </Button>
                </Col>
              </Row>

              <hr />

              {/* Products Section */}
              <div className="scrollable-product-list">
                {order.cart.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center mb-3 border-bottom pb-2"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image me-3"
                    />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-1">{item.name}</p>
                      <p className="text-muted small mb-0">
                        <strong>Price:</strong> ₹{item.price}
                      </p>
                      <p className="text-muted small mb-0">
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p className="text-muted small mb-0">
                        <strong>SKU:</strong> {item.SKU}
                      </p>
                    </div>
                    <div className="ms-auto fw-semibold small text-end">
                      ₹{Number(item.price) * Number(item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Sub Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Tax</span>
                  <span>₹{order.totalAmount*3/100}</span>
                </div>
                <div className="d-flex justify-content-between small fw-bold">
                  <span>Total</span>
                  <span>₹{order.totalAmount + order.totalAmount*3/100}</span>
                </div>
              </div>

              <hr />

              {/* Address */}
              <div className="address-box p-3 rounded bg-light">
                <h6 className="fw-semibold mb-2 text-primary">
                  Shipping Address
                </h6>
                <p className="mb-0 small">
                  <strong>{order.address.name}</strong>
                </p>
                <p className="mb-0 small text-muted">
                  {order.address.address}, {order.address.area}
                </p>
                <p className="mb-0 small text-muted">
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.postal}
                </p>
                <p className="small text-muted mb-0">
                  <strong>Mobile:</strong> {order.address.mobile}
                </p>
                <p className="small text-muted mb-0">
                  <strong>Email:</strong> {order.address.email}
                </p>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </section>
  );
}

export default OrderHistory;
