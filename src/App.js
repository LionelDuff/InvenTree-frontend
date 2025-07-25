import "./App.css";
import { useEffect, useState } from "react";
import { TreePine } from "lucide-react";
import ProductRow from "./components/product_row";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`${process.env.API_URL}products`);
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

  const listProducts = products.map((product) => {
    return product.variants.map((variant) => (
      <ProductRow
        key={variant.id}
        title={
          product.title +
          (variant.title === "Default Title" ? "" : " - " + variant.title)
        }
        product={product}
        variant={variant}
      />
    ));
  });

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
                <th className="sku-column">Sku</th>
                <th>Title</th>
                <th className="stock-column">Stock</th>
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
