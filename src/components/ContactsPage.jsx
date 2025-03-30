import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";
import emailjs from "emailjs-com"; // Add EmailJS import

function Design() {
  const { user } = useAuth();
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [colors, setColors] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizes, setSizes] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false); // Track email status

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
      if (!token) throw new Error("❌ No authentication token found");

      const response = await api.post("/api/designs/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  };

  const sendDesignEmail = async (designData) => {
    try {
      await emailjs.send(
        "service_oi6vx5n", // Your Fastmail service ID
        "template_vzyxdek", // Your template ID
        {
          to_name: "Glorious Creations Team",
          from_name: user?.username || "Customer",
          from_email: user?.email || "customer@example.com",
          message: `
            New Design Submission:
            Colors: ${designData.colors}
            Quantity: ${designData.quantity}
            Sizes: ${designData.sizes}
            User ID: ${user?.userId || "N/A"}
          `,
          // For file attachments, you would need a different approach
        },
        "UNjfGikVEcTG6vuKO" // Your EmailJS user ID
      );
      setIsEmailSent(true);
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

    try {
      if (!designFile) throw new Error("❌ Please upload a design file");

      const formData = new FormData();
      formData.append("colors", colors);
      formData.append("quantity", quantity);
      formData.append("sizes", sizes);
      formData.append("designFile", designFile);
      formData.append("userId", user?.userId);

      // 1. Upload the design
      await mutateAsync(formData);
      
      // 2. Send email notification
      await sendDesignEmail({ colors, quantity, sizes });
      
      alert("✅ Design saved and email sent successfully!");
    } catch (error) {
      console.error("❌ Submission failed:", error);
      alert(error.message || "❌ Failed to process design");
    }
  };

  return (
    <div className="design-page">
      {/* ... (keep your existing JSX) ... */}

      <form className="order-details" onSubmit={handleSubmit}>
        {/* ... (keep your existing form fields) ... */}
        
        <div className="order-options">
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Processing..." : "Save & Send Design"}
          </button>
        </div>
      </form>

      {isEmailSent && (
        <div className="success-message">
          Email notification sent successfully!
        </div>
      )}

      {isError && (
        <div className="error-message">
          {error.message || "❌ Failed to process design"}
        </div>
      )}
    </div>
  );
}

export default Design;