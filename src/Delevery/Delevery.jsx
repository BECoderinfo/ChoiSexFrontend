import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useSnackbar } from "notistack";
import { Edit, Trash } from "lucide-react";
import "./Delevery.css";
import { useCart } from "../CartContext"; // ✅ import to clear cart context if needed
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as addressAPI from "../api/address";
import * as orderAPI from "../api/order";
import Loader from "../Loader";


function Delevery() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { clearCart, cart } = useCart(); // ✅ clear cart from context also
  const { isAuthenticated } = useAuth();

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

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const loadAddresses = useCallback(async () => {
    try {
      setLoadingAddresses(true);
      const response = await addressAPI.getAddresses();
      if (response.success) {
        setAddresses(response.data || []);
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to load addresses", {
        variant: "error",
      });
    } finally {
      setLoadingAddresses(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (!isAuthenticated) {
      enqueueSnackbar("Please login to manage delivery addresses", {
        variant: "warning",
      });
      navigate("/login");
      return;
    }
    loadAddresses();
  }, [isAuthenticated, loadAddresses]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses, selectedAddressId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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

    try {
      if (editingAddressId) {
        await addressAPI.updateAddress(editingAddressId, formData);
        enqueueSnackbar("Address updated successfully!", { variant: "success" });
      } else {
        await addressAPI.createAddress(formData);
        enqueueSnackbar("Address saved successfully!", { variant: "success" });
      }
      setEditingAddressId(null);
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
      await loadAddresses();
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to save address", {
        variant: "error",
      });
    }
  };

  const handleSelect = (address) => {
    setSelectedAddressId(address._id);
    enqueueSnackbar(`Selected: ${address.name}, ${address.city}`, {
      variant: "info",
    });
  };

  const handleDeliver = async () => {
    if (!selectedAddressId) {
      enqueueSnackbar("Please select an address!", { variant: "warning" });
      return;
    }

    if (!isAuthenticated) {
      enqueueSnackbar("Please login to place an order", { variant: "warning" });
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      enqueueSnackbar("Your cart is empty!", { variant: "error" });
      return;
    }

    try {
      // ✅ Create order via API
      const response = await orderAPI.createOrder({
        addressId: selectedAddressId,
        paymentMethod: "Cash on Delivery", // Default, can be updated in billing
        deliveryNote: "",
      });

      if (response.success) {
        // ✅ Clear cart after placing the order
        clearCart();

        enqueueSnackbar("Checkout ready — redirecting to payment...", {
          variant: "success",
        });

        // ✅ Navigate to payment page
        navigate(`/billing/${response.data.orderId}`);
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to create order", {
        variant: "error",
      });
    }
  };


  const handleEdit = (address) => {
    setFormData({
      name: address.name,
      mobile: address.mobile,
      email: address.email || "",
      address: address.address,
      area: address.area || "",
      city: address.city,
      state: address.state,
      postal: address.postal,
    });
    setEditingAddressId(address._id);
    enqueueSnackbar("You can now edit the address.", { variant: "info" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (address) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await addressAPI.deleteAddress(address._id);
        enqueueSnackbar("Address deleted successfully.", { variant: "info" });
        if (selectedAddressId === address._id) {
          setSelectedAddressId(null);
        }
        await loadAddresses();
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to delete address", {
          variant: "error",
        });
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
                  {editingAddressId ? "Edit Address" : "Add Address"}
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
                {loadingAddresses ? (
                  <Loader size="small" />
                ) : addresses.length === 0 ? (
                  <p className="text-muted">No saved addresses yet.</p>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`address-option p-3 mb-3 rounded ${selectedAddressId === addr._id ? "selected" : ""
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
                          onClick={() => handleEdit(addr)}
                        >
                          <Edit size={16} />
                        </Button>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="icon-btn delete-btn"
                          onClick={() => handleDelete(addr)}
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
