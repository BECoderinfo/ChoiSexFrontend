import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./ProductDetail.css";
import star from "../assets/star.png";
import ProductSection from "../NewLaunches/ProductSection";
import { useCart } from "../CartContext";
import { getProduct, getProducts } from "../api/product";
import Loader, { useLoadingWithDelay } from "../Loader";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoader = useLoadingWithDelay(loading, 1000);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        const productData = response?.data;
        setProduct(productData);
        if (productData?.images?.length > 0) {
          setMainImage(productData.images[0]);
        } else if (productData?.image) {
          setMainImage(productData.image);
        }
        
        // Fetch related products from same category
        if (productData?.category?._id || productData?.category) {
          const categoryId = productData.category._id || productData.category;
          const relatedRes = await getProducts(categoryId);
          const related = (relatedRes?.data || []).filter(p => p.id !== productData.id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ✅ Keep Add/Go button synced with cart
  useEffect(() => {
    if (product) {
      const exists = cart.some((cartItem) => cartItem.id === product.id);
      setAdded(exists);
    }
  }, [cart, product]);

  if (showLoader) {
    return <Loader fullScreen={true} size="large" />;
  }

  if (!product) {
    return <h4 className="text-center mt-5">Product not found!</h4>;
  }

  // ✅ Handle Add to Cart or Navigate
  const handleCartAction = () => {
    if (!added) {
      addToCart(product, quantity);
      setAdded(true);
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      <Container className="product-detail-container">
        <h5 className="section-title">Product Details</h5>
        <Row>
          <Col md={5}>
            <div className="image-section">
              <div className="main-image">
                <img src={mainImage} alt={product.name} />
              </div>
              <div className="image-thumbnails">
                {product.images?.slice(0, 4).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="thumbnail"
                    className={img === mainImage ? "active" : ""}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>
          </Col>

          <Col md={7}>
            <div className="product-info">
              <h3 className="product_name">{product.name}</h3>
              <p>
                <b className="name_title">SKU:</b> {product.SKU}{" "}
                <span className="availability">
                  Availability:{" "}
                  <span className="only-left">
                    Only {product.Availability} Left
                  </span>
                </span>
              </p>

              <h4 className="price">
                Rs.{product.price}{" "}
                <span className="mark-price">Rs.{product.markprice}</span>
              </h4>

              <h5 className="overview-title">Overview</h5>
              <p>
                <b className="name_title">Waterproof:</b> {product.Waterproof}
              </p>
              <p>
                <b className="name_title">Rechargeable:</b> {product.Rechargeable}
              </p>
              <p>
                <b className="name_title">Material:</b> {product.Material}
              </p>
              <p>
                <b className="name_title">Feature:</b> {product.Feature}
              </p>

              {/* ✅ Add to Cart / Go to Cart button */}
              <div className="add-to-cart-section">
                <Button
                  className={`add-btns ${added ? "goto-cart" : ""}`}
                  onClick={handleCartAction}
                >
                  {added ? "Go to Cart" : "Add to Cart"}
                </Button>

                <div className="quantity-wrapper">
                  { !added && <div className="quantity">
                    <Button
                      variant="light"
                      className="qty-btn"
                      onClick={() =>
                        setQuantity(quantity > 1 ? quantity - 1 : 1)
                      }
                    >
                      <p className="qtybtntext">−</p>
                    </Button>
                    <span>{quantity}</span>
                    <Button
                      variant="light"
                      className="qty-btn"
                      disabled={quantity >= product.Availability}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <p className="qtybtntext">+</p>
                    </Button>
                  </div>
                  }

                  {quantity >= product.Availability && (
                    <p className="stock-warning">Max stock reached</p>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* DESCRIPTION */}
        <Row className="description-section">
          <h5 className="description-text">Descriptions</h5>
          <div className="desc-box">
            <p className="desc-box-text">{product.description}</p>
          </div>
        </Row>

        {/* REVIEWS */}
        <Container className="reviews-section">
          <h5 className="description-text">Reviews From Customers</h5>
          <Row>
            {product.customerrating.map((review) => (
              <Col md={4} key={review.id} className="review-card">
                <Card className="p-4 review-inner">
                  <div className="star-rating">
                    {Array.from({ length: review.star }).map((_, i) => (
                      <img key={i} src={star} alt="star" className="star-icon" />
                    ))}
                  </div>
                  <p className="review-text mt-3">{review.review}</p>
                  <div className="d-flex align-items-center mt-4 reviewer-info">
                    <img
                      src={review.userimage}
                      alt={review.username}
                      className="rounded-circle reviewer-img"
                    />
                    <div className="ms-2">
                      <strong className="reviewer-name">
                        {review.username}
                      </strong>
                      <p className="reviewer-role">Customer</p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Container>

      {relatedProducts.length > 0 && (
        <ProductSection
          title="Related products"
          products={relatedProducts}
          viewall="hide"
        />
      )}
    </>
  );
}

export default ProductDetail;
 



 
