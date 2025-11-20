import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import "./Billing.css";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function Billing() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryNote, setDeliveryNote] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();




  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutData"));
    setCheckoutData(data);
  }, []);

  if (!checkoutData) return <h5 className="text-center mt-4">No checkout data found!</h5>;

  const { cart, address, totalAmount } = checkoutData;

  const handleConfirm = () => {
    if (!checkoutData) {
      alert("No checkout data found!");
      return;
    }
  
    // ✅ Create updated checkout data with payment method
    const updatedCheckout = {
      ...checkoutData,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer",
      deliveryNote: deliveryNote,
      status: "Confirmed",
      confirmedAt: new Date().toISOString(),
    };
  
    // ✅ Save updated data to localStorage (for current session)
    localStorage.setItem("checkoutData", JSON.stringify(updatedCheckout));
  
    // ✅ Get existing order history
    const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
  
    // ✅ Find index of the existing order (by orderId)
    const orderIndex = existingOrders.findIndex(
      (order) => order.orderId === updatedCheckout.orderId
    );
  
    if (orderIndex !== -1) {
      // ✅ If found → update the existing order
      existingOrders[orderIndex] = {
        ...existingOrders[orderIndex],
        ...updatedCheckout,
      };
    } else {
      // ✅ If not found → add new (fallback)
      existingOrders.push(updatedCheckout);
    }
  
    // ✅ Save back to localStorage
    localStorage.setItem("orderHistory", JSON.stringify(existingOrders));
  
    // ✅ Show confirmation alert
    enqueueSnackbar(
      `Order confirmed successfully via ${updatedCheckout.paymentMethod}!`,
      { variant: "success" }
    );
  
    // ✅ Optional: clear cart data if present
    localStorage.removeItem("cart");
  
    setTimeout(() => {
      navigate("/cnforderotp");
    }, 1200);
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
                  >
                    Confirm Order
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
