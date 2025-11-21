import React from "react";
import { Container, Card } from "react-bootstrap";
import { ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet";
import "./Policy.css";
import { NavLink } from "react-router-dom";

const CancellationRefund = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy - Choisex</title>
        <meta
          name="description"
          content="Choisex Cancellation & Refund Policy: Refunds accepted only for wrong or damaged products. Request within 7 days. Processing within 5-7 working days."
        />
        <link rel="canonical" href="https://choisex.com/cancellation-and-refund" />
      </Helmet>

      <div className="policy-background">
        <Container className="policy-wrapper">
          <Card className="policy-card elegant-shadow">
            <Card.Body>
              <div className="policy-header">
                <div className="icon-box">
                  <ShieldCheck size={35} />
                </div>
                <h2>Cancellation & Refund Policy</h2>
                <p className="update-text">Last Updated: January 2025</p>
              </div>

              <div className="divider"></div>

              <h4>Cancellation Requests</h4>
              <p>Orders cannot be cancelled once shipped.</p>

              <h4>Refund Eligibility</h4>
              <ul>
                <li>Wrong product delivered</li>
                <li>Damaged product received (unboxing video required)</li>
              </ul>

              <p>
                Refund requests must be raised within{" "}
                <b>7 days</b> of product delivery.
              </p>

              <p>
                Returns are accepted only if the item is unused and in its
                original sealed packaging due to hygiene standards.
              </p>

              <h4>Refund Processing Time</h4>
              <p>
                Refund will be processed within{" "}
                <b>5-7 working days</b> after approval.
              </p>

              <p className="note-text">
                Shipping charges are non-refundable under all circumstances.
              </p>

              <div className="divider"></div>

              <p className="footer-texts">
                For refund assistance, please contact our{" "}
                <NavLink to="/contact-us" className="link-style">support team</NavLink>.
              </p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default CancellationRefund;
