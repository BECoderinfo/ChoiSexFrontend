import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button, Offcanvas, Nav } from "react-bootstrap";
import { ShoppingCart, Search, Menu, X, Home, Settings, LogOut, Package } from "lucide-react";
import "./Header.css";
import logo from "../assets/mainlogo.png";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import CategoryBar from "../Categorybar/CategoryBar";
import { getProducts } from "../api/product";
import { getCategories } from "../api/category";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ categories: [], products: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState({ categories: [], products: [] });
  const [showMobileSearchDropdown, setShowMobileSearchDropdown] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const mobileSearchDropdownRef = useRef(null);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      enqueueSnackbar("Logged out successfully", { variant: "success" });
      setOpen(false);
      setShowDrawer(false);
      navigate("/");
    } else {
      enqueueSnackbar(result.message || "Failed to logout", { variant: "error" });
    }
  };

  // Fetch products & categories only once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);
        setAllProducts(productsRes?.data || []);
        setAllCategories(categoriesRes?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingCategories(false); // Loader hide after first fetch
      }
    };
    fetchData();
  }, []);

  // Debounce Web Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ categories: [], products: [], primaryCategory: null });
      setShowSearchDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();

      const categoryMatches = allCategories
        .map((category) => {
          const catName = category.name.toLowerCase();
          let priority = catName === query ? 3 : catName.startsWith(query) ? 2 : catName.includes(query) ? 1 : 0;
          return { category, priority };
        })
        .filter((item) => item.priority > 0)
        .sort((a, b) => b.priority - a.priority);

      const matchedCategories = categoryMatches.map((item) => item.category).slice(0, 5);
      const primaryCategory = categoryMatches.length > 0 ? categoryMatches[0].category : null;
      const primaryCategoryId = primaryCategory?._id;

      let matchedProducts = [];
      if (primaryCategoryId) {
        matchedProducts = allProducts.filter((product) => {
          const productCategoryId = product.category?._id || product.category;
          return productCategoryId === primaryCategoryId;
        });
      } else {
        matchedProducts = allProducts.filter((product) => product.name.toLowerCase().includes(query));
      }

      setSearchResults({
        categories: matchedCategories,
        products: matchedProducts.slice(0, 10),
        primaryCategory: primaryCategory,
      });

      setShowSearchDropdown(searchQuery.trim().length > 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allProducts, allCategories]);

  // Debounce Mobile Search
  useEffect(() => {
    if (!mobileSearchQuery.trim()) {
      setMobileSearchResults({ categories: [], products: [], primaryCategory: null });
      setShowMobileSearchDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      const query = mobileSearchQuery.toLowerCase().trim();

      const categoryMatches = allCategories
        .map((category) => {
          const catName = category.name.toLowerCase();
          let priority = catName === query ? 3 : catName.startsWith(query) ? 2 : catName.includes(query) ? 1 : 0;
          return { category, priority };
        })
        .filter((item) => item.priority > 0)
        .sort((a, b) => b.priority - a.priority);

      const matchedCategories = categoryMatches.map((item) => item.category).slice(0, 5);
      const primaryCategory = categoryMatches.length > 0 ? categoryMatches[0].category : null;
      const primaryCategoryId = primaryCategory?._id;

      let matchedProducts = [];
      if (primaryCategoryId) {
        matchedProducts = allProducts.filter((product) => {
          const productCategoryId = product.category?._id || product.category;
          return productCategoryId === primaryCategoryId;
        });
      } else {
        matchedProducts = allProducts.filter((product) => product.name.toLowerCase().includes(query));
      }

      setMobileSearchResults({
        categories: matchedCategories,
        products: matchedProducts.slice(0, 10),
        primaryCategory: primaryCategory,
      });

      setShowMobileSearchDropdown(mobileSearchQuery.trim().length > 0);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [mobileSearchQuery, allProducts, allCategories]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setOpen(false);
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) setShowSearchDropdown(false);
      if (mobileSearchDropdownRef.current && !mobileSearchDropdownRef.current.contains(event.target)) setShowMobileSearchDropdown(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile Drawer Handlers
  const handleDrawerClose = () => setShowDrawer(false);
  const handleDrawerShow = () => setShowDrawer(true);

  // Close drawer when resizing to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 992) {
        setShowDrawer(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // Disable body scroll on Drawer Open
useEffect(() => {
  if (showDrawer) {
    document.body.style.overflow = "hidden";   // stop scrolling
  } else {
    document.body.style.overflow = "";         // reset scrolling
  }

  return () => {
    document.body.style.overflow = "";         // cleanup on unmount
  };
}, [showDrawer]);


  return (
    <>
      {/* HEADER */}
      <header className="custom-header">
        <Container fluid className="d-flex align-items-center justify-content-between py-2 header-inner">

          {/* Logo */}
          <div className="logo d-flex align-items-center">
            <img src={logo} alt="logo" className="logo-img" onClick={() => navigate("/")} style={{ cursor: "pointer" }} />
          </div>

          {/* Search - Desktop */}
          <div className="search-section d-none d-lg-flex align-items-center" ref={searchDropdownRef}>
            <div className="search-wrapper position-relative flex-grow-1">
              <span className="search-icon"><Search size={16} /></span>
              <Form.Control
                type="text"
                placeholder="Search Products"
                className="search-input"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
                onFocus={() => {
                  if (searchQuery.trim() && (searchResults.categories.length > 0 || searchResults.products.length > 0)) {
                    setShowSearchDropdown(true);
                  }
                }}
              />

              {/* Search Dropdown */}
              {showSearchDropdown && searchQuery.trim() && (
                <div className="search-dropdown">
                  {searchResults.categories.length > 0 && (
                    <div className="search-dropdown-section">
                      {searchResults.categories.map((category) => (
                        <div
                          key={category._id}
                          className="search-category-item"
                          onClick={() => {
                            navigate(`/category/${category._id}`);
                            setSearchQuery("");
                            setShowSearchDropdown(false);
                          }}
                        >
                          {category.name.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.products.length > 0 && (
                    <div className="search-dropdown-section">
                      {searchResults.primaryCategory && (
                        <div className="search-section-title">{searchResults.primaryCategory.name}</div>
                      )}
                      <div className="search-products-list">
                        {searchResults.products.map((product) => (
                          <div
                            key={product.id}
                            className="search-product-item"
                            onClick={() => {
                              navigate(`/product/${product.id}`);
                              setSearchQuery("");
                              setShowSearchDropdown(false);
                            }}
                          >
                            <img src={product.image} alt={product.name} className="search-product-image"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }} />
                            <div className="search-product-details">
                              <div className="search-product-name">{product.name}</div>
                              <div className="search-product-price">
                                {product.markprice && <span className="search-markprice">Rs. {product.markprice}</span>}
                                <span className="search-price">Rs. {product.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.categories.length === 0 && searchResults.products.length === 0 && (
                    <div className="search-dropdown-section"><div className="search-no-results">No product(s) found.</div></div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Icons */}
          <div className="header-buttons d-flex align-items-center">

            {/* Cart - Desktop */}
            <Button className="cart-btn d-none d-lg-flex" onClick={() => navigate("/cart")}>
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </Button>

            {/* Desktop Account */}
            {isAuthenticated ? (
              <div className="header-user-dropdown d-none d-lg-block" ref={dropdownRef}>
                <div className="header-user-toggle" onClick={() => setOpen(!open)}>
                  <span className="user-name">{user?.name ? user.name : "My Account"}</span>
                </div>
                {open && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-item logout" onClick={() => { setOpen(false); navigate("/orderHistory"); }}>Order History</div>
                    <div className="dropdown-item logout" onClick={() => { setOpen(false); navigate("/settings"); }}>Settings</div>
                    <div className="dropdown-item logout" onClick={handleLogout}>Logout</div>
                  </div>
                )}
              </div>
            ) : (
              <Button className="login-btns d-none d-lg-block" onClick={() => navigate("/login")}>Log In/Sign Up</Button>
            )}

            {/* Mobile Menu Icon */}
            <div className="d-lg-none">
              <Button variant="link" className="hamburger-btn p-0" onClick={handleDrawerShow}>
                <Menu size={28} color="var(--color-primary)" />
              </Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Category Bar Desktop */}
      <div className="d-none d-lg-block">
        <CategoryBar categories={allCategories} loading={loadingCategories} />
      </div>

      {/* Drawer - Mobile */}
      <Offcanvas show={showDrawer} onHide={handleDrawerClose} placement="end" className="mobile-drawer">
        <Offcanvas.Header className="drawer-header">
          <div className="d-flex justify-content-end align-items-center w-100">
            <Button variant="link" className="close-btn p-0" onClick={handleDrawerClose}><X size={28} color="#ffffff" /></Button>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">

          {/* User Section */}
          <div className="user-profile-section p-4">
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="mb-0 user-name-text">{user?.name || "User"}</h6>
                  <small className="text-muted">{user?.email || ""}</small>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h6 className="mb-2">Welcome Guest</h6>
                <Button className="login-btn w-100" onClick={() => { navigate("/login"); handleDrawerClose(); }}>Log In / Sign Up</Button>
              </div>
            )}
          </div>

          {/* Mobile Search */}
          <div className="drawer-footer p-3 border-top" ref={mobileSearchDropdownRef}>
            <div className="search-wrapper position-relative">
              <span className="search-icon"><Search size={16} /></span>
              <Form.Control
                type="text" placeholder="Search Products..." className="search-input"
                value={mobileSearchQuery}
                onChange={(e) => { setMobileSearchQuery(e.target.value); setShowMobileSearchDropdown(true); }}
                onFocus={() => {
                  if (mobileSearchQuery.trim() && (mobileSearchResults.categories.length > 0 || mobileSearchResults.products.length > 0)) {
                    setShowMobileSearchDropdown(true);
                  }
                }}
              />

              {showMobileSearchDropdown && mobileSearchQuery.trim() && (
                <div className="search-dropdown mobile-search-dropdown">
                  {mobileSearchResults.categories.length > 0 && (
                    <div className="search-dropdown-section">
                      {mobileSearchResults.categories.map((category) => (
                        <div
                          key={category._id}
                          className="search-category-item"
                          onClick={() => {
                            navigate(`/category/${category._id}`);
                            setMobileSearchQuery("");
                            setShowMobileSearchDropdown(false);
                            handleDrawerClose();
                          }}
                        >
                          {category.name.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  )}

                  {mobileSearchResults.products.length > 0 && (
                    <div className="search-dropdown-section">
                      {mobileSearchResults.primaryCategory && (
                        <div className="search-section-title">{mobileSearchResults.primaryCategory.name}</div>
                      )}
                      <div className="search-products-list">
                        {mobileSearchResults.products.map((product) => (
                          <div
                            key={product.id}
                            className="search-product-item"
                            onClick={() => {
                              navigate(`/product/${product.id}`);
                              setMobileSearchQuery("");
                              setShowMobileSearchDropdown(false);
                              handleDrawerClose();
                            }}
                          >
                            <img src={product.image} alt={product.name} className="search-product-image"
                              onError={(e) => { e.target.src = "https://via.placeholder.com/60"; }} />
                            <div className="search-product-details">
                              <div className="search-product-name">{product.name}</div>
                              <div className="search-product-price">
                                {product.markprice && <span className="search-markprice">Rs. {product.markprice}</span>}
                                <span className="search-price">Rs. {product.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mobileSearchResults.categories.length === 0 && mobileSearchResults.products.length === 0 && (
                    <div className="search-dropdown-section"><div className="search-no-results">No product(s) found.</div></div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Navigation */}
          <div className="drawer-menu">
            <Nav className="flex-column">
              <Nav.Link onClick={() => { navigate("/"); handleDrawerClose(); }} className="drawer-nav-item">
                <Home size={20} className="me-3" /> Home
              </Nav.Link>

              <Nav.Link onClick={() => { navigate("/cart"); handleDrawerClose(); }} className="drawer-nav-item cart-drawer-item">
                <ShoppingCart size={20} className="me-3" /> Cart
                {cartCount > 0 && <span className="cart-drawer-badge">{cartCount}</span>}
              </Nav.Link>

              {isAuthenticated && (
                <>
                  <Nav.Link onClick={() => { navigate("/orderHistory"); handleDrawerClose(); }} className="drawer-nav-item">
                    <Package size={20} className="me-3" /> Order History
                  </Nav.Link>
                  <Nav.Link onClick={() => { navigate("/settings"); handleDrawerClose(); }} className="drawer-nav-item">
                    <Settings size={20} className="me-3" /> Settings
                  </Nav.Link>
                </>
              )}

              {isAuthenticated && (
                <Nav.Link onClick={() => { handleLogout(); handleDrawerClose(); }} className="drawer-nav-item logout-item">
                  <LogOut size={20} className="me-3" /> Logout
                </Nav.Link>
              )}
            </Nav>
          </div>

          {/* Categories Drawer Section */}
          <div className="categories-section p-4">
            <h6 className="section-title mb-3">Categories</h6>
            <div className="categories-list">
              <CategoryBar categories={allCategories} loading={loadingCategories} onCategoryClick={handleDrawerClose} />
            </div>
          </div>

        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
