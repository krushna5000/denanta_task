import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: '1' }}>
        <h2>Dashboard</h2>

        <Link to="/">Plants</Link>
        <Link to="/departments">Departments</Link>
        <Link to="/cost-centers">Cost Centers</Link>
        <Link to="/work-centers">Work Centers</Link>
      </div>

      {/* Logout Button */}
      {user && (
        <div style={{ marginTop: 'auto', paddingTop: '300px' }}>
          <div style={{ 
            marginBottom: '10px', 
            padding: '10px',
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {user?.name}
          </div>
          <button 
            onClick={logout}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <i class="fa-solid fa-user"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
}
