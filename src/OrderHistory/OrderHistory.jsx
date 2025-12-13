import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import "./OrderHistory.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";
import { useSnackbar } from "notistack";
import { ShoppingCart, CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import Loader, { useLoadingWithDelay } from "../Loader";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoader = useLoadingWithDelay(loading, 1000);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const loadOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await orderAPI.getOrders();
        if (response.success && response.data) {
          const orders = response.data;
          for (const order of orders) {
            const trackRes = await orderAPI.getTracking(order.orderId);
            if (trackRes.success) {
              order.tracking = trackRes.data || null;
            }
          }
          setOrders(orders);
        }
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to load orders", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, enqueueSnackbar]);

  // Status badge helper function
  const getStatusBadge = (status) => {
    const statusConfig = {
      Delivered: { 
        class: "status-delivered", 
        icon: <CheckCircle size={14} />, 
        label: "Delivered" 
      },
      Pending: { 
        class: "status-pending", 
        icon: <Clock size={14} />, 
        label: "Pending" 
      },
      Shipped: { 
        class: "status-shipped", 
        icon: <Truck size={14} />, 
        label: "Shipped" 
      },
      Cancelled: { 
        class: "status-cancelled", 
        icon: <XCircle size={14} />, 
        label: "Cancelled" 
      },
      Confirmed: { 
        class: "status-pending", 
        icon: <Clock size={14} />, 
        label: "Pending" 
      },
    };
    return statusConfig[status] || statusConfig["Pending"];
  };

  if (showLoader) {
    return (
      <Container className="text-center py-5">
        <Loader fullScreen={true} size="large" />
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="empty-cart-container text-center py-5">
        <div className="empty-cart-box">
          <ShoppingCart size={80} color="#a60063" className="mb-3" />
          <h3 className="empty-cart-title">No Orders Found</h3>
          <p className="empty-cart-text">
          You haven't made any purchases yet.
          </p>
          <Button className="continue-btn mt-3" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <section className="order-history-section py-4">
      <Container>
        <h5 className="section-title">Order History</h5>

        {orders.map((order, index) => {
          // Total is already GST-inclusive
          const totalInclusive = order.cart?.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0
          ) || Number(order.totalAmount) || 0;
          
          // Calculate base price: Total / 1.18
          const basePrice = Number((totalInclusive / 1.18).toFixed(2));
          
          // Calculate GST: Total - Base Price
          const gst = Number((totalInclusive - basePrice).toFixed(2));

          return (
            <Card key={index} className="shadow-sm mb-4 order-card">
              {/* Order Info Header */}
              <Card.Body>
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
                      <span className={`status-badge ${statusInfo.class}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
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
                      onClick={() => navigate(`/track/${order.orderId}`)}
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
                    <span>Sub Total (Base Price)</span>
                    <span>₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>GST (18%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small fw-bold">
                    <span>Total (Inclusive of GST)</span>
                    <span>₹{totalInclusive.toFixed(2)}</span>
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
          );
        })}
      </Container>
    </section>
  );
}

export default OrderHistory;
