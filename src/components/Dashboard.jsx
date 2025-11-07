import { useState } from 'react';
import useAuthStore from '../store/authStore';
import Products from './Products';
import Categories from './Categories';
import WaiterView from './WaiterView';
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('sales');
  const [viewAsRole, setViewAsRole] = useState(user?.role);

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout();
    }
  };

  // Determinar qué rol está viendo actualmente
  const currentRole = user?.role === 'MANAGER' ? viewAsRole : user?.role;

  // Permisos por rol
  const rolePermissions = {
    ADMIN: ['sales', 'products', 'categories', 'users', 'reports', 'settings'],
    MANAGER: ['sales', 'products', 'categories', 'users', 'reports', 'settings'],
    CASHIER: ['sales', 'reports'],
    WAITER: ['sales'],
    COOK: ['orders-kitchen'],
    BARTENDER: ['orders-bar']
  };

  const hasPermission = (tab) => {
    return rolePermissions[currentRole]?.includes(tab);
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
          {user?.role === 'MANAGER' && (
            <div className="role-switcher">
              <label>Ver como:</label>
              <select 
                value={viewAsRole} 
                onChange={(e) => {
                  setViewAsRole(e.target.value);
                  setActiveTab('sales');
                }}
              >
                <option value="MANAGER">Gerente</option>
                <option value="CASHIER">Cajero</option>
                <option value="WAITER">Mesero</option>
                <option value="COOK">Cocinero</option>
                <option value="BARTENDER">Bartender</option>
              </select>
            </div>
          )}
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
        {hasPermission('sales') && (
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
        )}
        
        {hasPermission('products') && (
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
            Productos
          </button>
        )}

        {hasPermission('categories') && (
          <button 
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Categorías
          </button>
        )}

        {hasPermission('orders-kitchen') && (
          <button 
            className={`nav-item ${activeTab === 'orders-kitchen' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders-kitchen')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Cocina
          </button>
        )}

        {hasPermission('orders-bar') && (
          <button 
            className={`nav-item ${activeTab === 'orders-bar' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders-bar')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"></path>
            </svg>
            Bar
          </button>
        )}
        
        {hasPermission('reports') && (
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
        )}
        
        {hasPermission('settings') && (
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
        )}
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

        {activeTab === 'products' && <Products />}

        {activeTab === 'categories' && <Categories />}

        {activeTab === 'orders-kitchen' && (
          <div className="content-section">
            <h2>�‍🍳 Órdenes de Cocina</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🍳</div>
              <h3>Vista de Cocina</h3>
              <p>Esta sección estará disponible próximamente</p>
              <p className="hint">Aquí verás las órdenes pendientes para preparar.</p>
            </div>
          </div>
        )}

        {activeTab === 'orders-bar' && (
          <div className="content-section">
            <h2>🍹 Órdenes de Bar</h2>
            <div className="placeholder-content">
              <div className="placeholder-icon">🍸</div>
              <h3>Vista de Bar</h3>
              <p>Esta sección estará disponible próximamente</p>
              <p className="hint">Aquí verás las órdenes de bebidas pendientes.</p>
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
              <p className="hint">Aquí podrás configurar usuarios y preferencias del sistema.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
