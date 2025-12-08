import React from "react";
import { Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Loader from "../Loader";
import "./CategoryBar.css";

const CategoryBar = ({ className = "", onCategoryClick, categories = [], loading }) => {
  if (loading) {
    return (
      <div className="category-bar">
        <Container fluid>
          <Loader size="small" />
        </Container>
      </div>
    );
  }

  return (
    <div className={`category-bar ${className}`}>
      <Container fluid>
        <Nav className="category-nav">
          {categories.map((category) => (
            <Nav.Item key={category._id}>
              <NavLink
                to={`/category/${category._id}`}
                className={({ isActive }) =>
                  isActive ? "category-link active" : "category-link"
                }
                onClick={() => typeof onCategoryClick === "function" && onCategoryClick()}
              >
                {category.name}
              </NavLink>
            </Nav.Item>
          ))}
        </Nav>
      </Container>
    </div>
  );
};

export default CategoryBar;
