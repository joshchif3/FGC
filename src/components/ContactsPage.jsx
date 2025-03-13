import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../styling/ContactsPage.css";

function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isMessageSent, setIsMessageSent] = useState(false); // States to hansdle the success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send form data to EmailJS
    emailjs
      .sendForm(
        "service_r51ln6j", // Updated Service ID
        "template_t9eqsqe", // Replace with your template ID
        e.target, // This will automatically map the form fields to template variables
        "UNjfGikVEcTG6vuKO" // Replace with your user ID from EmailJS
      )
      .then(
        (result) => {
          console.log("Message sent: ", result.text);
          // Set the success message state
          setIsMessageSent(true);
          // Optionally, reset the form after a successful submission
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.log("Error sending message: ", error.text);
          // Optionally, handle error feedback
        }
      );
  };

  return (
    <div className="contacts-container">
      <h2>Contact Us</h2>

      {/* Contact Us Section */}
      <div className="contact-manager-card">
        <div className="contact-manager-image">
          <img
            src="/images/manager.jpg"
            alt="Sales & Design Manager"
            className="manager-img"
          />
        </div>
        <div className="contact-manager-info">
          <h3>Contact Us</h3>
          <div className="contact-manager-details">
            <p>Email: <a href="mailto:info@gloriouscreations.com">info@gloriouscreations.com</a></p>
            <p>Phone: <a href="tel:+27825251386">+27 (82) 525-1386</a></p>
          </div>
        </div>
      </div>

      {/* Paragraph Section Above the Form cc */}
      <div className="contact-paragraph">
        <p>If you have any queries or would like to order a custom design, feel free to reach out to us. Whether you want a t-shirt, hoodie, cap, or any other custom accessory, we are here to help bring your creative ideas to life. Our team is ready to assist you in creating the perfect design for your needs. Let’s work together to create something amazing!</p>
      </div>

      {/* Success Message */}
      {isMessageSent && (
        <div className="success-message">
          <p>Your message has been sent successfully! We'll get back to you soon.</p>
        </div>
      )}

      {/* Contact Form */}
      <div className="contact-form-container">
        <h3>Send Us A Message</h3>
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            required
          ></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default ContactsPage;
