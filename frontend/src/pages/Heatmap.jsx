// src/pages/Heatmap.jsx
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function HeatLayer({ points }) {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!map || !points.length) return;

    if (heatRef.current) {
      map.removeLayer(heatRef.current);
    }

    heatRef.current = window.L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
    });

    map.whenReady(() => {
      heatRef.current.addTo(map);
    });
  }, [map, points]);

  return null;
}

export default function Heatmap() {
  const [heatPoints, setHeatPoints] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/order")
      .then((res) => res.json())
      .then((orders) => {
        const pts = orders
          .filter(
            (o) =>
              o?.customerAddress?.lat &&
              o?.customerAddress?.lng &&
              !isNaN(o.customerAddress.lat) &&
              !isNaN(o.customerAddress.lng)
          )
          .map((o) => [
            o.customerAddress.lat,
            o.customerAddress.lng,
            o.quantity || 1,
          ]);
        setHeatPoints(pts);
      })
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[23.2599, 77.4126]} // somewhere central India
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {heatPoints.length > 0 && <HeatLayer points={heatPoints} />}
      </MapContainer>
    </div>
  );
}
