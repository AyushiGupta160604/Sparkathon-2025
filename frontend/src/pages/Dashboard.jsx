// import { useEffect, useState } from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS, ArcElement, BarElement, CategoryScale,
//   LinearScale, Tooltip, Legend
// } from "chart.js";
// ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const browns = ["#8d6e63", "#a1887f", "#bcaaa4", "#d7ccc8", "#efebe9"];

// export default function Dashboard() {
//   const [top, setTop] = useState([]);
//   const [byCity, setByCity] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/analytics/top-products")
//       .then(r => r.json()).then(setTop);

//     fetch("http://localhost:5000/analytics/orders-city")
//       .then(r => r.json()).then(setByCity);
//   }, []);

//   const barData = {
//     labels: top.map(p => p.title),
//     datasets: [{
//       label: "Qty Sold",
//       data: top.map(p => p.qtySold),
//       backgroundColor: browns[0],
//       borderRadius: 6,
//     }]
//   };

//   const pieData = {
//     labels: byCity.map(c => c._id),
//     datasets: [{
//       data: byCity.map(c => c.orders),
//       backgroundColor: browns.slice(0, byCity.length),
//       borderWidth: 1,
//       borderColor: "#fff"
//     }]
//   };

//   const barOpts = {
//     plugins: { legend: { display: false } },
//     scales: {
//       x: { ticks: { color: "#3e2723" }, grid: { display: false } },
//       y: { ticks: { color: "#3e2723" }, grid: { color: "#e0d7d1" } }
//     },
//     maintainAspectRatio: false
//   };

//   return (
//     <div className="analytics-wrap">
//       <h1 style={{ color: "#3e2723", marginLeft: "0.5rem", fontSize: "1.8rem", textAlign: "center" }}> Quick Analytics</h1>

//       <div className="analytics-card" style={{ height: 300 }}>
//         <Bar data={barData} options={barOpts} />
//       </div>

//       <div className="analytics-card" style={{ height: 340 }}>
//         <Pie data={pieData} options={{ plugins:{ legend:{ position:"top", labels:{ color:"#3e2723" }}}}} />
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MetricCard from "../components/MetricCard";
import DashboardGrid from "../components/DashboardGrid";
import {
  Chart as ChartJS, ArcElement, BarElement,
  CategoryScale, LinearScale, Tooltip, Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/dashboard.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AnalyticsDashboard() {
  const [top, setTop]   = useState([]);
  const [cities, setCities] = useState([]);
  const [kpi, setKpi] = useState({ orders: 0, revenue: 0 });

  /* fetch */
  useEffect(() => {
    fetch("http://localhost:5000/analytics/top-products")
      .then(r=>r.json()).then(setTop);
    fetch("http://localhost:5000/analytics/orders-city")
      .then(r=>r.json()).then(setCities);
    fetch("http://localhost:5000/analytics/kpi")// create later
      .then(r=>r.json()).then(setKpi);
  }, []);

  /* chart data */
  const barData = {
    labels: top.map(p=>p.title),
    datasets:[{ data: top.map(p=>p.qtySold), backgroundColor:"#8d6e63", borderRadius:8 }]
  };
  const barOpts = { plugins:{legend:{display:false}}, maintainAspectRatio:false };

  const pieData = {
    labels: cities.map(c=>c._id),
    datasets:[{ data: cities.map(c=>c.orders), backgroundColor:["#6d4c41","#a1887f","#d7ccc8","#efebe9"] }]
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        <div className="metric-row">
          <MetricCard value={kpi.orders} label="Total Orders" />
          {/* <MetricCard value={`₹${kpi.revenue}`} label="Revenue" /> */}
          <MetricCard value={`$${943}`} label="Revenue" />
          <MetricCard value={top.length} label="Products Sold" />
        </div>

        <DashboardGrid barData={barData} barOpts={barOpts} pieData={pieData} />
      </main>
    </div>
  );
}