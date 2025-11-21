import React from "react";
import { Container, Card } from "react-bootstrap";
import { Lock } from "lucide-react";
import "./Policy.css";
import { NavLink } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="policy-background">
      <Container className="policy-wrapper">
        <Card className="policy-card elegant-shadow">
          <Card.Body>
            <div className="policy-header">
              <div className="icon-box">
                <Lock size={35} />
              </div>
              <h2>Privacy Policy</h2>
              <p className="update-text">Last Updated: January 2025</p>
            </div>

            <div className="divider"></div>

            <p>
              Choisex values your privacy and ensures a safe and secure shopping
              environment for all users.
            </p>

            <h4>Personal Data Collection</h4>
            <p>
              We collect required data like name, contact number and address to
              fulfill orders securely and efficiently.
            </p>

            <h4>Payment Security</h4>
            <p>
              All transactions are securely processed through trusted payment
              gateways like Razorpay. We never store card or bank details.
            </p>

            <h4>Confidentiality & Discreet Privacy</h4>
            <p>
              All products are shipped in plain packaging. We do not disclose
              any product or customer information to unauthorized parties.
            </p>

            <h4>Use of Cookies</h4>
            <p>
              Cookies are used only to enhance browsing, personalize content and
              improve the website experience.
            </p>

            <div className="divider"></div>

            <p className="footer-texts">
              For any privacy related questions, please{" "}
              <NavLink to="/contact-us" className="link-style">contact us here</NavLink>.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
