import React, { useContext, useState } from "react";
import { CartContext } from "../services/CartContext";
import { useAuth } from "../services/AuthContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from "react-router-dom";

function CheckoutPage() {
  const { cartItems, productDetails, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Calculate the total amount in EUR
  const totalAmount = Object.entries(cartItems).reduce((total, [productId, quantity]) => {
    const productPrice = productDetails[productId]?.price || 0; // Use the actual product price
    return total + productPrice * quantity;
  }, 0);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    clearCart(user.id);
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {paymentSuccess ? (
        <div className="payment-success">
          <h3>Payment Successful!</h3>
          <p>Thank you for your purchase.</p>
          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            {Object.entries(cartItems).map(([productId, quantity]) => {
              const product = productDetails[productId]; // Get product details
              return (
                <div key={productId} className="cart-item">
                  <p>Product Name: {product?.name}</p> {/* Display product name */}
                  <p>Quantity: {quantity}</p>
                  <p>Price: €{product?.price.toFixed(2)}</p>
                </div>
              );
            })}
            <h4>Total Amount: €{totalAmount.toFixed(2)}</h4>
          </div>

          {/* PayPal Payment Integration */}
          <PayPalScriptProvider
            options={{
              "client-id": "AUJBjA58uIxb6bWBUyOtFn_E2pg4hSeoIbVWfSS8s40JGT3dRYtBpi3MPZYhfdxOThgxcpiq783eiqX5", // Replace with your PayPal Client ID
              currency: "EUR", // Set currency to EUR
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: totalAmount.toFixed(2), // Total amount in EUR
                        currency_code: "EUR", // Currency code
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                  console.log("Payment succeeded:", details);
                  handlePaymentSuccess();
                });
              }}
              onError={(err) => {
                console.error("Payment error:", err);
                alert("Payment failed. Please try again.");
              }}
            />
          </PayPalScriptProvider>
        </>
      )}
    </div>
  );
}

export default CheckoutPage;