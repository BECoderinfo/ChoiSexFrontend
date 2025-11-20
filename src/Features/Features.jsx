import { features } from "../database/data";
import { Container, Row, Col, Card } from "react-bootstrap";
import './Features.css';

function Features() {
    return (
      <section className="feature-section">
        <Container>
          <Row className="justify-content-center">
            {features.map((item, index) => (
              <Col key={index} xs={12} sm={6} md={3} className="mb-4">
                <Card className="feature-card text-center">
                  <div className="feature-icon-wrap">
                    <img src={item.img} alt={item.title} className="feature-icon" />
                  </div>
                  <Card.Body>
                    <Card.Title className="feature-title">{item.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    );
  }
  
  export default Features;