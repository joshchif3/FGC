// src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import "../styling/main.css"; // Use main.css for styling

function ProductForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || null;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "HOODIES",
    price: product?.price || 0,
    stockCount: product?.stockCount || 0,
    maxQuantity: product?.maxQuantity || 10,
    discounted: product?.discounted || false,
    status: product?.status || "AVAILABLE",
    imageUrl: product?.imageUrl || "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      navigate("/admin"); // Redirect to admin dashboard after saving
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>{product ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="HOODIES">Hoodies</option>
            <option value="TSHIRTS">T-Shirts</option>
            <option value="CAPS">Caps</option>
            <option value="BAGS">Bags</option>
            <option value="SWEATERS">Sweaters</option>
            <option value="JACKETS">Jackets</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Stock Count</label>
          <input type="number" name="stockCount" value={formData.stockCount} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Max Quantity</label>
          <input type="number" name="maxQuantity" value={formData.maxQuantity} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Discounted</label>
          <input type="checkbox" name="discounted" checked={formData.discounted} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} required>
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="DISCONTINUED">Discontinued</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn">{product ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
}

export default ProductForm;
