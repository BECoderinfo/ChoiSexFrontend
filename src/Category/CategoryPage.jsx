import { useEffect, useState } from "react";
import ComingSoon from "./ComingSoon";
import { useParams } from "react-router-dom";
import { getProductsByCategoryQuery } from "../api/product";
import { getCategories } from "../api/category";
import { Container } from "react-bootstrap";
import ProductSection from "../NewLaunches/ProductSection";


function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const [productsRes, categoriesRes] = await Promise.all([
          getProductsByCategoryQuery(categoryId),
          getCategories()
        ]);
  
     
  
        const apiProducts =
          productsRes?.data?.products ||
          productsRes?.data ||
          [];
  
        setProducts(apiProducts);
  
        const category = categoriesRes?.data?.find(
          (cat) => String(cat._id) === String(categoryId)
        );
  
        setCategoryName(category ? "Top " + category.name + " Products" : "");
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (categoryId) fetchData();
  }, [categoryId]);
  

  if (loading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  // 👉 If no products → show Coming Soon
  if (!products || products.length === 0) {

    return <ComingSoon />;
  }

  return (
    <Container>
      <ProductSection
        title={categoryName}
        products={products}
        viewall="hide"
        all="allproduct"
      />
    </Container>
  );
}

export default CategoryPage;
