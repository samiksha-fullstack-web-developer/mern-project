import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container my-5">
        <h2 className="mb-3 border-bottom pb-2">Privacy Policy</h2>
        <p className="text-muted">Effective Date: July 20, 2025</p>

        <section className="mb-4">
          <h5>🔍 Overview</h5>
          <p>
            Shopsphere values your trust. This Privacy Policy describes how we collect, use, and protect your information when you visit or make a purchase from our site.
          </p>
        </section>

        <section className="mb-4">
          <h5>📦 What We Collect</h5>
          <ul>
            <li>Your name, address, email & phone number</li>
            <li>Payment details (processed securely)</li>
            <li>Device & browser information</li>
            <li>Order and browsing history</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5>🎯 Why We Collect It</h5>
          <p>We use your information to:</p>
          <ul>
            <li>Deliver your orders</li>
            <li>Improve our services</li>
            <li>Offer personalized experiences</li>
            <li>Send relevant updates and promotions</li>
          </ul>
        </section>

        <section className="mb-4">
          <h5>🔐 Data Protection</h5>
          <p>
            We use secure servers and encryption methods to protect your personal data. Your payment info is never stored on our servers.
          </p>
        </section>

        <section className="mb-4">
          <h5>🍪 Cookies</h5>
          <p>
            We use cookies to improve site performance and user experience. You can manage cookies through your browser settings anytime.
          </p>
        </section>

        <section className="mb-4">
          <h5>🤝 Third Parties</h5>
          <p>
            We only share data with trusted services like payment gateways and shipping providers — strictly for order fulfillment.
          </p>
        </section>

        <section className="mb-4">
          <h5>📩 Your Rights</h5>
          <p>
            You can update, download, or request the deletion of your personal data by contacting us at <strong><a href="">support@shopsphere.com</a></strong>.
          </p>
        </section>

        <section className="mb-4">
          <h5>🔄 Policy Updates</h5>
          <p>
            We may update this policy periodically. All changes will be posted here with the updated date.
          </p>
        </section>

        <section className="mb-2">
          <h5>📬 Contact</h5>
          <p>
            For any privacy-related concerns, feel free to reach out at <strong><a href="">support@shopsphere.com</a></strong>.
          </p>
        </section>
    </div>
  );
};

export default PrivacyPolicy;
