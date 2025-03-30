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
  const [emailStatus, setEmailStatus] = useState(null); // Track email status separately

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDesignFile(file);
      setDesignPreview(URL.createObjectURL(file));
    }
  };

  // Upload design function using FormData (unchanged)
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

  // New function to send design details via email
  const sendDesignEmail = async (designData) => {
    try {
      const emailParams = {
        to_name: "Glorious Creations Team",
        from_name: user?.username || "Customer",
        from_email: user?.email || "customer@example.com",
        design_details: `
          New Design Submission:
          - Colors: ${designData.colors}
          - Quantity: ${designData.quantity}
          - Sizes: ${designData.sizes}
          - User ID: ${user?.userId || "N/A"}
        `,
        reply_to: user?.email || "customer@example.com"
      };

      await emailjs.send(
        "service_oi6vx5n", // Your Fastmail service ID
        "template_vzyxdek", // Your template ID
        emailParams,
        "UNjfGikVEcTG6vuKO" // Your EmailJS user ID
      );
      
      setEmailStatus({ success: true, message: "✅ Design details emailed successfully!" });
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      setEmailStatus({ success: false, message: "❌ Failed to send design email" });
      throw error;
    }
  };

  // Use Mutation Hook (unchanged)
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: uploadDesign,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailStatus(null); // Reset email status on new submission

    try {
      if (!designFile) {
        throw new Error("❌ Please upload a design file.");
      }

      // Prepare FormData payload (unchanged)
      const formData = new FormData();
      formData.append("colors", colors);
      formData.append("quantity", parseInt(quantity, 10));
      formData.append("sizes", sizes);
      formData.append("designFile", designFile);
      formData.append("userId", user?.userId);

      console.log("📤 Sending FormData:", formData);

      // Upload the design (unchanged)
      await mutateAsync(formData);
      
      // Send email with design details
      await sendDesignEmail({ colors, quantity, sizes });
      
      alert("✅ Design uploaded and details emailed successfully!");
    } catch (error) {
      console.error("❌ Submission Failed:", error);
      alert(error.message || "❌ Failed to process design. Check console.");
    }
  };

  return (
    <div className="design-page">
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

      {/* Display email status separately from upload status */}
      {emailStatus && (
        <div className={`status-message ${emailStatus.success ? "success" : "error"}`}>
          {emailStatus.message}
        </div>
      )}

      {isError && <div className="error-message">{error.message || "❌ Failed to upload design."}</div>}
    </div>
  );
}

export default Design;