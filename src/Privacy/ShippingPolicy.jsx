import React from "react";
import { Container, Card } from "react-bootstrap";
import { Truck } from "lucide-react";
import "./Policy.css";
import { NavLink } from "react-router-dom";

const ShippingPolicy = () => {
  return (
    <div className="policy-background">
      <Container className="policy-wrapper">
        <Card className="policy-card elegant-shadow">
          <Card.Body>
            <div className="policy-header">
              <div className="icon-box">
                <Truck size={35} />
              </div>
              <h2>Shipping Policy</h2>
              <p className="update-text">Last Updated: January 2025</p>
            </div>

            <div className="divider"></div>

            <h4>Dispatch Time</h4>
            <p>
              All orders are dispatched within 1–2 business days after payment
              confirmation.
            </p>

            <h4>Delivery Time</h4>
            <p>
              Estimated delivery takes around 5–8 working days depending on your
              location.
            </p>

            <h4>Discreet Packaging</h4>
            <p>
              We ensure complete privacy. Items are packed in plain and secure
              packaging with no product information displayed.
            </p>

            <h4>Shipping Delays</h4>
            <p>
              Unexpected delays due to weather, courier service or remote areas
              can occur. We will notify you if so.
            </p>

            <div className="divider"></div>

            <p className="footer-texts">
              For any delivery related questions, please{" "}
              <NavLink to="/contact-us" className="link-style">
                contact our support team
              </NavLink>
              .
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ShippingPolicy;