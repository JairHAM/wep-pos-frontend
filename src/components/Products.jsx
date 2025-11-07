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
    description: '',
    price: '',
    cost: '',
    categoryId: '',
    stock: 0,
    minStock: 5,
    sku: '',
    barcode: '',
    imageUrl: ''
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      alert('Error al cargar productos');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stock: parseInt(formData.stock),
        minStock: parseInt(formData.minStock)
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
      } else {
        await productsAPI.create(productData);
      }

      setShowModal(false);
      resetForm();
      loadProducts();
      alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      cost: product.cost || '',
      categoryId: product.categoryId,
      stock: product.stock,
      minStock: product.minStock,
      sku: product.sku || '',
      barcode: product.barcode || '',
      imageUrl: product.imageUrl || ''
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
      description: '',
      price: '',
      cost: '',
      categoryId: '',
      stock: 0,
      minStock: 5,
      sku: '',
      barcode: '',
      imageUrl: ''
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
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="product-image" />
            )}
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="product-category">
                  {categories.find(c => c.id === product.categoryId)?.name}
                </span>
                <span className="product-price">${product.price.toFixed(2)}</span>
              </div>
              <div className="product-stock">
                <span className={product.stock < product.minStock ? 'low-stock' : ''}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="product-actions">
                <button onClick={() => handleEdit(product)} className="btn-edit">
                  Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className="btn-delete">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: Pizza Margherita"
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción del producto"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio de Venta *</label>
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
                  <label>Costo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Stock Mínimo</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    placeholder="SKU-001"
                  />
                </div>

                <div className="form-group">
                  <label>Código de Barras</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
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
