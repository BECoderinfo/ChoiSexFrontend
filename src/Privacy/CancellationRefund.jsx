import React from "react";
import { Container, Card } from "react-bootstrap";
import { ShieldCheck } from "lucide-react";
import "./Policy.css";
import { NavLink } from "react-router-dom";

const CancellationRefund = () => {
  return (
    <div className="policy-background">
      <Container className="policy-wrapper">
        <Card className="policy-card elegant-shadow">
          <Card.Body>
            {/* Header */}
            <div className="policy-header">
              <div className="icon-box">
                <ShieldCheck size={35} />
              </div>
              <h2>Cancellation Policy</h2>
              <p className="update-text">Last Updated: January 2025</p>
            </div>

            <div className="divider"></div>

            {/* Cancellation Policy */}
            <h4>Order Cancellation</h4>
            <p>
              Orders can be cancelled <b>only before the product is shipped</b>.
            </p>
            <p>
              If the order is cancelled before shipment, the paid amount will be
              refunded to the original payment method.
            </p>
            <p>
              Once the order status is marked as <b>“Shipped”</b>, cancellation
              requests will not be accepted.
            </p>

            <div className="divider"></div>

            {/* Return Policy */}
            <h4>Return & Exchange Policy</h4>
            <p>
              We follow a <b>strict no-return and no-exchange policy</b> due to
              hygiene, safety, and product sensitivity reasons.
            </p>
            <p>
              Once the product is shipped or delivered, it cannot be returned,
              exchanged, or refunded under any circumstances.
            </p>

            <div className="divider"></div>

            {/* Refund Info */}
            <h4>Refund Information</h4>
            <p>
              Refunds are applicable <b>only if the order is cancelled before
              shipment</b>.
            </p>
            <p>
              No refunds will be issued after the product has been shipped.
            </p>

            <p className="note-text">
              Refunds (if applicable) are processed within{" "}
              <b>5–7 working days</b>.
            </p>

            <div className="divider"></div>

            {/* Footer */}
            <p className="footer-texts">
              For any questions related to order cancellation, please contact our{" "}
              <NavLink to="/contact-us" className="link-style">
                support team
              </NavLink>.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CancellationRefund;
