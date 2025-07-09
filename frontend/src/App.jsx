import { use, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [customerAddress, setCustomerAddress] = useState({
    line1: "",
    city: "",
    pincode: "",
    lat: "",
    lng: ""
  });
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const suggestionRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
    setMessage("");
  };

  const handleSuggestClick = async (product) => {
    try {
      const res = await axios.get(`http://localhost:5000/products/suggest/${product._id}`);
      setSuggestions(res.data);
      setMessage(`Found ${res.data.length} alternatives`);
      setTimeout(() => {
        suggestionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); 
    } catch (err) {
      setMessage("❌ Could not fetch suggestions");
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/order/place", {
        productId: selectedProduct._id,
        quantity,
        customerAddress: {
          ...customerAddress,
          lat: parseFloat(customerAddress.lat),
          lng: parseFloat(customerAddress.lng)
        }
      });
      setMessage("✅ Order placed successfully!");
      setShowForm(false);
      setSelectedProduct(null);
      setSuggestions([]);
      setTimeout(() => {
        messageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100); 
    } catch (err) {
      setMessage("❌ Error placing order: " + err.response?.data?.error || "Unknown error");
    }
  };

  console.log("Selected product:", selectedProduct);

  return (
    <div>
      <h1 style={{color: "#3e2723"}}>Product Catalog</h1>
      <div className="product-list">
        {products.map(prod => (
          <div key={prod._id} className="product-card">
            <img src={prod.image} alt={prod.title} />
            <h3>{prod.title}</h3>
            <p>${prod.price}</p>
            <p>Stock: {prod.quantity}</p>
            <p><b>Store:</b> {prod.storeId?.name}</p>
            {prod.quantity > 0 ? (
              <button onClick={() => handleOrderClick(prod)}>Order Now</button>
            ) : (
              <button onClick={() => handleSuggestClick(prod)}>Suggest Alternatives</button>
            )}
          </div>
        ))}
      </div>

    {showForm && selectedProduct && (
      <div className="modal-overlay">
        <div className="modal-form">
          <h2>Order: {selectedProduct.title}</h2>
          <form onSubmit={handleOrderSubmit}>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              min="1"
              max={selectedProduct.quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            /><br />
            <input type="text" placeholder="Address Line" required onChange={(e) => setCustomerAddress({ ...customerAddress, line1: e.target.value })} /><br />
            <input type="text" placeholder="City" required onChange={(e) => setCustomerAddress({ ...customerAddress, city: e.target.value })} /><br />
            <input type="text" placeholder="Pincode" required onChange={(e) => setCustomerAddress({ ...customerAddress, pincode: e.target.value })} /><br />
            <input type="text" placeholder="Latitude" required onChange={(e) => setCustomerAddress({ ...customerAddress, lat: e.target.value })} /><br />
            <input type="text" placeholder="Longitude" required onChange={(e) => setCustomerAddress({ ...customerAddress, lng: e.target.value })} /><br />
            <button type="submit" className="order">Place Order</button>
            <button type="button" className="cancel" onClick={() => setShowForm(false)}> Cancel</button>
          </form>
        </div>
      </div>
    )}

      {suggestions.length > 0 && (
        <div ref={suggestionRef} style={{ marginTop: "2rem" }}>
          <h2 style={{textAlign: "center"}}>Suggested Alternatives</h2>
          <div className="product-list">
            {suggestions.map((sug) => (
              <div key={sug._id} className="product-card">
                <img src={sug.image} alt={sug.title} />
                <h4>{sug.title}</h4>
                <p>₹{sug.price}</p>
                <p>Stock: {sug.quantity}</p>
                <button onClick={() => handleOrderClick(sug)}>Order</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <p ref={messageRef} 
        style={{ 
          marginTop: "1rem", 
          //color: "#4caf50", 
          color: "rgb(2, 42, 3)",
          textAlign: "center",
          //background: "#e6ffe6",
          padding: "0.5rem",
          borderRadius: "5px",
          fontWeight: "500"
        }}
      >
        {message}
      </p>
      )}
    </div>
  );
}

export default App;