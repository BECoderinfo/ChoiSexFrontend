import React, { useState, useEffect } from "react";
import { Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./CategoryBar.css";
import { getCategories } from "../api/category";

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        setCategories(response?.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="category-bar">
        <Container fluid>
          <div className="text-center p-3">Loading categories...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="category-bar">
      <Container fluid>
        <Nav className="category-nav">
          {categories.map((category) => (
            <Nav.Item key={category._id}>
              <NavLink
                to={`/category/${category._id}`}
                className={({ isActive }) =>
                  isActive
                    ? "category-link active"
                    : "category-link"
                }
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
