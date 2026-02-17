import Sidebar from "./Sidebar";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '20px',
          backgroundColor: '#f8f9fa'
        }}>
          <h1 style={{ margin: 0, color: '#333333', fontSize: '24px', fontWeight: '600' }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Welcome, {user?.name}
            </span>
          </div>
        </div>

        {/* Main content */}
        {children}
      </div>
    </div>
  );
}
