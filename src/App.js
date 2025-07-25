import "./App.css";
import { useEffect, useState } from "react";
import { TreePine, SquareChevronUp, SquareChevronDown } from "lucide-react";
import ProductRow from "./components/product_row";

function App() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}products`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  // Rassembler toutes les variantes dans un seul tableau
  const variantsWithProduct = products.flatMap((product) =>
    product.variants.map((variant) => ({
      ...variant,
      productTitle: product.title,
      fullTitle:
        product.title +
        (variant.title === "Default Title" ? "" : " - " + variant.title),
      product,
    }))
  );

  // Trier par stock
  const sortedVariants = [...variantsWithProduct].sort((a, b) =>
    sortOrder === "asc"
      ? a.inventory_quantity - b.inventory_quantity
      : b.inventory_quantity - a.inventory_quantity
  );

  // Générer les lignes
  const listProducts = sortedVariants.map((variant) => (
    <ProductRow
      key={variant.id}
      title={variant.fullTitle}
      product={variant.product}
      variant={variant}
    />
  ));

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <TreePine />
          <h1>
            Inven<span className="highlight">Tree</span>
          </h1>
        </div>
      </header>
      <main className="main-content">
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Sku</th>
                <th>Title</th>
                <th
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <div className="stock-column">
                    Stock{" "}
                    {sortOrder === "asc" ? (
                      <SquareChevronUp color="lightblue" />
                    ) : (
                      <SquareChevronDown color="lightblue" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>{listProducts}</tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
