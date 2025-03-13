import axios from "axios";

const API_URL = "http://localhost:8081"; // Updated to local server

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Use the correct key 'authToken'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data, // Return only the data from the response
  (error) => {
    if (error.response) {
      // Handle specific HTTP errors
      if (error.response.status === 401) {
        // Unauthorized: Token is invalid or expired
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ message: "No response received from the server" });
    } else {
      // Something happened in setting up the request
      return Promise.reject({ message: error.message });
    }
  }
);

// Fetch all products
export const fetchProducts = async () => {
  return api.get("/api/products");
};

// Fetch a single product by ID
export const fetchProductById = async (id) => {
  return api.get(`/api/products/${id}`);
};

// Create a new product
export const createProduct = async (product) => {
  return api.post("/api/products", product);
};

// Update an existing product
export const updateProduct = async (id, product) => {
  return api.put(`/api/products/${id}`, product);
};

// Delete a product
export const deleteProduct = async (id) => {
  return api.delete(`/api/products/${id}`);
};

// Verify the user's session
export const verifySession = async () => {
  try {
    const response = await api.get("/users/me");
    return response;
  } catch (error) {
    return null;
  }
};

// Fetch the user's cart
export const fetchCart = async (cartId) => {
  return api.get(`/api/cart/${cartId}`);
};

// Add an item to the cart
export const addToCart = async (cartId, productId, quantity) => {
  return api.post(`/api/cart/${cartId}/add`, null, {
    params: { productId, quantity },
  });
};

// Remove an item from the cart
export const removeFromCart = async (cartId, productId) => {
  return api.delete(`/api/cart/${cartId}/remove`, {
    params: { productId },
  });
};

// Update the quantity of an item in the cart
export const updateQuantity = async (cartId, productId, quantity) => {
  return api.put(`/api/cart/${cartId}/update`, null, {
    params: { productId, quantity },
  });
};

// Create a payment intent for Stripe
export const createPaymentIntent = async (data) => {
  return api.post("/api/checkout", data);
};

// Upload a design
export const uploadDesign = async (designData) => {
  return api.post("/api/designs/upload", designData);
};

export default api;