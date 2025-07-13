import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// custom icons
const agentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const customerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684912.png",
  iconSize: [32, 32],
});

const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2784/2784445.png",
  iconSize: [32, 32],
});

function CenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 6);
  }, [position]);
  return null;
}

function RouteView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [routeCoords, setRouteCoords] = useState([]);
  const [steps, setSteps] = useState([]);
  const [agentLocation, setAgentLocation] = useState(null);
  const [customerCoords, setCustomerCoords] = useState(null);
  const [storeCoords, setStoreCoords] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");


  const speakInstruction = (instruction) => {
    if ("speechSynthesis" in window && instruction) {
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.cancel(); // cancel any ongoing speech
      speechSynthesis.speak(utterance);
    }
  };

  const markAsDelivered = async () => {
  try {
    const ok = await fetch(
      `http://localhost:5000/order/${orderId}/delivered`,
      { method: "PATCH" }
    ).then(r => r.ok);

    if (!ok) throw new Error();
    alert("✅ Delivered");        // ← immediate feedback
    localStorage.setItem("refreshDeliveries", "true");
    navigate("/deliveries");      // ← go back to list
  } catch {
    alert("❌ Could not mark delivered");
  }
};


  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const orderRes = await fetch(`http://localhost:5000/order/${orderId}`);
        const orderData = await orderRes.json();

        const store = {
          lat: orderData.store.latitude,
          lng: orderData.store.longitude
        };

        const customer = {
          lat: orderData.customerAddress.lat,
          lng: orderData.customerAddress.lng
        };

        setStoreCoords([store.lat, store.lng]);
        setCustomerCoords([customer.lat, customer.lng]);

        const osrmRes = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${store.lng},${store.lat};${customer.lng},${customer.lat}?overview=full&geometries=geojson&steps=true`
        );
        const osrmData = await osrmRes.json();

        const coords = osrmData.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        const instructions = osrmData.routes[0].legs[0].steps.map((s) => {
          const maneuver = s.maneuver;
          const road = s.name || "unnamed road";
          const direction = maneuver.modifier ? `${maneuver.modifier}` : "";
          return `${maneuver.type} ${direction} onto ${road}`;
        });

        setRouteCoords(coords);
        setSteps(instructions);
        console.log("→ Route Coordinates:", coords);
      } catch (err) {
        console.error("Error loading route:", err);
      }
    };

    fetchRoute();
  }, [orderId]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setAgentLocation(coords);
        console.log("Live location:", coords.lat, coords.lng);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const mapCenter = agentLocation || storeCoords || [21.17, 72.83]; // Fallback to Surat

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 2 }}>
        <MapContainer center={mapCenter} zoom={6} style={{ height: "100%", width: "100%" }}>
          <CenterMap position={mapCenter} />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {storeCoords && (
            <Marker position={storeCoords} icon={storeIcon} />
          )}
          {customerCoords && (
            <Marker position={customerCoords} icon={customerIcon} />
          )}
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
          {agentLocation && (
            <>
              <Marker position={[agentLocation.lat, agentLocation.lng]} icon={agentIcon} />
              {customerCoords && (
                <Polyline
                  positions={[
                    [agentLocation.lat, agentLocation.lng],
                    customerCoords
                  ]}
                  color="green"
                  dashArray="6, 6"
                />
              )}
            </>
          )}
        </MapContainer>
      </div>

      <div style={{ width: "350px", padding: "1rem", background: "#f3e5ab", overflowY: "auto" }}>
        <h2 style={{ color: "#3e2723" }}>📍 Delivery Instructions</h2>
        <ol style={{ textAlign: "left" }}>
          {steps.map((step, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>{step}</li>
          ))}
        </ol>
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => {
              speakInstruction(steps[currentStepIndex]);
              setCurrentStepIndex(prev => prev + 1);
            }}
            disabled={currentStepIndex >= steps.length || isSpeaking}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: currentStepIndex < steps.length ? "pointer" : "not-allowed"
            }}
          >
            🔊 {currentStepIndex < steps.length ? "Next Instruction" : "All Instructions Done"}
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={markAsDelivered}
            disabled={isDelivered}
            className="deliver-button"
          >
            📦 {isDelivered ? "Delivered ✅" : "Mark as Delivered"}
          </button>
          {statusMessage && <p style={{ color: "#3e2723", marginTop: "0.5rem" }}>{statusMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default RouteView;