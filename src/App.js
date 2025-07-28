import "./App.css";
import { useEffect, useState } from "react";
import {
  TreePine,
  SquareChevronUp,
  SquareChevronDown,
  RotateCcw,
} from "lucide-react";
import ProductRow from "./components/product_row";

function App() {
  const [products, setProducts] = useState([]);
  // State pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [skuFilter, setSkuFilter] = useState("");
  const [minStock, setMinStock] = useState("");
  // State pour le tri
  const [sortOrder, setSortOrder] = useState("asc");

  // Pour déclencher l'animation une fois
  const [isRotating, setIsRotating] = useState(false);

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

  const resetFilters = () => {
    // Lance l’animation
    setIsRotating(true);
    setSearchTerm("");
    setSkuFilter("");
    setMinStock("");

    // Stoppe l’animation après 0.5s
    setTimeout(() => setIsRotating(false), 500);
  };

  // Rassembler toutes les variantes dans un seul tableau
  const variantsWithProduct = products.length
    ? products.flatMap((product) =>
        product.variants.map((variant) => ({
          ...variant,
          productTitle: product.title,
          fullTitle:
            product.title +
            (variant.title === "Default Title" ? "" : " - " + variant.title),
          product,
        }))
      )
    : [];

  // Appliquer les filtres
  const filteredVariants = variantsWithProduct.filter((variant) => {
    // Par défaut, tout passe
    let isMatch = true;

    if (searchTerm !== "") {
      isMatch =
        isMatch &&
        variant.fullTitle.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (skuFilter !== "") {
      const lower = skuFilter.toLowerCase();

      isMatch =
        isMatch &&
        ((variant.sku && variant.sku.toLowerCase().includes(lower)) ||
          String(variant.product_id).includes(lower) ||
          String(variant.id).includes(lower));
    }

    if (minStock !== "") {
      isMatch = isMatch && variant.inventory_quantity <= parseInt(minStock);
    }

    return isMatch;
  });

  // Trier par stock
  const sortedVariants = [...filteredVariants].sort((a, b) =>
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
          <TreePine color="lightgreen" size={32} />
          <h1>
            Inven<span className="highlight">Tree</span>
          </h1>
        </div>
      </header>
      <main className="main-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
          className="filter-container"
        >
          <input
            type="text"
            placeholder="Filter by SKU / Product ID"
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            type="number"
            placeholder="Show stock ≤ ..."
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            min="0"
          />
          <RotateCcw
            onClick={resetFilters}
            className={isRotating ? "rotate" : ""}
            style={{ cursor: "pointer" }}
            color="lightblue"
          />
        </div>

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
