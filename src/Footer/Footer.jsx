import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './Footer.css'
import { FaBehance, FaFacebookF, FaLinkedinIn, FaSkype } from 'react-icons/fa'
import { BsInstagram, BsTwitter, BsWhatsapp } from 'react-icons/bs'
import { IoMdMail } from 'react-icons/io'
import { Link, NavLink } from 'react-router-dom'
import { getCategories } from '../api/category'

function Footer() {
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategories()
        setCategories(res?.data || [])
      } catch (err) {
        console.error('Error loading categories in footer:', err)
      } finally {
        setLoadingCategories(false)
      }
    })()
  }, [])

  return (
    <footer className="site-footer">
      <Container fluid className="footer-container">
        <Row className="footer-top">
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-list">
              {loadingCategories && <li>Loading categories...</li>}
              {!loadingCategories && categories.length === 0 && (
                <li>No categories available</li>
              )}
              {!loadingCategories &&
                categories.slice(0, 5).map((cat) => (
                  <li key={cat._id}>
                    <Link to={`/category/${cat._id}`}>{cat.name}</Link>
                  </li>
                ))}
              <li><Link to="/orderHistory">Track Order</Link></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">About Us</h6>
            <ul className="footer-list">
              <li><NavLink to={'/about-us'}>About Choisex</NavLink></li>
              <li><NavLink to={'/contact-us'}>Contact Us</NavLink></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">Policies</h6>
            <ul className="footer-list">
              <li><NavLink to={'/terms-and-conditions'}>Terms & Conditions</NavLink></li>
              <li><NavLink to={'/privacy-policy'}>Privacy Policy</NavLink></li>
              <li><NavLink to={'/cancellation-and-refund'}>Cancellation & Refund Policy</NavLink></li>
              <li><NavLink to={'/shipping-policy'}>Shipping Policy</NavLink></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-col">
            <h6 className="footer-title">Cities We Deliver To</h6>
            <p className="footer-text">
              Choisex delivers adult products safely and discreetly across India with
              secure packaging and hassle-free service. We cover major metro cities
              like Delhi, Mumbai, Bengaluru, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad,
              Surat, Chandigarh, Lucknow and many more. <br /><br />
              No matter where you live, Choisex ensures trusted delivery with complete
              privacy and fast shipping across the country.
            </p>
          </Col>

        </Row>

        <Row className="footer-social">
          <Col>
            <ul className="social-list">
              <li>
                <a aria-label="Email" href="mailto:support@choisex.com">
                  <IoMdMail size={18} />
                </a>
              </li>
              <li>
                <a aria-label="Whatsapp" href="https://wa.me/message/PPNG7ZXVY4PDK1" target="_blank" rel="noopener noreferrer">
                  <BsWhatsapp size={18} />
                </a>
              </li>
              {/* <li>
        <a aria-label="Skype" href="#">
          <FaSkype size={18} />
        </a>
      </li> */}
              {/* <li>
        <a aria-label="Behance" href="#">
          <FaBehance size={18} />
        </a>
      </li> */}
              {/* <li>
        <a aria-label="Twitter" href="#">
          <BsTwitter size={18} />
        </a>
      </li> */}
              <li>
                <a aria-label="Instagram" href="https://www.instagram.com/choisextoy/?igsh=MW1qOWJ4bDFzbTdydQ%3D%3D&utm_source=ig_contact_invite#" target="_blank" rel="noopener noreferrer">
                  <BsInstagram size={18} />
                </a>
              </li>
              {/* <li>
        <a aria-label="LinkedIn" href="#">
          <FaLinkedinIn  size={18} />
        </a>
      </li> */}
              <li>
                <a aria-label="Facebook" href="https://www.facebook.com/profile.php?id=61581140566323&mibextid=wwXIfr&rdid=QY0DJuDgNfGcbWvd&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ZzP2icxNF%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noopener noreferrer">
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