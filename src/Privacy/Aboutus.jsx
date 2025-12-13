import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { TbShieldCheck } from "react-icons/tb";
import { LuBookOpenCheck } from "react-icons/lu";
import "./AboutUs.css";

const AboutUs = () => {
    return (
        <div className="about-page">
            {/* HERO SECTION */}
            <section className="about-hero">
                <Container>
                    <Row className="align-items-center">
                        <Col md={7}>
                            <h1 className="about-title">
                                Redefining Adult Wellness <span>in India</span>
                            </h1>
                            <p className="about-subtitle">
                                Choisex is India’s modern and trusted online destination for
                                <strong> adult pleasure, wellness, and intimate care products.</strong>{" "}
                                We exist to make intimacy safe, respectful, private, and
                                stigma-free - just as it should be.
                            </p>

                            <Row className="about-highlight-row">
                                <Col xs={6} md={4}>
                                    <div className="about-pill">100% Private</div>
                                </Col>
                                <Col xs={6} md={4}>
                                    <div className="about-pill">Pan-India Delivery</div>
                                </Col>
                                <Col xs={12} md={4} className="mt-2 mt-md-0">
                                    <div className="about-pill">Judgment-Free</div>
                                </Col>
                            </Row>
                        </Col>

                        <Col md={5} className="d-none d-md-block">
                            <div className="about-hero-card">
                                <h3>“Pleasure is not a taboo.”</h3>
                                <p>
                                    We empower adults to explore their personal wellness
                                    confidently, with access to safe, high-quality products and
                                    complete privacy.
                                </p>
                                <ul className="hero-list">
                                    <li>Discreet, unbranded packaging</li>
                                    <li>Trusted, body-safe products</li>
                                    <li>Respectful, confidential support</li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* VISION */}
            <section className="about-sections">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>

                            <Card.Body>
                                <h2 className="sections-title">Our Vision</h2>
                                <p className="sections-text">
                                    To enable a modern India where adults have the freedom to
                                    choose intimacy and pleasure <strong>without shame, fear, or misinformation.</strong>
                                </p>
                                <p className="sections-text mb-0">
                                    We aim to become India’s most trusted brand for{" "}
                                    <strong>adult wellness products</strong>, delivering{" "}
                                    <strong>knowledge, quality, and dignity</strong> with every
                                    order.
                                </p>
                            </Card.Body>

                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CORE VALUES */}
            <section className="about-sections">
                <Container>
                    <Row className="mb-4">
                        <Col>
                            <h2 className="sections-title text-center">Our Core Values</h2>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6} lg={3} className="mb-4">
                            <Card className="about-value-card">
                                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="icon-circle"><MdOutlinePrivacyTip size={28} className="text-white" /></div>
                                    <h5>Privacy First</h5>
                                    <p className="sections-text">
                                        Every step, from browsing to delivery, is designed to
                                        protect your identity and keep your choices private.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6} lg={3} className="mb-4">
                            <Card className="about-value-card">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="icon-circle"><CiHeart size={30} className="text-white" /></div>
                                    <h5>Respect & Inclusivity</h5>
                                    <p className="sections-text">
                                        Pleasure is personal. We welcome individuals, couples, and
                                        LGBTQ+ communities without judgment.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6} lg={3} className="mb-4">
                            <Card className="about-value-card">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="icon-circle"><TbShieldCheck size={28} className="text-white" /></div>
                                    <h5>Safety & Quality</h5>
                                    <p className="sections-text">
                                        We curate body-safe, tested, and globally approved products
                                        from trusted brands only.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6} lg={3} className="mb-4">
                            <Card className="about-value-card">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                    <div className="icon-circle"><LuBookOpenCheck size={28} className="text-white" /></div>
                                    <h5>Education & Awareness</h5>
                                    <p className="sections-text">
                                        We believe knowledge creates confidence and provide
                                        accurate, stigma-free guidance.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* WHY CHOISEX */}
            <section className="about-sections">
                <Container>
                    <Row className="mb-4 align-items-center">
                        <Col md={7}>
                            <h2 className="sections-title">Why Choose Choisex?</h2>
                            <p className="sections-text">
                                From your first click to your final delivery, everything is built
                                around your comfort, safety, and privacy.
                            </p>
                        </Col>
                        <Col md={5} className="text-md-end text-muted">
                            <small>Trusted Adult Wellness Store · India</small>
                        </Col>
                    </Row>

                    <Row className="equal-card-row">
                        {/* Card 1 */}
                        <Col md={6} className="mb-4 d-flex">
                            <Card className="about-feature-card">
                                <Card.Body>
                                    <h5>100% Private Shopping & Packaging</h5>
                                    <p className="mb-2">We follow strict privacy guidelines:</p>
                                    <ul className="about-list">
                                        <li>Plain, unbranded packaging</li>
                                        <li>No product names or category labels outside</li>
                                        <li>No revealing invoices attached on the box</li>
                                        <li>Secure, encrypted access to your order details</li>
                                    </ul>

                                    <p className="mb-0">
                                        Even delivery personnel cannot identify the contents.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>


                        {/* Card 2 */}
                        <Col md={6} className="mb-4 d-flex">
                            <Card className="about-feature-card">
                                <Card.Body>
                                    <h5>Premium, Body-Safe Products</h5>
                                    <p className="mb-2">
                                        Every product we offer meets strict quality and safety guidelines:
                                    </p>
                                    <ul className="about-list">
                                        <li>Medical-grade & skin-safe materials</li>
                                        <li>Brand authenticity & certification checks</li>
                                        <li>Durability, comfort & hygiene testing</li>
                                        <li>Free from toxic or harmful chemicals</li>
                                    </ul>
                                    <p className="mb-0">
                                        We never sell unsafe, fake, or unverified products - only verified products.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Card 3 */}
                        <Col md={6} className="mb-4 d-flex">
                            <Card className="about-feature-card">
                                <Card.Body>
                                    <h5>Nationwide Fast & Discreet Delivery</h5>
                                    <p className="mb-2">Our delivery system is designed to be:</p>
                                    <ul className="about-list">
                                        <li>Fast, reliable & fully trackable</li>
                                        <li>Sealed packaging with no product visibility</li>
                                        <li>Handled by verified private logistics partners</li>
                                        <li>Optimized for protection against damage & leakage</li>
                                    </ul>

                                    <p className="mb-0">
                                        Whether you’re gifting or shopping for yourself, your order arrives
                                        safely, privately, and on time.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>


                        {/* Card 4 */}
                        <Col md={6} className="mb-4 d-flex">
                            <Card className="about-feature-card">
                                <Card.Body>
                                    <h5>Personalized Customer Support</h5>
                                    <p className="mb-2">
                                        Our trained support team helps you confidently with:
                                    </p>
                                    <ul className="about-list">
                                        <li>Education & safe-usage guidance</li>
                                        <li>Product recommendations for your needs</li>
                                        <li>Hygiene & maintenance tips</li>
                                        <li>Private, hassle-free order assistance</li>
                                    </ul>
                                    <p className="mb-0">
                                        No awkward questions, no judgment - just
                                        professional, confidential, and respectful support.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>


            {/* OUR PROMISE */}
            <section className="about-sections">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <h2 className="sections-title">Our Promise to You</h2>
                            <p className="sections-text">
                                When you choose Choisex, you receive more than just a product -
                                you receive a safe, respectful experience.
                            </p>
                            <Row>
                                <Col sm={6} className="mb-3">
                                    <div className="promise-pill">Confidentiality at every step</div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="promise-pill">Trusted product quality</div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="promise-pill">Fast, private delivery</div>
                                </Col>
                                <Col sm={6} className="mb-3">
                                    <div className="promise-pill">Professional, discreet assistance</div>
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={5}>
                            <Card className="about-feature-card mt-4 mt-lg-0">
                                <Card.Body>
                                    <h5>Made for Every Kind of Journey</h5>
                                    <ul className="about-list">
                                        <li>Self-care and confidence</li>
                                        <li>Couple intimacy</li>
                                        <li>Curiosity and exploration</li>
                                        <li>Surprise gifts</li>
                                    </ul>
                                    <p className="mb-0">
                                        Whatever your reason, we ensure your experience is{" "}
                                        <strong>safe, joyful, and empowering.</strong>
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* PLEASURE */}
            <section className="about-sections">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h2 className="sections-title">Pleasure Is for Everyone</h2>
                            <p className="sections-text">
                                Pleasure is not a taboo -{" "}
                                <strong>it is a part of emotional, physical, and mental well-being.</strong>
                            </p>
                            <p className="sections-text">
                                We encourage a future where adults can take charge of their
                                bodies and choices without embarrassment.
                            </p>
                        </Col>
                        <Col md={6}>
                            <div className="tag-grid">
                                <div className="tag-card">Body Positivity</div>
                                <div className="tag-card">Consent Culture</div>
                                <div className="tag-card">Gender Inclusivity</div>
                                <div className="tag-card">Confident Intimacy</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CONTACT */}
            <section className="about-sections">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Card.Body className="text-center">
                                <h2 className="sections-title mb-3">Get in Touch Privately</h2>
                                <p className="sections-text">
                                    We respect your privacy in every communication. If you need
                                    guidance or have questions, our team is here for you -{" "}
                                    <strong>completely confidential.</strong>
                                </p>
                                <NavLink to="/contact-us">
                                    <Button className="contact-btn">Contact Us Comfortably</Button>
                                </NavLink>
                                <p className="contact-note mt-3 mb-0">
                                    No awkward calls. No judgment. Just respectful support.
                                </p>
                            </Card.Body>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default AboutUs;
