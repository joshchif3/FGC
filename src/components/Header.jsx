import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../services/CartContext.jsx";
import { useAuth } from "../services/AuthContext.jsx"; // Correct import

function Header() {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth(); // Use the useAuth hook

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Glorious Creations
        </Link>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/design">Design</Link></li> {/* Added Design Link */}
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/products">Products</Link></li>
            {user ? (
              <>
                <li><button onClick={handleLogout}>Logout</button></li>
                {user.role === "ADMIN" && <li><Link to="/admin">Admin</Link></li>}
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            )}
            <li className="cart-icon">
              <Link to="/cart">
                🛒
                {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;