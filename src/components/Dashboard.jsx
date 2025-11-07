import { useState } from 'react';
import useAuthStore from '../store/authStore';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('sales');

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>POS Restaurante</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.fullName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Salir
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Ventas
        </button>
        <button 
          className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          Productos
        </button>
        <button 
          className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
          Reportes
        </button>
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 1v6m0 6v6m-6-6h6m6 0h6"></path>
          </svg>
          Configuración
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'sales' && (
          <div className="content-section">
            <h2>🛒 Nueva Venta</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🚧</div>
              <h3>Módulo de Ventas</h3>
              <p>Esta sección estará disponible próximamente</p>
              <p className="hint">Aquí podrás realizar ventas, agregar productos al carrito y procesar pagos.</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="content-section">
            <h2>📦 Gestión de Productos</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🚧</div>
              <h3>Módulo de Productos</h3>
              <p>Esta sección estará disponible próximamente</p>
              <p className="hint">Aquí podrás administrar tu inventario, agregar y editar productos.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="content-section">
            <h2>📊 Reportes y Estadísticas</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🚧</div>
              <h3>Módulo de Reportes</h3>
              <p>Esta sección estará disponible próximamente</p>
              <p className="hint">Aquí podrás ver reportes de ventas, productos más vendidos y análisis.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="content-section">
            <h2>⚙️ Configuración del Sistema</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🚧</div>
              <h3>Módulo de Configuración</h3>
              <p>Esta sección estará disponible próximamente</p>
              <p className="hint">Aquí podrás configurar categorías, usuarios y preferencias del sistema.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
