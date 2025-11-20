import React from "react";
import "./Category.css";
import {category} from '../database/data'

function Category() {
  return (
    <div className="category-section">
      <div className="category-grid">
        {category.map((item) => (
          <div key={item.id} className={`category-item div${item.id}`}>
            <div className="category-img-wrap">
              <img src={item.image} alt={item.name} className="category-img" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;