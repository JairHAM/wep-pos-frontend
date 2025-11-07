import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import './CookView.css';

function CookView() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, PREPARING, ALL

  useEffect(() => {
    console.log('CookView renderizado', { user });
    loadOrders();
    // Recargar órdenes cada 30 segundos
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      console.log('Cargando órdenes para cocina...');
      const response = await api.get('/orders');
      const ordersData = response.data.orders || response.data || [];
      console.log('Órdenes recibidas:', ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}`, { status: newStatus });
      // Recargar órdenes después de actualizar
      await loadOrders();
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      alert('Error al actualizar el estado de la orden');
    }
  };

  const startPreparing = (orderId) => {
    if (window.confirm('¿Comenzar a preparar esta orden?')) {
      updateOrderStatus(orderId, 'PREPARING');
    }
  };

  const markAsReady = (orderId) => {
    if (window.confirm('¿Marcar esta orden como lista?')) {
      updateOrderStatus(orderId, 'READY');
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'ALL') {
      return orders.filter(order => 
        order.status === 'PENDING' || 
        order.status === 'PREPARING' || 
        order.status === 'READY'
      );
    }
    return orders.filter(order => order.status === filter);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': { text: 'Pendiente', className: 'status-pending' },
      'PREPARING': { text: 'Preparando', className: 'status-preparing' },
      'READY': { text: 'Lista', className: 'status-ready' }
    };
    const badge = badges[status] || { text: status, className: '' };
    return <span className={`status-badge ${badge.className}`}>{badge.text}</span>;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const getElapsedTime = (dateString) => {
    const orderTime = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - orderTime) / 1000 / 60);
    
    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes === 1) return '1 min';
    return `${diffMinutes} min`;
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return <div className="cook-view"><div className="loading">Cargando órdenes...</div></div>;
  }

  return (
    <div className="cook-view">
      <div className="cook-header">
        <h1>🍳 Cocina</h1>
        <div className="cook-filters">
          <button 
            className={filter === 'PENDING' ? 'active' : ''}
            onClick={() => setFilter('PENDING')}
          >
            Pendientes ({orders.filter(o => o.status === 'PENDING').length})
          </button>
          <button 
            className={filter === 'PREPARING' ? 'active' : ''}
            onClick={() => setFilter('PREPARING')}
          >
            Preparando ({orders.filter(o => o.status === 'PREPARING').length})
          </button>
          <button 
            className={filter === 'ALL' ? 'active' : ''}
            onClick={() => setFilter('ALL')}
          >
            Todas
          </button>
          <button onClick={loadOrders} className="refresh-btn">
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No hay órdenes {filter === 'ALL' ? 'activas' : filter === 'PENDING' ? 'pendientes' : 'en preparación'}</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className={`order-card status-${order.status.toLowerCase()}`}>
              <div className="order-card-header">
                <div className="order-info">
                  <h2>Mesa {order.tableNumber}</h2>
                  <span className="order-time">
                    {formatTime(order.createdAt)} • {getElapsedTime(order.createdAt)}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.product?.name || 'Producto'}</span>
                    {item.notes && (
                      <span className="item-notes">📝 {item.notes}</span>
                    )}
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="order-notes">
                  <strong>Notas:</strong> {order.notes}
                </div>
              )}

              <div className="order-actions">
                {order.status === 'PENDING' && (
                  <button 
                    className="btn-start"
                    onClick={() => startPreparing(order.id)}
                  >
                    ▶️ Comenzar a Preparar
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button 
                    className="btn-ready"
                    onClick={() => markAsReady(order.id)}
                  >
                    ✅ Marcar como Lista
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CookView;
