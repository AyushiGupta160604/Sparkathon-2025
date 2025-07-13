import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Deliveries() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("http://localhost:5000/order")
      .then((res) => res.json())
      .then(data => {
        console.log("Fetched Orders:", JSON.stringify(data, null, 2));
        setOrders(data);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetchOrders(); 

    const onFocus = () => {
      if (localStorage.getItem("refreshDeliveries") === "true") {
        localStorage.removeItem("refreshDeliveries");
        fetchOrders();
      }
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const visibleOrders = orders.filter(o => o.deliveryStatus !== "delivered");

  return (
    <div className="deliveries-page">
      <h1 className="deliveries-heading">📦 Assigned Deliveries</h1>

      {visibleOrders.length === 0 ? (
        <p className="empty-message">No deliveries available.</p>
      ) : (
        <div className="deliveries-list">
          {visibleOrders.map((order) => (
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