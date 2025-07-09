import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Deliveries() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/order")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div className="deliveries-page">
      <h1 className="deliveries-heading">📦 Assigned Deliveries</h1>

      {orders.length === 0 ? (
        <p className="empty-message">No deliveries available at the moment.</p>
      ) : (
        <div className="deliveries-list">
          {orders.map((order) => (
            <div key={order._id} className="delivery-card">
              <h3 className="product-title">{order.productId?.title}</h3>
              <p><b>🛒 From:</b> {order.storeId?.address}</p>
              <p><b>🏠 To:</b> {order.customerAddress?.line1}, {order.customerAddress?.city}</p>
              <button
                className="route-button"
                onClick={() => navigate(`/route/${order._id}`)}
              >
                View Route →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Deliveries;