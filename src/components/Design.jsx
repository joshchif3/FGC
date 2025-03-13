import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";

function Design() {
  const { user } = useAuth();
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [colors, setColors] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizes, setSizes] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDesignFile(file);
      setDesignPreview(URL.createObjectURL(file));
    }
  };

  // Convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

    const uploadDesign = async (payload) => {
      try {
        // Fetch the correct token
        const token = localStorage.getItem("authToken");
    
        console.log("🔑 Token being sent:", token); // Now it should log the token
    
        if (!token) {
          throw new Error("❌ No authentication token found. Please log in.");
        }
    
        const response = await api.post("/api/designs/upload", payload, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token correctly
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

  // Use Mutation Hook
  const { mutateAsync, isLoading, isError, error } = useMutation({
    mutationFn: uploadDesign,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!designFile) {
        throw new Error("❌ Please upload a design file.");
      }

      const fileBase64 = await toBase64(designFile);

      const payload = {
        colors,
        quantity,
        sizes,
        designFile: fileBase64,
        userId: user?.userId,
      };

      console.log("📤 Sending payload:", payload);

      await mutateAsync(payload);
      alert("✅ Design uploaded successfully!");
    } catch (error) {
      console.error("❌ Upload Failed:", error);
      alert(error.message || "❌ Failed to upload design. Check console.");
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
          <input type="text" id="colors" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Enter colors (e.g., Red, Blue)" required />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" required />
        </div>
        <div className="form-group">
          <label htmlFor="sizes">Sizes:</label>
          <input type="text" id="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="Enter sizes (e.g., S, M, L)" required />
        </div>

        <div className="order-options">
          <button type="submit" className="btn" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Save Design"}
          </button>
        </div>
      </form>

      {isError && <div className="error-message">{error.message || "❌ Failed to upload design."}</div>}
    </div>
  );
}

export default Design;
