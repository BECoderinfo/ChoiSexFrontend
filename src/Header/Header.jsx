import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { ShoppingCart, Search } from "lucide-react";
import "./Header.css";
import logo from "../assets/mainlogo.png";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      enqueueSnackbar("Logged out successfully", { variant: "success" });
      setOpen(false);
      navigate("/");
    } else {
      enqueueSnackbar(result.message || "Failed to logout", {
        variant: "error",
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="custom-header">
      <Container
        fluid
        className="d-flex align-items-center justify-content-between py-2 header-inner"
      >
        {/* Logo */}
        <div className="logo d-flex align-items-center">
          <img
            src={logo}
            alt="logo"
            className="logo-img"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Search Bar */}
        <div className="search-section d-flex align-items-center">
          <div className="search-wrapper position-relative flex-grow-1">
            <span className="search-icon">
              <Search size={16} />
            </span>
            <Form.Control
              type="text"
              placeholder="Search Products"
              className="search-input"
              aria-label="Search"
            />
          </div>
          <Button className="search-btn">Search</Button>
        </div>

        {/* Right Buttons */}
        <div className="header-buttons d-flex align-items-center">
          <Button className="cart-btn" onClick={() => navigate("/cart")}>
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="cart-count-badge">{cartCount}</span>
            )}
          </Button>

          {isAuthenticated ? (
            <div className="header-user-dropdown" ref={dropdownRef}>
              <div
                className="header-user-toggle"
                onClick={() => setOpen(!open)}
              >
                <span className="user-name">
                  {user?.name ? user.name : "My Account"}
                </span>
              </div>

              {open && (
                <div className="user-dropdown-menu">
                  <div
                    className="dropdown-item logout"
                    onClick={() => {
                      setOpen(false);
                      navigate("/orderHistory");
                    }}
                  >
                    Order History
                  </div>
                
                  <div
                    className="dropdown-item logout"
                    onClick={() => {
                      setOpen(false);
                      navigate("/settings");
                    }}
                  >
                    Settings
                  </div>
                  <div
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button className="login-btn" onClick={() => navigate("/login")}>
              Log In/Sign Up
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
