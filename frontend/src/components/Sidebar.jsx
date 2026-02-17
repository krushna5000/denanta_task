import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>

      <Link to="/">Plants</Link>
      <Link to="/departments">Departments</Link>
      <Link to="/cost-centers">Cost Centers</Link>
      <Link to="/work-centers">Work Centers</Link>

      {/* Logout Button */}
      {user && (
        <button 
          onClick={logout}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}
