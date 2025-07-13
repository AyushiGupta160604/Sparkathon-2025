export default function MetricCard({ value, label, extra }) {
  return (
    <div className="metric-card">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {extra && <small>{extra}</small>}
    </div>
  );
}