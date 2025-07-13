import { FaChartBar, FaBoxes, FaRoute, FaCog } from "react-icons/fa";

const links = [
  { icon: <FaChartBar />,   label: "Analytics", href: "/dashboard" },
  { icon: <FaBoxes />,      label: "Products",  href: "/" },
//   { icon: <FaRoute />,      label: "Deliveries", href: "/deliveries" },
  { icon: <FaCog />,        label: "Settings",  href: "#" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Walmart SC</h2>
      {links.map(l => (
        <a key={l.label} href={l.href}>{l.icon}{l.label}</a>
      ))}
    </aside>
  );
}