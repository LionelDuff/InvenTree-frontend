import "./App.css";
import { useEffect, useState } from "react";
import {
  TreePine,
  SquareChevronUp,
  SquareChevronDown,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import ProductRow from "./components/product_row";

function App() {
  const [products, setProducts] = useState([]);
  // State pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeFilter, setBarcodeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minStock, setMinStock] = useState("");
  // State pour le tri
  const [sortOrder, setSortOrder] = useState("asc");

  // State pour la détection mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Pour déclencher l'animation une fois
  const [isRotating, setIsRotating] = useState(false);

  // Détection des changements de taille de fenêtre
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Récupération des produits depuis l'API
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
    setBarcodeFilter("");
    setMinStock("");
    setCategoryFilter("");

    // Stoppe l’animation après 0.5s
    setTimeout(() => setIsRotating(false), 500);
  };

  // Appliquer les filtres
  const filteredProducts = products.filter((product) => {
    // Par défaut, tout passe
    let isMatch = true;

    if (searchTerm !== "") {
      isMatch =
        isMatch &&
        product.title.toLowerCase().includes(searchTerm.toLowerCase());
    }

    if (barcodeFilter !== "") {
      const lower = barcodeFilter.toLowerCase();

      isMatch = isMatch && product.meta.barcode.toLowerCase().includes(lower);
    }

    if (categoryFilter !== "") {
      isMatch =
        isMatch &&
        product.category.toLowerCase().includes(categoryFilter.toLowerCase());
    }

    if (minStock !== "") {
      isMatch = isMatch && product.stock <= parseInt(minStock);
    }

    return isMatch;
  });

  // Trier par stock
  const sortedProducts = [...filteredProducts].sort((a, b) =>
    sortOrder === "asc" ? a.stock - b.stock : b.stock - a.stock
  );

  // Mettre à jour l'état des produits
  const updateProductStock = (id, newStock) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock: newStock } : product
      )
    );
  };

  // Générer les lignes
  const listProducts = sortedProducts.map((product) => (
    <ProductRow
      key={product.id}
      product={product}
      updateProductStock={updateProductStock}
    />
  ));

  // If screen mobile
  if (isMobile) {
    return (
      <div className="mobile-view">
        <TriangleAlert color="orange" size={48} />
        <h2>This app can only be used on a computer.</h2>
      </div>
    );
  }

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
        <div className="filter-container">
          <input
            type="text"
            placeholder="Filter by Barcode"
            value={barcodeFilter}
            onChange={(e) => setBarcodeFilter(e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Filter by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            <option value="beauty">beauty</option>
            <option value="fragrances">fragrances</option>
            <option value="furniture">furniture</option>
            <option value="groceries">groceries</option>
            <option value="home-decoration">home-decoration</option>
            <option value="kitchen-accessories">kitchen-accessories</option>
            <option value="laptops">laptops</option>
            <option value="men-shirts">men-shirts</option>
            <option value="mens-shoes">mens-shoes</option>
            <option value="mens-watches">mens-watches</option>
            <option value="mobile-accessories">mobile-accessories</option>
            <option value="motorcycle">motorcycle</option>
            <option value="skin-care">skin-care</option>
            <option value="smartphones">smartphones</option>
            <option value="sports-accessories">sports-accessories</option>
          </select>
          <input
            type="number"
            placeholder="Show stock ≤ ..."
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            min="0"
            className="input"
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
                <th>Barcode</th>
                <th>Title</th>
                <th>Category</th>
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
