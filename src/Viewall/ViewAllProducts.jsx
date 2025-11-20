import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../CartContext";
import ProductSection from "../NewLaunches/ProductSection";


function ViewAllProducts() {
  const location = useLocation();

  // get data passed from ProductSection
  const { title, products } = location.state || { title: "All Products", products: [] };

  return (
    <ProductSection title={title} products={products} viewall="hide" all="allproduct"/>
  );
}

export default ViewAllProducts;
