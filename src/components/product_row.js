import { useState } from "react";
import { CircleAlert, CirclePlus, CircleMinus } from "lucide-react";
import "./product_row.css";

const ProductRow = ({ product, updateProductStock }) => {
  const [quantity, setQuantity] = useState(product.stock);
  const [modalOpen, setModalOpen] = useState(false);

  // Mettre à jour la quantité dans le stock
  const updateStock = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stock: quantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
      updateProductStock(product.id, quantity);
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return (
    <tr>
      <td>{product.meta.barcode}</td>
      <td>{product.title}</td>
      <td>{product.category}</td>
      <td>
        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Update Stock Level</h2>
              <div className="modal-body">
                <CircleMinus
                  style={{ cursor: "pointer", marginRight: "6px" }}
                  color="red"
                  onClick={() => {
                    if (quantity > 0) setQuantity(quantity - 1);
                  }}
                />
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ width: "50px", textAlign: "center" }}
                />
                <CirclePlus
                  style={{ cursor: "pointer", marginLeft: "6px" }}
                  color="lightgreen"
                  onClick={() => setQuantity(quantity + 1)}
                />
              </div>
              <div className="modal-actions">
                <button
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
                <button className="modal-update" onClick={updateStock}>
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="stock-level" onClick={() => setModalOpen(true)}>
          {quantity}
          {quantity < 10 && (
            <CircleAlert style={{ marginLeft: "6px" }} color="red" />
          )}
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
