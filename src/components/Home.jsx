import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faPencilAlt,
  faCheckCircle,
  faShoppingCart,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h2>Welcome to Glorious Creations</h2>
          <p>
            Create your own custom clothing and accessories with Glorious Creations! 
            Whether it's caps, t-shirts, hoodies, or even decorative tags, we bring your unique designs to life. 
            No minimum order quantity – just high-quality products made for you. Start designing today and let us handle the rest!
          </p>
          <div className="btn-container">
            <Link to="/design" className="btn">Start Designing</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/nobg.png" alt="Decorative Image" />
        </div>
      </div>

      {/* Product Showcase Section */}
      <div className="product-showcase">
        <h3>Some Custom Products We’ve Made</h3>
        <div className="showcase-grid">
          <div className="showcase-item">
            <img src="/images/hoodies.jpg" alt="Custom Hoodies" />
            <p>Hoodies</p>
          </div>
          <div className="showcase-item">
            <img src="/images/T-shirts.jpg" alt="Printed T-Shirts" />
            <p>Printed T-Shirts</p>
          </div>
          <div className="showcase-item">
            <img src="/images/Bags.jpg" alt="Bags" />
            <p>Bags</p>
          </div>
          <div className="showcase-item">
            <img src="/images/decorativeTags.jpg" alt="Decorative Tags" />
            <p>Decorative Tags</p>
          </div>
        </div>
        <div className="showcase-btn-container">
          <Link to="/products" className="btn">View Product Portfolios</Link>
        </div>
      </div>

      {/* How We Work Section */}
      <div className="how-we-work">
        <div className="how-we-work-header">
          <h3>How We Work</h3>
        </div>
        <div className="process-container">
          <div className="process-image">
            <img src="/images/working.jpeg" alt="Someone Making Clothes" />
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-icon">
                <FontAwesomeIcon icon={faUserPlus} />
              </div>
              <div className="process-step-content">
                <h4>Sign Up</h4>
                <p>Create an account to get started. It's quick and easy!</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <FontAwesomeIcon icon={faPencilAlt} />
              </div>
              <div className="process-step-content">
                <h4>Design Your Product</h4>
                <p>
                  Use our easy-to-use design tools or upload your own design. 
                  <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer"> Try Canva</a> for simple designs.
                </p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="process-step-content">
                <h4>Get Approval</h4>
                <p>We review your design quickly and provide feedback or approval.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
              <div className="process-step-content">
                <h4>Place Your Order</h4>
                <p>Order your custom product or request a sample before bulk orders.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-icon">
                <FontAwesomeIcon icon={faTruck} />
              </div>
              <div className="process-step-content">
                <h4>Fast Delivery</h4>
                <p>We deliver your custom products on time, every time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;