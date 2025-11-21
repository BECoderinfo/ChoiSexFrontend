import React from "react";
import { Container, Card } from "react-bootstrap";
import { ShieldCheck } from "lucide-react";
import "./Policy.css";

const CancellationRefund = () => {
  return (
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
              <li>Product damaged at the time of delivery (with unboxing video proof)</li>
            </ul>

            <p>
              Returns are only accepted if the item is <b>unused</b> and in its original
              <b> sealed packaging</b> due to hygienic nature of items.
            </p>

            <p className="note-text">Note: Shipping charges are non-refundable.</p>

            <div className="divider"></div>

            <p className="footer-texts">
              For any refund queries, please contact us through our{" "}
              <a href="/contact-us" className="link-style">support page</a>.
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CancellationRefund;
