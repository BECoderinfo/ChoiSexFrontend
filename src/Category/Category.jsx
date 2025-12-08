import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";
import { getSubcategories } from "../api/subcategory";
import { buildAssetUrl } from "../api/client";
import Loader, { useLoadingWithDelay } from "../Loader";

function Category() {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoader = useLoadingWithDelay(loading, 400);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSubcategories();
        setSubcategories(response?.data || []);
      } catch (error) {
        console.error("Error loading subcategories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (showLoader) {
    return (
      <div className="category-section">
        <Loader fullScreen={false} />
      </div>
    );
  }

  if (!subcategories.length) {
    return (
      <div className="category-section">
        <p className="category-empty">No categories available yet.</p>
      </div>
    );
  }

  return (
    <div className="category-section">
      <div className="category-grid">
        {subcategories.map((item) => (
          <div
            key={item._id}
            className="category-item"
            
          >
            <div className="category-img-wrap">
              <img
                src={buildAssetUrl(item.image) || "https://via.placeholder.com/180?text=No+Image"}
                alt={item.name}
                className="category-img"
                onClick={() => navigate(`/subcategory/${item._id}`)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;