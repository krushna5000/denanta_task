import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Navigation</h2>

      <Link to="/">Plants</Link>
      <Link to="/departments">Departments</Link>
      <Link to="/cost-centers">Cost Centers</Link>
      <Link to="/work-centers">Work Centers</Link>
    </div>
  );
}
