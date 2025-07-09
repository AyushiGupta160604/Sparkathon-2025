import { Routes, Route, Navigate } from "react-router-dom";
import Deliveries from "./pages/Deliveries";
import RouteView from "./pages/RouteView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/deliveries" />} />
      <Route path="/deliveries" element={<Deliveries />} />
      <Route path="/route/:orderId" element={<RouteView />} />
    </Routes>
  );
}

export default App;