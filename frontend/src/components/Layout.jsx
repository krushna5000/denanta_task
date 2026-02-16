import Sidebar from "./Sidebar";

export default function Layout({ children, title }) {
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
          <h1 style={{ margin: 0 }}>
            {title}
          </h1>
        </div>

        {/* Main content */}
        {children}
      </div>
    </div>
  );
}
