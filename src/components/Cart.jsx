import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../services/CartContext";
import { useAuth } from "../services/AuthContext";
import { fetchProductById } from "../services/api";
import { Link } from "react-router-dom";
import debounce from 'lodash/debounce';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, fetchUserCart } = useContext(CartContext);
  const { user } = useAuth();
  const [productDetails, setProductDetails] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [productCache, setProductCache] = useState({});

  useEffect(() => {
    if (user?.userId) {
      fetchUserCart(user.userId);
    }
  }, [user, fetchUserCart]);

  useEffect(() => {
    const loadProductDetails = async () => {
      const details = {};
      let total = 0;

      for (const productId of Object.keys(cartItems)) {
        if (!productCache[productId]) {
          const product = await fetchProductById(productId);
          if (product) {
            details[productId] = product;
            setProductCache((prev) => ({ ...prev, [productId]: product }));
          }
        } else {
          details[productId] = productCache[productId];
        }
        total += details[productId]?.price * cartItems[productId] || 0;
      }

      setProductDetails(details);
      setTotalAmount(total);
    };

    if (Object.keys(cartItems).length > 0) {
      loadProductDetails();
    }
  }, [cartItems, productCache]);

  const debouncedUpdateQuantity = debounce((userId, productId, quantity) => {
    updateQuantity(userId, productId, quantity);
  }, 300);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {Object.keys(cartItems).length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {Object.entries(cartItems).map(([productId, quantity]) => {
            const product = productDetails[productId];

            return product ? (
              <div key={productId} className="cart-item">
                <Link to={`/products/${productId}`} className="cart-item-link">
                  <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
                  <h3>{product.name}</h3>
                </Link>
                <p>Quantity:</p>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => debouncedUpdateQuantity(user.userId, productId, parseInt(e.target.value))}
                />
                <p>Price: ${product.price}</p>
                <p>Total: ${(product.price * quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(user.userId, productId)}>Remove</button>
              </div>
            ) : null;
          })}
        </div>
      )}
      <div className="cart-summary">
        <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
        {Object.keys(cartItems).length > 0 && (
          <Link to="/checkout">
            <button className="checkout-button">Proceed to Checkout</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Cart;