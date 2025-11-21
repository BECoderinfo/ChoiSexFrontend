import React from "react";
import { Container, Card } from "react-bootstrap";
import { ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet";
import "./Policy.css";

const CancellationRefund = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy - Choisex</title>
        <meta
          name="description"
          content="Choisex Cancellation & Refund Policy: Product returns accepted only for wrong or damaged deliveries. Hygiene-based restrictions apply."
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

              <h4>Cancellation</h4>
              <p>Orders cannot be cancelled once shipped.</p>

              <h4>Refund Eligibility</h4>
              <ul>
                <li>Wrong product delivered</li>
                <li>Damaged product received (unboxing video required)</li>
              </ul>

              <p>
                Returns only accepted if unused and sealed in original packaging
                due to hygiene standards.
              </p>

              <p className="note-text">Shipping charges are non-refundable.</p>

              <div className="divider"></div>

              <p className="footer-texts">
                Contact our{" "}
                <a href="/contact-us" className="link-style">
                  support team
                </a>{" "}
                for refund help.
              </p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default CancellationRefund;
