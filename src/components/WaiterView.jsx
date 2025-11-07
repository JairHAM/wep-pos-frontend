import { useState, useEffect } from 'react';
import { ordersAPI, productsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import './WaiterView.css';

function WaiterView() {
  const { user } = useAuthStore();
  const [view, setView] = useState('tables'); // 'tables' o 'order'
  const [selectedTable, setSelectedTable] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  console.log('WaiterView renderizado', { user, view });

  // Mesas del 1 al 20
  const tables = Array.from({ length: 20 }, (_, i) => i + 1);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    try {
      console.log('Cargando productos...');
      const data = await productsAPI.getAll();
      console.log('Productos cargados:', data);
      setProducts(Array.isArray(data) ? data.filter(p => p.isActive) : []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos: ' + error.message);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await ordersAPI.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    }
  };

  const handleTableSelect = (tableNumber) => {
    setSelectedTable(tableNumber);
    setView('order');
    setCart([]);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
          : item
      ));
    }
  };

  const sendToKitchen = async () => {
    if (cart.length === 0) {
      alert('Agrega productos al pedido');
      return;
    }

    try {
      const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const orderData = {
        tableNumber: selectedTable.toString(),
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal,
        total: subtotal
      };

      await ordersAPI.create(orderData);
      alert(`✅ Pedido enviado a cocina para Mesa ${selectedTable}`);
      setCart([]);
      setView('tables');
      setSelectedTable(null);
      loadOrders();
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      alert('Error al enviar pedido: ' + (error.response?.data?.error || error.message));
    }
  };

  const getTableOrders = (tableNumber) => {
    return orders.filter(order =>
      order.tableNumber === tableNumber.toString() &&
      order.status !== 'COMPLETED' &&
      order.status !== 'CANCELLED'
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#FFA726',
      PREPARING: '#42A5F5',
      READY: '#66BB6A',
      DELIVERED: '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Pendiente',
      PREPARING: 'Preparando',
      READY: 'Listo',
      DELIVERED: 'Entregado'
    };
    return labels[status] || status;
  };

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?.name === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="waiter-view">
      {view === 'tables' ? (
        <>
          <div className="waiter-header">
            <h2>🍽️ Selecciona una Mesa</h2>
            <p className="waiter-subtitle">Mesero: {user?.fullName}</p>
          </div>

          <div className="tables-grid">
            {tables.map(tableNumber => {
              const tableOrders = getTableOrders(tableNumber);
              const hasOrders = tableOrders.length > 0;
              
              return (
                <div
                  key={tableNumber}
                  className={`table-card ${hasOrders ? 'has-orders' : ''}`}
                  onClick={() => handleTableSelect(tableNumber)}
                >
                  <div className="table-number">Mesa {tableNumber}</div>
                  {hasOrders && (
                    <div className="table-status">
                      {tableOrders.map(order => (
                        <span
                          key={order.id}
                          className="status-badge"
                          style={{ background: getStatusColor(order.status) }}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="order-header">
            <button className="btn-back" onClick={() => setView('tables')}>
              ← Volver a Mesas
            </button>
            <h2>Mesa {selectedTable}</h2>
          </div>

          <div className="order-layout">
            <div className="products-section">
              <div className="category-tabs">
                <button
                  className={selectedCategory === 'all' ? 'active' : ''}
                  onClick={() => setSelectedCategory('all')}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="products-grid-waiter">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="product-card-waiter"
                    onClick={() => addToCart(product)}
                  >
                    <div className="product-name">{product.name}</div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-section">
              <h3>Pedido</h3>
              
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>No hay productos en el pedido</p>
                  <p className="hint">Selecciona productos del menú</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.productId} className="cart-item">
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-price">${item.price.toFixed(2)}</div>
                        </div>
                        <div className="cart-item-controls">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                            +
                          </button>
                          <button
                            className="btn-remove"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="cart-item-total">${item.subtotal.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-amount">${cartTotal.toFixed(2)}</span>
                  </div>

                  <button className="btn-send-kitchen" onClick={sendToKitchen}>
                    🍳 Enviar a Cocina
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WaiterView;
