import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./ProductSection.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";

function ProductSection({ title, products, viewall, all }) {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  // calculate discount %
  const calculateDiscount = (markprice, price) => {
    const discount = ((markprice - price) / markprice) * 100;
    return Math.round(discount);
  };

  // ✅ Determine how many products to show
  const productsToShow =
    all === "allproduct" ? products : products.slice(0, 4);

  return (
    <section className="new-launches-section pt-2 pb-3">
      <Container>
        <h3
          className="text-center mb-4 mt-3 fw-bold"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          {title}
        </h3>

        <Row>
          {productsToShow.map((item) => {
            const [added, setAdded] = useState(false);

            // ✅ Sync with cart on load or change
            useEffect(() => {
              const exists = cart.some((cartItem) => cartItem.id === item.id);
              setAdded(exists);
            }, [cart, item.id]);

            const handleCartAction = (e) => {
              e.stopPropagation(); // prevent navigation
              if (!added) {
                addToCart(item, 1);
                setAdded(true);
              } else {
                navigate("/cart");
              }
            };

            return (
              <Col key={item.id} xs={12} sm={6} md={3} className="mb-4">
                <Card
                  className="launch-card"
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="img-wrapper">
                    <Card.Img variant="top" src={item.image} alt={item.name} />
                  </div>

                  <Card.Body className="text-start pt-1">
                    <Card.Title className="product-name">{item.name}</Card.Title>

                    <div className="price-section">
                      <span className="markprice">Rs. {item.markprice}</span>{" "}
                      <span className="price">Rs. {item.price}</span>
                    </div>

                    <p className="discount mb-2">
                      {calculateDiscount(item.markprice, item.price)}% Off
                    </p>

                    <Button
                      className={`add-btn ${added ? "goto-cart" : ""}`}
                      onClick={(e) => handleCartAction(e)}
                    >
                      {added ? "Go to Cart" : "Add to Cart"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* ✅ Hide View All button if viewall="hide" or all="allproduct" */}
        {!viewall && all !== "allproduct" && (
          <div className="text-center mt-3">
            <Button
              className="view-all-btn"
              onClick={() =>
                navigate("/view-all", {
                  state: { title, products },
                })
              }
            >
              View All
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ProductSection;
