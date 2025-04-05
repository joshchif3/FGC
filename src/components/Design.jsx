import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";
import emailjs from "emailjs-com";

function Design() {
  const { user } = useAuth();
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [colors, setColors] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizes, setSizes] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDesignFile(file);
      setDesignPreview(URL.createObjectURL(file));
    }
  };

  const uploadDesign = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("❌ No authentication token found. Please log in.");
      }

      const response = await api.post("/api/designs/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload Successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error uploading design:", error);
      if (error.response) {
        console.error("❌ Server Response:", error.response.data);
      }
      throw error;
    }
  };

  const sendDesignEmail = async (designData) => {
    try {
      // Create a hidden form element
      const form = document.createElement("form");
      form.style.display = "none";
      
      // Add fields to the form
      const addField = (name, value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField("to_name", "Glorious Creations Team");
      addField("from_name", user?.username || "Customer");
      addField("from_email", user?.email || "customer@example.com");
      addField("message", `Upload Successful: ${JSON.stringify(designData, null, 2)}`);
      addField("reply_to", user?.email || "customer@example.com");

      document.body.appendChild(form);

      await emailjs.sendForm(
        "service_oi6vx5n",
        "template_vzyxdek",
        form,
        "UNjfGikVEcTG6vuKO"
      );

      document.body.removeChild(form);
      setIsMessageSent(true);
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      throw error;
    }
  };

  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: uploadDesign,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsMessageSent(false);

    try {
      if (!designFile) {
        throw new Error("❌ Please upload a design file.");
      }

      const formData = new FormData();
      formData.append("colors", colors);
      formData.append("quantity", parseInt(quantity, 10));
      formData.append("sizes", sizes);
      formData.append("designFile", designFile);
      formData.append("userId", user?.userId);

      // Upload the design and get response
      const response = await mutateAsync(formData);
      
      // Prepare data for email
      const emailData = {
        id: response.id,
        colors: colors,
        quantity: quantity,
        sizes: sizes,
        designFile: designPreview ? "Image data available" : "No image",
        userId: user?.userId || "N/A"
      };
      
      // Send email with design details
      await sendDesignEmail(emailData);
      
      alert("✅ Design uploaded and details emailed successfully!");
    } catch (error) {
      console.error("❌ Submission Failed:", error);
      alert(error.message || "❌ Failed to process design. Check console.");
    }
  };

  return (
    <div className="design-page">+
      <div className="design-header">
        <h2>Design Your Custom Product</h2>
        <p>Upload your design and provide details to place your order.</p>
      </div>

      <div className="design-area">
        <h3>Create or Upload Your Design</h3>
        <div className="design-options">
          <div className="design-tool">
            <p>Use our design tool to create something unique:</p>
            <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer" className="btn">
              Open Design Tool
            </a>
          </div>

          <div className="upload-design">
            <p>Or upload your own design:</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} required />
            {designPreview && (
              <div className="design-preview">
                <img src={designPreview} alt="Design Preview" />
              </div>
            )}
          </div>
        </div>
      </div>

      <form className="order-details" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="colors">Colors:</label>
          <input
            type="text"
            id="colors"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Enter colors (e.g., Red, Blue)"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sizes">Sizes:</label>
          <input
            type="text"
            id="sizes"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="Enter sizes (e.g., S, M, L)"
            required
          />
        </div>

        <div className="order-options">
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Save & Email Design"}
          </button>
        </div>
      </form>

      {isMessageSent && (
        <div className="success-message">
          <p>Your design details have been sent successfully!</p>
        </div>
      )}

      {isError && <div className="error-message">{error.message || "❌ Failed to upload design."}</div>}
    </div>
  );
}

export default Design;