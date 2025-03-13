// src/components/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { fetchProducts, deleteProduct } from "../services/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../styling/main.css"; // Use main.css for styling

function AdminPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id}`, { state: { product } }); // Navigate to edit page
  };

  const handleAddNew = () => {
    navigate("/add-product"); // Navigate to add new product page
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <button className="btn add-product-btn" onClick={handleAddNew}>
        + Add New Product
      </button>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Max Quantity</th>
              <th>Discounted</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stockCount}</td>
                  <td>{product.maxQuantity}</td>
                  <td>{product.discounted ? "Yes" : "No"}</td>
                  <td>{product.status}</td>
                  <td>
                    <img src={product.imageUrl} alt={product.name} className="product-img" />
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="no-products">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
