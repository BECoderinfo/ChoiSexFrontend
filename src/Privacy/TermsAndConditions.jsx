import React from "react";
import { Container, Card } from "react-bootstrap";
import { FileText } from "lucide-react";
import "./Policy.css";
import { NavLink } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="policy-background">
      <Container className="policy-wrapper">
        <Card className="policy-card elegant-shadow">
          <Card.Body>
            <div className="policy-header">
              <div className="icon-box">
                <FileText size={35} />
              </div>
              <h2>Terms & Conditions</h2>
              <p className="update-text">Last Updated: January 2025</p>
            </div>

            <div className="divider"></div>

            <p>
              Welcome to Choisex. By visiting or purchasing from
              https://choisex.com, you agree to comply with the following terms
              and conditions.
            </p>

            <h4>Age Requirement</h4>
            <p>You must be 18 years or older to access or purchase from this website.</p>

            <h4>Nature of Products</h4>
            <p>
              We deal in intimate personal products. Due to hygiene reasons,
              used or opened products are not eligible for return.
            </p>

            <h4>Order Acceptance</h4>
            <p>
              Orders may be declined if address verification or payment
              authorization fails.
            </p>

            <h4>Discreet Packaging</h4>
            <p>
              All items are shipped in plain packaging without revealing any
              product information.
            </p>

            <h4>Customer Responsibility</h4>
            <p>
              Customers must ensure the legality of the product in their region before placing the order.
            </p>

            <div className="divider"></div>

            <p className="footer-texts">
              If you have any queries regarding these terms, please{" "}
              <NavLink to="/contact-us" className="link-style">contact our support team</NavLink>.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
