import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import "./Cart.css";
import { useCart } from "../CartContext";
import ProductSection from "../NewLaunches/ProductSection";
import { useNavigate } from "react-router-dom";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";

function Cart() {
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  console.log(cart);
  

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cart.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // smooth scroll to top
  };

  if (cart.length === 0) {
    return (
      <Container className="empty-cart-container text-center py-5">
        <div className="empty-cart-box">
          <ShoppingCart size={80} color="#a60063" className="mb-3" />
          <h3 className="empty-cart-title">Your Cart is Empty</h3>
          <p className="empty-cart-text">
            Looks like you haven’t added anything to your cart yet.
          </p>
          <Button className="continue-btn mt-3" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container className="cart-container my-4">
      <Row>
        {/* LEFT SIDE - CART ITEMS */}
        <Col md={8}>
          <h5 className="section-title">Cart</h5>

          {currentItems.map((item) => (
            <Card className="cart-item mb-3" key={item.id}>
              <Row className="align-items-center g-2">
                <Col md={2} xs={3}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </Col>
                <Col md={7} xs={9}>
                  <h6 className="cart-item-name">{item.name}</h6>
                  <p className="cart-item-model">Model: {item.SKU}</p>
                  <h4 className="prices">
                    Rs.{item.price}{" "}
                    <span className="mark-prices">Rs.{item.markprice}</span>
                  </h4>
                </Col>
                <Col md={3} xs={12} className="text-end mt-md-0 mt-2">
                  <div className="cart-item-actions">
                    <Button
                      variant="light"
                      size="sm"
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} color="white" />
                    </Button>

                    <span className="qty-number">{item.quantity}</span>

                    <Button
                      variant="light"
                      size="sm"
                      className="qty-btn"
                      onClick={() => increaseQuantity(item.id)}
                      disabled={item.quantity >= item.Availability}
                    >
                      <Plus size={16} color="white" />
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      className="delete-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}


          {/* ✅ Pagination UI */}
          <div className="pagination-wrapper mt-4 mb-4">
            <div className="pagination-container">
              <Button
                variant="outline-secondary"
                size="sm"
                className="nav-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <TbPlayerTrackPrevFilled /> Previous
              </Button>

              <div className="page-btn-all">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    size="sm"
                    className={`page-btn ${currentPage === index + 1 ? "active" : ""
                      }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline-secondary"
                size="sm"
                className="nav-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <TbPlayerTrackNextFilled />
              </Button>
            </div>

            {/* Optional text showing page info */}
            <p className="pagination-info mt-2">
              Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b>–
              <b>{Math.min(currentPage * itemsPerPage, cart.length)}</b> of{" "}
              <b>{cart.length}</b> items
            </p>
          </div>


          <div className="text-end mb-5 mt-4">
            <Button variant="outline-secondary" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </Col>

        {/* ✅ FIXED CHECKOUT SUMMARY */}
        <Col md={4}>
          <div className="checkout-summary-wrapper">
            <Card className="checkout-summary">
              <Card.Body>
                <h5 className="checkout-title mb-3">Checkout Summary</h5>

                <div className="summary-item">
                  <span>Product</span>
                  <span>{cart.length}x</span>
                </div>

                <div className="summary-item">
                  <span>Sub-Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="summary-item">
                  <span className="coupon-discount">Coupon Discount</span>
                  <Form.Control
                    type="text"
                    placeholder="Apply Coupon"
                    className="coupon-input"
                  />
                </div>

                <div className="summary-item">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="summary-item total">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>

                <Button
                  className="checkout-btn w-100 mt-3"
                  onClick={() => {
                    if (!isAuthenticated) {
                      enqueueSnackbar("Please login to proceed to checkout", {
                        variant: "warning",
                      });
                      navigate("/login");
                      return;
                    }
                    navigate("/delivery");
                  }}
                >
                  Checkout
                </Button>

              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* <ProductSection
        title="Related products"
        products={cart}
        viewall="hide"
      /> */}
    </Container>
  );
}

export default Cart;
