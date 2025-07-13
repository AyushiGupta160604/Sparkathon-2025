import { Bar, Pie } from "react-chartjs-2";
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

export default function DashboardGrid({ barData, barOpts, pieData }) {
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
    <div className="chart-grid">
      {/* bar */}
      <div className="chart-card">
        <h4 className="chart-title">Top Products</h4>
        <div style={{ height: 250 }}>
          <Bar data={barData} options={barOpts} />
        </div>
      </div>

      {/* pie */}
      <div className="chart-card">
        <h4 className="chart-title">Orders by City</h4>
        <div style={{ height: 270 }}>
          <Pie data={pieData} />
        </div>
      </div>
      {/* heat‑map card */}
        <div className="chart-card" style={{ gridColumn: "1 / -1" }}>
            <h4 className="chart-title">Demand Heat‑map</h4>
            <div style={{ height: "320px" /* or 100% */, width: "100%" }}>
                <MapContainer
                    center={[23.2599, 77.4126]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}   // <- card bounds
                >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {heatPoints.length > 0 && <HeatLayer points={heatPoints} />}
                </MapContainer>
            </div>
        </div>
    </div>
  );
}