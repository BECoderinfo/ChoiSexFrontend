import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSnackbar } from "notistack";
import { Edit, Trash } from "lucide-react";
import "./Delevery.css";
import { useCart } from "../CartContext"; // ✅ import to clear cart context if needed
import { useNavigate } from "react-router-dom";

function Delevery() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // ✅ clear cart from context also

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    area: "",
    city: "",
    state: "",
    postal: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("addresses")) || [];
    setSavedAddresses(stored);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.address ||
      !formData.city ||
      !formData.postal
    ) {
      enqueueSnackbar("Please fill all required fields.", { variant: "warning" });
      return;
    }

    let updatedAddresses;
    if (editIndex !== null) {
      updatedAddresses = [...savedAddresses];
      updatedAddresses[editIndex] = formData;
      enqueueSnackbar("Address updated successfully!", { variant: "success" });
      setEditIndex(null);
    } else {
      updatedAddresses = [...savedAddresses, formData];
      enqueueSnackbar("Address saved successfully!", { variant: "success" });
    }

    setSavedAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    setFormData({
      name: "",
      mobile: "",
      email: "",
      address: "",
      area: "",
      city: "",
      state: "",
      postal: "",
    });
  };

  const handleSelect = (address) => {
    setSelectedAddress(address);
    enqueueSnackbar(`Selected: ${address.name}, ${address.city}`, {
      variant: "info",
    });
  };

  const handleDeliver = () => {
    if (!selectedAddress) {
      enqueueSnackbar("Please select an address!", { variant: "warning" });
      return;
    }

    // Get cart data from localStorage (stored earlier in Cart page)
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartData.length === 0) {
      enqueueSnackbar("No cart data found!", { variant: "error" });
      return;
    }

    // ✅ Create new order object
    const newOrder = {
      orderId: "ORD_" + Date.now(),
      cart: cartData,
      address: selectedAddress,
      totalAmount: cartData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      date: new Date().toLocaleString(),
    };

    // ✅ Retrieve previous orders (if any)
    const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];

    // ✅ Add this new order to the list
    const updatedOrders = [...existingOrders, newOrder];

    // ✅ Store updated order list
    localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));

    // ✅ Also store the current order as checkoutData for payment page
    localStorage.setItem("checkoutData", JSON.stringify(newOrder));

    // ✅ Clear cart after placing the order
    localStorage.removeItem("cart");
    clearCart();

    enqueueSnackbar("Checkout ready — redirecting to payment...", {
      variant: "success",
    });

    // ✅ Navigate to payment page
    setTimeout(() => {
      navigate("/billing");
    }, 1200);
  };


  const handleEdit = (index) => {
    setFormData(savedAddresses[index]);
    setEditIndex(index);
    enqueueSnackbar("You can now edit the address.", { variant: "info" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updated = savedAddresses.filter((_, i) => i !== index);
      setSavedAddresses(updated);
      localStorage.setItem("addresses", JSON.stringify(updated));
      enqueueSnackbar("Address deleted successfully.", { variant: "error" });

      if (selectedAddress === savedAddresses[index]) {
        setSelectedAddress(null);
      }
    }
  };

  return (
    <section className="delivery-section py-4">
      <Container>
        <h4 className="mb-4 section-title">Delivery Address</h4>
        <Row>
          {/* LEFT SIDE - Address Form */}
          <Col xs={12} md={6} className="mb-4">
            <Card className="shadow-sm form-card">
              <div className="card-header-custom">
                <h5 className="fw-semibold mb-0 ">
                  {editIndex !== null ? "Edit Address" : "Add Address"}
                </h5>
              </div>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter your address"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                        />
                      </Form.Group>
                    </Col>
                  </Row>


                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Area Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                          placeholder="Enter area"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Enter city"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter state"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="postal"
                          value={formData.postal}
                          onChange={handleChange}
                          placeholder="Postal code"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button type="submit" className="submit-btn">
                      {editIndex !== null ? "Update Address" : "Submit"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* RIGHT SIDE - Saved Addresses */}
          <Col xs={12} md={6}>
            <Card className="shadow-sm address-card">
              <div className="card-header-custom">
                <h5 className="fw-semibold mb-0">Choose Address</h5>
              </div>

              <Card.Body className="p-4">
                {savedAddresses.length === 0 ? (
                  <p className="text-muted">No saved addresses yet.</p>
                ) : (
                  savedAddresses.map((addr, index) => (
                    <div
                      key={index}
                      className={`address-option p-3 mb-3 rounded ${selectedAddress === addr ? "selected" : ""
                        }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div onClick={() => handleSelect(addr)}>
                        <p className="mb-1 fw-semibold">{addr.name}</p>
                        <p className="mb-1 small text-muted">
                          {addr.address}, {addr.area}
                        </p>
                        <p className="mb-1 small text-muted">
                          {addr.city},{addr.state}, {addr.postal}
                        </p>
                        <p className="mb-2 small text-muted">{addr.mobile} - {addr.email}</p>
                      </div>

                      <div className="d-flex justify-content-end gap-2 address-action-btns">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="icon-btn edit-btn"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="icon-btn delete-btn"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <div className="text-center">
                  <Button className="deliver-btn" onClick={handleDeliver}>
                    Deliver to this address
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Delevery;
