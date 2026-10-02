// Footer.jsx - Displays footer section with branding, links, contact info, and social icons

import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { FiMapPin } from 'react-icons/fi';
import logo from '../assets/elogo.png';
import '../index.scss';

export default function Footer() {
  return (
    <footer className="bg-primary text-light pt-5 pb-4">
      <div className="container">
        <div className="row gy-4 gx-5 footer-grid">

          {/* About Section */}
          <div className="col-md-5">
            <h5 className="text-white mb-3">About ShopSphere</h5>
            <p className="text-white">
              ShopSphere is your trusted online destination for quality, affordability, and convenience.
              From trending fashion to essential electronics and more, we curate products that elevate everyday living.
            </p>
            <img src={logo} alt="ShopSphere Logo" style={{ maxWidth: '230px' }} className="mt-2" />
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h6 className="text-white mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/shop/about" className="text-white text-decoration-none">About Us</Link>
              </li>
              <li>
                <Link to="/shop/listing" className="text-white text-decoration-none">Shop</Link>
              </li>
              <li>
                <Link to="/shop/contact" className="text-white text-decoration-none">Contact</Link>
              </li>
              <li>
                <Link to="/shop/privacy-policy" className="text-white text-decoration-none">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3">
            <h6 className="text-white mb-3">Contact</h6>
            <ul className="list-unstyled text-white">
              <li><FiMapPin className="me-2" /> Model Town, Ludhiana</li>
              <li><FaPhoneAlt className="me-2" /> +91 98765 43210</li>
              <li><HiOutlineMail className="me-2" /> support@shopsphere.com</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-2">
            <h6 className="text-white mb-3">Follow Us</h6>
            <div className="d-flex gap-3 fs-5">
              <a href="#" className="text-white" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="text-white" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className="my-4" />

        {/* Copyright */}
        <div className="text-center text-white">
          © {new Date().getFullYear()} ShopSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
