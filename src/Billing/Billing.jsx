import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import "./Billing.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";
import Loader, { useLoadingWithDelay } from "../Loader";

function Billing() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const showLoader = useLoadingWithDelay(initialLoading, 1000);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const [razorpayReady, setRazorpayReady] = useState(false);




  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setInitialLoading(false);
        return;
      }
      try {
        setInitialLoading(true);
        const response = await orderAPI.getOrder(orderId);
        if (response.success) {
          setCheckoutData(response.data);
        }
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to load order", {
          variant: "error",
        });
      } finally {
        setInitialLoading(false);
      }
    };

    if (!isAuthenticated) {
      enqueueSnackbar("Please login to confirm order", { variant: "warning" });
      navigate("/login");
      return;
    }

    loadOrder();
  }, [isAuthenticated, orderId, enqueueSnackbar, navigate]);

  // Load Razorpay script
  useEffect(() => {
    const existing = document.getElementById("razorpay-sdk");
    if (existing) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setRazorpayReady(true);
    script.onerror = () => setRazorpayReady(false);
    document.body.appendChild(script);
  }, []);

  if (!orderId) {
    return <h5 className="text-center mt-4">Order not specified!</h5>;
  }

  if (showLoader) {
    return <Loader fullScreen={true} size="large" />;
  }

  if (!checkoutData) {
    return <h5 className="text-center mt-4">Order not found!</h5>;
  }

  const { cart, address, totalAmount } = checkoutData;

  // Calculate totals from GST-inclusive prices
  const totalInclusive = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  
  // Calculate base price: Total / 1.18
  const basePrice = Number((totalInclusive / 1.18).toFixed(2));
  
  // Calculate GST: Total - Base Price
  const gst = Number((totalInclusive - basePrice).toFixed(2));

  const handleConfirm = async () => {
    if (!checkoutData) {
      enqueueSnackbar("No checkout data found!", { variant: "error" });
      return;
    }

    if (!isAuthenticated) {
      enqueueSnackbar("Please login to confirm order", { variant: "warning" });
      navigate("/login");
      return;
    }

    if (paymentMethod === "razorpay") {
      if (!razorpayReady) {
        enqueueSnackbar("Payment gateway not ready. Please try again.", { variant: "error" });
        return;
      }

      try {
        setLoading(true);
        // Create Razorpay order on backend
        const rpRes = await orderAPI.createRazorpayOrder(checkoutData.orderId);
        const rpData = rpRes?.data;

        if (!rpRes.success || !rpData?.razorpayOrderId) {
          throw new Error(rpRes?.message || "Failed to create payment order");
        }

        const options = {
          key: rpData.key,
          amount: rpData.amount,
          currency: rpData.currency || "INR",
          name: "Choisex",
          description: `Order ${checkoutData.orderId}`,
          order_id: rpData.razorpayOrderId,
          prefill: {
            name: checkoutData.address?.name || "",
            email: checkoutData.address?.email || "",
            contact: checkoutData.address?.mobile || "",
          },
          notes: { orderId: checkoutData.orderId },
          handler: async function (response) {
            try {
              const verifyRes = await orderAPI.verifyRazorpayPayment(checkoutData.orderId, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                enqueueSnackbar("Payment successful!", { variant: "success" });
                navigate(`/ordsummery/${checkoutData.orderId}`);
              } else {
                enqueueSnackbar(verifyRes.message || "Payment verification failed", {
                  variant: "error",
                });
              }
            } catch (err) {
              enqueueSnackbar(err.message || "Payment verification failed", {
                variant: "error",
              });
            }
          },
          modal: {
            ondismiss: () => {
              enqueueSnackbar("Payment cancelled", { variant: "info" });
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to start payment", { variant: "error" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Cash / other methods: confirm immediately
    try {
      setLoading(true);
      const paymentMethodText = paymentMethod === "cod" ? "Cash on Delivery" : "";

      const response = await orderAPI.updateOrderStatus(checkoutData.orderId, {
        status: "Confirmed",
        paymentMethod: paymentMethodText,
        deliveryNote: deliveryNote,
      });

      if (response.success) {
        setCheckoutData(response.data);
        enqueueSnackbar(`Order confirmed successfully via ${paymentMethodText}!`, {
          variant: "success",
        });

        setTimeout(() => {
          navigate(`/ordsummery/${response.data.orderId}`);
        }, 1200);
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to confirm order", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <section className="billing-section py-4">
      <Container>
        <h4 className="mb-4 section-title">Confirm Order</h4>

        <Row>
          {/* Left Side - Billing Summary */}
          <Col md={8} className="mb-3">
            <Card className="shadow-sm billing-card">
              <div className="card-header-custom">
                <h5 className="fw-semibold mb-0">Product Details</h5>
              </div>
              <Card.Body>
                {/* ✅ Scrollable container for product list */}
                <div className="table-scroll-container">
                  <Table bordered responsive className="order-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="product-image"
                            />
                          </td>
                          <td>
                            <strong>{item.name}</strong>
                            <p className="small text-muted mb-0">{item.SKU}</p>
                          </td>
                          <td>₹{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4" className="text-end fw-semibold">
                          Sub Total (Base Price)
                        </td>
                        <td>₹{basePrice.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-end fw-semibold">
                          GST (18%)
                        </td>
                        <td>₹{gst.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-end fw-semibold">
                          Shipping
                        </td>
                        <td>Free</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-end fw-semibold">
                          Total Amount (Inclusive of GST)
                        </td>
                        <td>₹{totalInclusive.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                <div className="mt-4">
                  <h6 className="fw-semibold deliverto">Deliver to :</h6>
                  <p className="mb-0">
                    <strong>{address.name}</strong>
                  </p>
                  <p className="mb-0 small text-muted">
                    {address.address} - {address.area}, {address.city}, {address.state}{" "}
                    {address.postal}
                  </p>
                  <p className="small text-muted">{address.mobile} - {address.email}</p>
                </div>
              </Card.Body>

            </Card>
          </Col>

          {/* Right Side - Payment Options */}
          <Col md={4}>
            <Card className="shadow-sm billing-card">
              <div className="card-header-custom">
                <h5 className="fw-semibold mb-0">Billing</h5>
              </div>

              <Card.Body>
                <Form>
                  <Form.Check
                    type="radio"
                    label="Cash on delivery"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Razorpay (UPI / Card / Netbanking)"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mb-2"
                  />
                  
                  <Form.Group className="mt-3">
                    <Form.Label>Delivery instruction</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add any delivery notes..."
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    className="confirm-btn w-100 mt-3"
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? "Confirming..." : "Confirm Order"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Billing;
