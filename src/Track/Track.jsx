import React, { useEffect, useMemo, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import {
  CheckCircle,
  UserCheck,
  Truck,
  Package,
  Link2,
} from "lucide-react";
import "./Track.css";
import { useParams, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";
import Loader, { useLoadingWithDelay } from "../Loader";

function Track() {
  const [orderData, setOrderData] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const showLoader = useLoadingWithDelay(loading, 800);
  const { orderId: orderIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const orderId = orderIdParam || searchParams.get("orderId");

  /** --------------------------
   * TRACKING STEPS UI
   * -------------------------- */
  const steps = [
    { label: "Order Confirmed", icon: <CheckCircle size={20} /> },
    { label: "Picked by Courier", icon: <UserCheck size={20} /> },
    { label: "On the Way", icon: <Truck size={20} /> },
    { label: "Ready for Pickup", icon: <Package size={20} /> },
  ];

  const status = tracking?.status || "Order Confirmed";

  const statusIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.label === status);
    return idx === -1 ? 0 : idx;
  }, [status]);
  

  /** --------------------------
   * FETCH ORDER + TRACKING DATA
   * -------------------------- */
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const orderRes = await orderAPI.getOrder(orderId);
        if (orderRes.success) setOrderData(orderRes.data);
        else throw new Error(orderRes.message);

        const trackRes = await orderAPI.getTracking(orderId);
        if (trackRes.success) setTracking(trackRes.data || null);
      } catch (err) {
        enqueueSnackbar(err.message || "Failed to load order", {
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

  const hasTracking =
    tracking?.referenceNumber ||
    tracking?.estimateDate ||
    tracking?.courierPartner ||
    tracking?.trackingLink;

  const canCancel =
    orderData?.status === "Confirmed" &&
    !hasTracking;

  const handleCancel = async () => {
    if (!orderId) return;
    try {
      setCancelling(true);
      const res = await orderAPI.cancelOrder(orderId);
      if (res.success) {
        enqueueSnackbar("Order cancelled. Refund (if prepaid) will be processed within 5–7 working days.", {
          variant: "success",
        });
        setOrderData((prev) => ({
          ...prev,
          status: "Cancelled",
          refundStatus: res.data?.refundStatus || prev?.refundStatus,
        }));
        setTracking(null); // remove tracking UI
      } else {
        throw new Error(res.message || "Failed to cancel order");
      }
    } catch (err) {
      enqueueSnackbar(err.message || "Failed to cancel order", { variant: "error" });
    } finally {
      setCancelling(false);
    }
  };

  /** --------------------------
   * AUTH / INVALID / LOADER
   * -------------------------- */

  if (!orderId)
    return (
      <section className="track-section py-5">
        <Container>
          <h5 className="text-center mt-4">Order not specified!</h5>
        </Container>
      </section>
    );

  if (!isAuthenticated)
    return (
      <section className="track-section py-5">
        <Container>
          <h5 className="text-center mt-4">Please login to track orders.</h5>
        </Container>
      </section>
    );

  if (showLoader)
    return (
      <section className="track-section py-5">
        <Container>
          <Loader fullScreen={true} size="large" />
        </Container>
      </section>
    );

  if (!orderData)
    return (
      <section className="track-section py-5">
        <Container>
          <h5 className="text-center mt-4">No order found!</h5>
        </Container>
      </section>
    );

  /** --------------------------
   * ORDER PRODUCT, ADDRESS, TOTAL
   * -------------------------- */
  const { cart, address } = orderData;

  // Calculate totals from GST-inclusive prices
  const totalInclusive = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  
  // Calculate base price: Total / 1.18
  const basePrice = Number((totalInclusive / 1.18).toFixed(2));
  
  // Calculate GST: Total - Base Price
  const gst = Number((totalInclusive - basePrice).toFixed(2));

  /** --------------------------
   * MAIN UI START
   * -------------------------- */

  return (
    <section className="track-section py-4">
      <Container>
        <h5 className="section-title">Order Tracking</h5>

        <Card className="shadow-sm tracking-card">
          <Card.Body className="p-0">
            {/* ORDER ID */}
            <p className="fw-semibold small text-muted mb-3">
              Order ID: <span className="text-dark">{orderId}</span>
            </p>

            {/* TRACKING INFO OR REFUND MESSAGE */}
            {orderData?.status === "Cancelled" ? (
              <div className="p-3 bg-light rounded mb-3 d-flex flex-column justify-content-center">
                <p className="mb-2 fw-semibold text-danger">Order Cancelled</p>
                <p className="mb-1">
                  Refund will be credited to your original payment method within 5–7 working days.
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                  Refund status: {orderData?.refundStatus || "Pending"}
                </p>
              </div>
            ) : hasTracking ? (
              <Row className="mb-4">
                <Col md={3}>
                  <p className="small mb-1 text-muted">Reference Number</p>
                  <p className="fw-semibold">
                    {tracking?.referenceNumber || "Updating Soon"}
                  </p>
                </Col>

                <Col md={3}>
                  <p className="small mb-1 text-muted">Estimated Delivery</p>
                  <p className="fw-semibold">
                    {tracking?.estimateDate
                      ? new Date(tracking.estimateDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Updating Soon"}
                  </p>
                </Col>

                <Col md={3}>
                  <p className="small mb-1 text-muted">Courier Partner</p>
                  <p className="fw-semibold">
                    {tracking?.courierPartner || "Updating Soon"}
                  </p>
                </Col>

                <Col md={3}>
                  <p className="small mb-1 text-muted">Status</p>
                  <p className="fw-semibold">{status}</p>
                </Col>
              </Row>
            ) : (
              <div className="p-3 bg-light rounded mb-3 d-flex flex-column justify-content-center align-items-center">
                <p className="mb-1 fw-semibold">
                Your order will be shipped within 2 days. Tracking will
                appear once the courier updates it.
                </p>

                {/* ALWAYS SHOW STATUS */}
                <p className="mt-2 mb-0">
                  <strong>Status:</strong> Order Confirmed
                </p>
              </div>
            )}

            {tracking?.trackingLink && orderData?.status !== "Cancelled" && (
              <Button
                variant="outline-primary"
                size="sm"
                href={tracking.trackingLink}
                className="mb-3"
                target="_blank"
              >
                <Link2 size={16} className="me-2" />
                View Courier Tracking
              </Button>
            )}

            {/* PROGRESS BAR */}
            {orderData?.status !== "Cancelled" && (
              <div className="progress-tracker d-flex justify-content-between mb-4">
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
            )}

            {/* Cancel button */}
            {canCancel && (
              <div className="mb-3">
                <Button variant="outline-danger" size="sm" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </Button>
              </div>
            )}

            {/* PRODUCT LIST + ADDRESS */}
            <div className="d-flex flex-column flex-lg-row gap-4">
              {/* PRODUCT DETAILS */}
              <div className="product-box w-100">
                <h6 className="fw-semibold mb-3">Products in your order</h6>

                {cart.map((p, i) => (
                  <div key={i} className="d-flex align-items-center mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-image me-3"
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/70")
                      }
                    />
                    <div className="flex-grow-1">
                      <p className="fw-semibold mb-1 text-truncate">{p.name}</p>
                      <p className="text-muted small mb-0">
                        Price: ₹{p.price} • Qty: {p.quantity}
                      </p>
                    </div>
                    <div className="ms-auto fw-semibold">
                      ₹{(p.price * p.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="order-summary mt-3">
                  <hr />
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
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total (Inclusive of GST)</span>
                    <span>₹{totalInclusive.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ADDRESS BOX */}
              <div className="address-box">
                <h6 className="fw-semibold mb-3">Shipping Address</h6>
                <p className="mb-1">
                  <strong>{address?.name}</strong>
                </p>
                <p className="small text-muted mb-1">
                  {address?.address}, {address?.area}
                </p>
                <p className="small text-muted mb-1">
                  {address?.city}, {address?.state} - {address?.postal}
                </p>
                <p className="small text-muted mb-1">
                  <strong>Mobile:</strong> {address?.mobile}
                </p>
                <p className="small text-muted">
                  <strong>Email:</strong> {address?.email}
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
