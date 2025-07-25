import { useState } from "react";
import { CircleAlert, CirclePlus, CircleMinus } from "lucide-react";
import "./product_row.css";

const ProductRow = ({ title, product, variant }) => {
  const [quantity, setQuantity] = useState(variant.inventory_quantity);
  const [modalOpen, setModalOpen] = useState(false);

  /* Function to verify if stock tracking is enabled */
  const isStockTrackingEnabled = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}stock/${variant.inventory_item_id}`
    );
    const data = await response.json();

    if (data.body.inventory_levels[0].available !== null) {
      setModalOpen(true);
    } else {
      alert("Stock tracking is not enabled for this product.");
    }
  };

  const changeQuantityApi = () => {
    try {
      fetch(
        `${process.env.REACT_APP_API_URL}stock/${variant.inventory_item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        }
      ).then((response) => {
        if (response.status === 200) {
          setModalOpen(false);
          alert("Stock level updated successfully!");
        }
      });
    } catch (error) {
      console.error("Error updating stock level:", error);
    }
  };

  return (
    <tr>
      <td>{product.id}</td>
      <td>{title}</td>
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
                <button
                  className="modal-update"
                  onClick={() => {
                    changeQuantityApi();
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="stock-level" onClick={() => isStockTrackingEnabled()}>
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
