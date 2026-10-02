import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Message Received:', formData);

    // ✅ Show toast instead of alert
    toast.success('Thank you! Your message has been sent.', {
      duration: 4000,
      style: {
        background: '#0d6efd',
        color: 'white',
      },
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <>
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Hero Section */}
      <div className="page-banner contact-hero bg-light justify-content-center align-items-center d-flex" style={{height:"50vh"}}>
        <div className="container">
        <h1 className="display-5 fw-bold text-primary ">Let’s Connect</h1>
        <p className="text-dark mt-3" style={{ maxWidth: '600px', fontSize: '17px' }}>
          Whether you have a question, feedback, or just want to say hello — we’re here to listen and help. Drop us a message and we’ll get back to you shortly!
        </p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container py-5">
        <div className="row text-center g-4">
          {[
            { icon: <MapPin size={32} className="text-primary mb-2" />, title: 'Address', text: <>124 Near SBI<br />Model Town, Ludhiana</> },
            { icon: <Mail size={32} className="text-primary mb-2" />, title: 'Email', text: 'support@shopsphere.com' },
            { icon: <Phone size={32} className="text-primary mb-2" />, title: 'Phone', text: '+91 98765 43210' },
            { icon: <Clock size={32} className="text-primary mb-2" />, title: 'Hours', text: 'Mon–Sat: 9 AM – 6 PM' },
          ].map((item, idx) => (
            <div className="col-md-3 col-6" key={idx}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {item.icon}
                  <h6 className="fw-bold">{item.title}</h6>
                  <p className="text-muted small mb-0">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map & Form Row */}
      <div className="container mb-5">
        <div className="row g-4 align-items-stretch">
          {/* Google Map */}
          <div className="col-md-6">
            <div className="h-100 shadow-sm rounded overflow-hidden">
              <iframe
                title="ShopVerse Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83918576828!2d77.06889941973415!3d28.527280343136614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2b8edbaafa3%3A0xdee3b5e0c5fbd473!2sDelhi!5e0!3m2!1sen!2sin!4v1696760300000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '100%' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-md-6">
            <div className="shadow-sm rounded p-4 bg-white h-100 d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-4 text-primary">Send Us a Message</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="name">Your Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="subject"
                    className="form-control"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="subject">Subject</label>
                </div>
                <div className="form-floating mb-4">
                  <textarea
                    id="message"
                    className="form-control"
                    placeholder="Write your message here"
                    style={{ height: '150px' }}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label htmlFor="message">Message</label>
                </div>
                <button type="submit" className="btn btn-primary px-4 py-2 w-100">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
