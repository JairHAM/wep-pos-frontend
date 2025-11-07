import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    isActive: true
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProducts([]);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        isActive: formData.isActive,
        stock: 100, // Stock por defecto
        minStock: 5
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        alert('Producto actualizado exitosamente');
      } else {
        await productsAPI.create(productData);
        alert('Producto creado exitosamente');
      }

      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productsAPI.delete(id);
        loadProducts();
        alert('Producto eliminado');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar producto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      isActive: true
    });
    setEditingProduct(null);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Gestión de Productos</h2>
        <button 
          className="btn-add"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="products-filters">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-filter"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No hay productos registrados</p>
            <button className="btn-add" onClick={() => { resetForm(); setShowModal(true); }}>
              Agregar primer producto
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <div className="product-header-row">
                  <h3>{product.name}</h3>
                  <span className={`product-status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? '✓ Disponible' : '✗ No disponible'}
                  </span>
                </div>
                <div className="product-details">
                  <span className="product-category">
                    {categories.find(c => c.id === product.categoryId)?.icon} {' '}
                    {categories.find(c => c.id === product.categoryId)?.name}
                  </span>
                  <span className="product-price">${product.price.toFixed(2)}</span>
                </div>
                <div className="product-actions">
                  <button onClick={() => handleEdit(product)} className="btn-edit">
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="btn-delete">
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Nombre del Plato *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Pizza Margarita, Café Americano"
                />
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <span>Disponible para venta</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
