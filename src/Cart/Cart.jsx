import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import "./Cart.css";
import { useCart } from "../CartContext";
import ProductSection from "../NewLaunches/ProductSection";
import { useNavigate } from "react-router-dom";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import { getProducts } from "../api/product";

function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // ✅ Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(cart.length / itemsPerPage);

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cart.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchRelated = async () => {
      if (cart.length === 0) return;

      try {
        const firstItem = cart[0];
        const categoryId = firstItem.category?._id || firstItem.category;

        if (categoryId) {
          const { data } = await getProducts(categoryId);

          // Filter out items already in cart
          const filtered = data
            .filter((p) => !cart.some((c) => c.id === p.id))
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.log("Error fetching related:", error);
      }
    };

    fetchRelated();
  }, [cart]);

  if (cart.length === 0) {
    return (
      <Container className="empty-cart-container text-center py-5">
        <div className="empty-cart-box">
          <ShoppingCart size={80} color="#a60063" className="mb-3" />
          <h3 className="empty-cart-title">Your Cart is Empty</h3>
          <p className="empty-cart-text">
            Looks like you haven't added anything to your cart yet.
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
        <Col xs={12} lg={8}>
          <h5 className="section-title">Cart</h5>

          {currentItems.map((item) => (
            <Card className="cart-item mb-3" key={item.id}>
              <Row className="align-items-center">
                {/* Product Image */}
                <Col xs={12} sm={3} md={2} className="text-center text-sm-start mb-3 mb-sm-0 d-flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image img-fluid"
                  />
                </Col>

                {/* Product Details */}
                <Col xs={12} sm={5} md={7} className="mb-3 mb-sm-0">
                  <h6 className="cart-item-name">{item.name}</h6>
                  <p className="cart-item-model mb-2">Model: {item.SKU}</p>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <h4 className="prices mb-0">
                      Rs.{item.price}
                    </h4>
                    {item.markprice && (
                      <span className="mark-prices">
                        Rs.{item.markprice}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <small className="text-muted">
                      Availability: {item.Availability || 10} items
                    </small>
                  </div>
                </Col>

                {/* Actions */}
                <Col xs={12} sm={4} md={3}>
                  <div className="cart-item-actions">
                    <div className="d-flex align-items-center justify-content-center justify-content-sm-end mb-2 mb-sm-0">
                      <Button
                        variant="light"
                        size="sm"
                        className="qty-btn"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} color="white" />
                      </Button>

                      <span className="qty-number mx-3">{item.quantity}</span>

                      <Button
                        variant="light"
                        size="sm"
                        className="qty-btn"
                        onClick={() => increaseQuantity(item.id)}
                        disabled={item.quantity >= (item.Availability || 10)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} color="white" />
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        className="delete-btn ms-3"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}

          {/* ✅ Pagination UI */}
          {cart.length > itemsPerPage && (
            <div className="pagination-wrapper">
              <div className="pagination-container">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="nav-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <TbPlayerTrackPrevFilled className="me-1" /> Previous
                </Button>

                <div className="page-btn-all">
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index + 1}
                      size="sm"
                      className={`page-btn ${
                        currentPage === index + 1 ? "active" : ""
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
                  Next <TbPlayerTrackNextFilled className="ms-1" />
                </Button>
              </div>

              <p className="pagination-info mt-2">
                Showing <b>{(currentPage - 1) * itemsPerPage + 1}</b>–
                <b>{Math.min(currentPage * itemsPerPage, cart.length)}</b> of{" "}
                <b>{cart.length}</b> items
              </p>
            </div>
          )}

          <div className="text-center text-md-end mb-4 mt-4">
            <Button
              variant="outline-secondary"
              onClick={clearCart}
              className="clear-cart-btn"
            >
              Clear All Items
            </Button>
          </div>
        </Col>

        {/* ✅ CHECKOUT SUMMARY */}
        <Col xs={12} lg={4}>
          <div className="checkout-summary-wrapper">
            <Card className="checkout-summary">
              <Card.Body>
                <h5 className="checkout-title mb-4">Checkout Summary</h5>

                <div className="summary-item">
                  <span>Items ({cart.length})</span>
                  <span className="fw-semibold">{cart.length}x</span>
                </div>

                <div className="summary-item">
                  <span>Subtotal</span>
                  <span className="fw-semibold">₹{total}</span>
                </div>

                <div className="summary-item">
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="coupon-discount">Coupon Discount</span>
                    <Form.Control
                      type="text"
                      placeholder="Enter coupon code"
                      className="coupon-input"
                      size="sm"
                    />
                  </div>
                </div>

                <div className="summary-item">
                  <span>Shipping</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>

                <div className="summary-item total">
                  <span>Total Amount</span>
                  <span className="fw-bold fs-5">₹{total}</span>
                </div>

                <Button
                  className="checkout-btn w-100 mt-4"
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
                  Proceed to Checkout
                </Button>

                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    className="text-decoration-none text-muted"
                    onClick={() => navigate("/")}
                  >
                    ← Continue Shopping
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="mt-5 pt-4">
          <ProductSection
            title="Related Products"
            products={relatedProducts}
            viewall="hide"
          />
        </div>
      )}
    </Container>
  );
}

export default Cart;