import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaBolt,
  FaStar,
  FaRocket,
  FaChartLine,
  FaShieldAlt,
  FaLightbulb,
} from 'react-icons/fa';
import CountUp from 'react-countup';
import './about.css';

export default function About() {
  const coreValues = [
    {
      icon: <FaHeart className="text-danger fs-3" />,
      title: 'Customer First',
      desc: 'We prioritize your needs — every service is built with your feedback.',
    },
    {
      icon: <FaBolt className="text-warning fs-3" />,
      title: 'Innovation',
      desc: 'We challenge the norm to build faster, smarter, and future-ready experiences.',
    },
    {
      icon: <FaStar className="text-primary fs-3" />,
      title: 'Excellence',
      desc: 'Our goal is a 5-star experience — from selection to delivery.',
    },
  ];

  const journeyData = [
    {
      icon: <FaRocket className="text-primary fs-2" />,
      year: '2022 – Inception',
      desc: 'Founded to revolutionize online shopping in India.',
    },
    {
      icon: <FaChartLine className="text-success fs-2" />,
      year: '2023 – 1st Milestone',
      desc: '10,000+ users and expansion into electronics and home decor.',
    },
    {
      icon: <FaShieldAlt className="text-warning fs-2" />,
      year: '2024 – Trust Layer',
      desc: 'Secure payments, smart returns, and logistics partnerships.',
    },
    {
      icon: <FaLightbulb className="text-danger fs-2" />,
      year: '2025 – What’s Next?',
      desc: 'AI-powered shopping, same-day delivery, and beyond.',
    },
  ];

  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero-section page-banner d-flex align-items-center justify-content-center bg-light" style={{ height: '50vh' }}>
        <div className="container text-start fade-in-bottom">
          <h1 className="display-5 fw-bold text-primary">About</h1>
          <div style={{ maxWidth: "800px" }}>
            <p className=" mt-3" style={{ fontSize: '17px' }}>
              ShopSphere is your go-to destination for effortless and secure online shopping.
              We bring together quality products, great deals, and a seamless experience tailored for modern Indian shoppers.
              <br></br><strong>Shop with ease. Discover more.</strong>
            </p>
          </div>
          <a href="#story"><button className='btn btn-primary mt-3'>Read More</button></a>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-5 mt-0 ">
        <div className="container">
          <div className="row align-items-center flex-column-reverse flex-md-row">
            <div className="col-md-6 mt-4 mt-sm-0 fade-in-left">
              <h2 className="fw-bold mb-3 text-dark" id='story'>Our Story</h2>
              <p>
                At ShopSphere, we began with a simple goal: to make online shopping effortless, trustworthy, and enjoyable for every Indian customer. What started as a small idea is now a growing eCommerce platform bringing quality products and smooth experiences to shoppers across the country.
              </p>
              <h4 className='fw-bold mb-3 text-dark mt-4 mt-sm-0' >Our Mission</h4>
              <p>To deliver a seamless, secure, and personalized online shopping experience—empowering every customer to shop with confidence, convenience, and satisfaction.</p>
            <h4 className='fw-bold mb-3 text-dark mt-4' >Our Vision</h4>
              <p>To become India’s most customer-centric shopping destination by blending technology, trust, and innovation—shaping the future of digital retail for everyone.</p>
            </div>
            <div className=" d-none d-md-block col-md-6 text-center fade-in-right">
              <img
                src="/our_story.png"
                alt="ShopSphere Team"
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-light py-5 mt-0 ">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 fade-in-top">Our Core Values</h2>
          <div className="row g-4 justify-content-center">
            {coreValues.map((item, index) => (
              <div className="col-md-4 col-sm-6 fade-in-bottom" key={index}>
                <div className="card h-100 border-0 shadow rounded-4 p-4 text-center bg-white hover-scale">
                  <div className="mb-3 d-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: '60px', height: '60px', margin: '0 auto' }}>
                    {item.icon}
                  </div>
                  <h5 className="fw-semibold">{item.title}</h5>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-5 mt-0 ">
        <div className="container">
          <h2 className="text-center fw-bold mb-5 fade-in-top">Our Journey</h2>
          <div className="row g-4">
            {journeyData.map((item, idx) => (
              <div className="col-md-6 fade-in-bottom" key={idx}>
                <div className="d-flex align-items-start p-4 bg-white shadow-sm rounded-4 h-100 border-start border-4 border-primary hover-shadow transition">
                  <div className="me-3">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{item.year}</h5>
                    <p className="text-muted">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Stats Section */}
      <section className="py-5 mt-5" style={{ background: 'linear-gradient(to right, #f9f9f9, #eceef0)' }}>
        <div className="container text-center pb-5 pt-5">
          <h2 className="fw-bold mb-5 fade-in-top">What We’ve Achieved</h2>
          <div className="row g-4 justify-content-center" >
            {[
              { value: 50000, label: 'Happy Customers' },
              { value: 12, label: 'Product Categories' },
              { value: 100000, label: 'Orders Delivered' },
              { value: 99, label: 'Positive Feedback' },
            ].map(({ value, label }, idx) => (
              <div className="col-6 col-lg-3 fade-in-bottom" key={idx} >
                <div
                  className="p-4 rounded-4 shadow-sm h-100 bg-white border"
                  style={{
                    transition: 'transform 0.6s',
                  }}
                >
                  <h2 className="text-primary fw-bold display-4">
                    <CountUp end={value} duration={11.5} separator="," suffix={label.includes('%') ? '%' : '+'} style={{ fontSize: "30px" }} />
                  </h2>
                  <p className="text-dark fw-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
