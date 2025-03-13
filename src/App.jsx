import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styling/main.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import AdminPage from "./components/AdminPage";
import ProductForm from "./components/ProductForm";
import ContactsPage from "./components/ContactsPage";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import CheckoutForm from "./components/CheckoutPage";
import Design from "./components/Design";
import { AuthProvider } from "./services/AuthContext";
import { CartProvider } from "./services/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="app-container">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/design" element={<Design />} />
                <Route path="/contact" element={<ContactsPage />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-product/:id"
                  element={
                    <ProtectedRoute role="ADMIN">
                      <ProductForm />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;