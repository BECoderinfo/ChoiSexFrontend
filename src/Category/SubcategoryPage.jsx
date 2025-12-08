import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import ComingSoon from "./ComingSoon";
import ProductSection from "../NewLaunches/ProductSection";
import Loader, { useLoadingWithDelay } from "../Loader";
import { getProductsBySubcategory, getSubcategories } from "../api/subcategory";

function SubcategoryPage() {
  const { subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const showLoader = useLoadingWithDelay(loading, 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, subcategoriesRes] = await Promise.all([
          getProductsBySubcategory(subcategoryId),
          getSubcategories(),
        ]);

        const apiProducts = productsRes?.data?.products || productsRes?.data || [];
        setProducts(apiProducts);

        const subcat = subcategoriesRes?.data?.find(
          (s) => String(s._id) === String(subcategoryId)
        );
        setSubcategoryName(subcat ? `Top ${subcat.name} Products` : "");
      } catch (error) {
        console.error("Error fetching subcategory products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (subcategoryId) {
      fetchData();
    }
  }, [subcategoryId]);

  if (showLoader) {
    return <Loader fullScreen={true} size="large" />;
  }

  if (!products || products.length === 0) {
    return <ComingSoon />;
  }

  return (
    <Container>
      <ProductSection
        title={subcategoryName}
        products={products}
        viewall="hide"
        all="allproduct"
      />
    </Container>
  );
}

export default SubcategoryPage;


