import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import "./Billing.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import * as orderAPI from "../api/order";

function Billing() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();




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

  if (!orderId) {
    return <h5 className="text-center mt-4">Order not specified!</h5>;
  }

  if (initialLoading) {
    return <h5 className="text-center mt-4">Loading order...</h5>;
  }

  if (!checkoutData) {
    return <h5 className="text-center mt-4">Order not found!</h5>;
  }

  const { cart, address, totalAmount } = checkoutData;

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

    try {
      setLoading(true);

      // ✅ Update order status via API
      const paymentMethodText = paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer";
      
      const response = await orderAPI.updateOrderStatus(checkoutData.orderId, {
        status: "Confirmed",
        paymentMethod: paymentMethodText,
        deliveryNote: deliveryNote,
      });

      if (response.success) {
        setCheckoutData(response.data);

        // ✅ Show confirmation alert
        enqueueSnackbar(
          `Order confirmed successfully via ${paymentMethodText}!`,
          { variant: "success" }
        );

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
                          Sub Total
                        </td>
                        <td>₹{totalAmount}</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-end fw-semibold">
                          Shipping
                        </td>
                        <td>Free</td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-end fw-semibold">
                          Total Amount
                        </td>
                        <td>₹{totalAmount}</td>
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
                    label="Bank Transfer"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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
