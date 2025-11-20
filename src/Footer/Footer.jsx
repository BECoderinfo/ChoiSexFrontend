import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Footer.css'
import { FaBehance, FaFacebookF, FaLinkedinIn, FaSkype } from 'react-icons/fa'
import { BsInstagram, BsTwitter } from 'react-icons/bs'
import { IoMdMail } from 'react-icons/io'

function Footer() {
  return (
    <footer className="site-footer">
      <Container fluid className="footer-container">
        <Row className="footer-top">
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-list">
              <li><a href="#">Sex Toy For Men</a></li>
              <li><a href="#">Sex Toy For Women</a></li>
              <li><a href="#">BDSM Toys</a></li>
              <li><a href="#">Anal Toys</a></li>
              <li><a href="#">Track Order</a></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">About Company</h6>
            <ul className="footer-list">
              <li><a href="#">About Naught Night</a></li>
              <li><a href="#">Business Inquiries</a></li>
              <li><a href="#">Affiliate Program</a></li>
              <li><a href="#">Our Blog</a></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">Policies</h6>
            <ul className="footer-list">
              <li><a href="#">Return & Exchange</a></li>
              <li><a href="#">Shipping & Customs</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Terms & Condition</a></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">Cities We Deliver To</h6>
            <p className="footer-text">
              ChoiceX deliver adult products in all over India. We provide fast delivery in India’s major
              cities: Delhi, Mumbai, Chandigarh, Banglore, Pune, Goa, Hyderabad, Chennai, Kolkata, Surat, Lucknow,
              etc. Customers in Chandigarh, Mohali, and Panchkula can expect delivery within 2 days of dispatch.
              For locations in Punjab, Gurgaon, Delhi, and Noida, delivery typically takes 3 to 5 days after dispatch.
            </p>
          </Col>
        </Row>

        <Row className="footer-social">
  <Col>
    <ul className="social-list">
      <li>
        <a aria-label="Email" href="#">
          <IoMdMail size={18} />
        </a>
      </li>
      <li>
        <a aria-label="Skype" href="#">
          <FaSkype size={18} />
        </a>
      </li>
      <li>
        <a aria-label="Behance" href="#">
          <FaBehance size={18} />
        </a>
      </li>
      <li>
        <a aria-label="Twitter" href="#">
          <BsTwitter size={18} />
        </a>
      </li>
      <li>
        <a aria-label="Instagram" href="#">
          <BsInstagram size={18} />
        </a>
      </li>
      <li>
        <a aria-label="LinkedIn" href="#">
          <FaLinkedinIn  size={18} />
        </a>
      </li>
      <li>
        <a aria-label="Facebook" href="#">
          <FaFacebookF size={18} />
        </a>
      </li>
    </ul>
  </Col>
</Row>
      </Container>
    </footer>
  )
}

export default Footer