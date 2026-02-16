import Sidebar from "./Sidebar";

export default function Layout({ children }) {
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
          borderBottom: '1px solid #ddd',
          backgroundColor: '#f8f9fa'
        }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            Management System
          </h1>
        </div>

        {/* Main content */}
        {children}
      </div>
    </div>
  );
}
