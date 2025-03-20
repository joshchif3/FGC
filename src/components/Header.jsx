import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../services/CartContext.jsx";
import { useAuth } from "../services/AuthContext.jsx";

function Header() {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
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
            <li><Link to="/design">Design</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/products">Products</Link></li>
            {user ? (
              <>
                <li><button onClick={handleLogout}>Logout</button></li>
                {user.role === "ADMIN" && <li><Link to="/admin">Admin</Link></li>}
              </>
            ) : (
              <li>
                <li>
  <Link to="/login">
     Login <span className="material-icons">person</span>
  </Link>
</li>
              </li>
            )}
            
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;