import React from "react";
import { Container, Card } from "react-bootstrap";
import { PhoneCall } from "lucide-react";
import "./Policy.css";

const ContactUs = () => {
  return (
    <div className="policy-background">
      <Container className="policy-wrapper">
        <Card className="policy-card elegant-shadow">
          <Card.Body>
            <div className="policy-header">
              <div className="icon-box">
                <PhoneCall size={35} />
              </div>
              <h2>Contact Us</h2>
              <p className="update-text">We're here to support you</p>
            </div>

            <div className="divider"></div>

            <h4>Customer Support</h4>
            <p>
              For any order or product-related queries, feel free to contact us.
              We will be happy to help you.
            </p>

            <h4>Email Support</h4>
            <p className="highlight-text">support@choisex.com</p>

            <h4>Official Website</h4>
            <p>
              <a
                href="https://choisex.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-style"
                aria-label="Visit Choisex website (opens in new tab)"
              >
                https://choisex.com
              </a>
            </p>

            <h4>Working Hours</h4>
            <p>Monday – Saturday | 10:00 AM to 7:00 PM</p>

            <div className="divider"></div>

            <p className="footer-texts">
              Our team will reply to your query within 24 working hours.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ContactUs;