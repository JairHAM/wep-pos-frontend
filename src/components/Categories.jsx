import { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4CAF50',
    icon: '🍽️'
  });

  const icons = ['🍽️', '🍕', '🍔', '🥗', '🍝', '🍜', '🍲', '🥘', '🍛', '🍱', 
                 '🥙', '🌮', '🌯', '🥪', '🍖', '🍗', '🥩', '🍤', '🦐', '🍣',
                 '🍰', '🎂', '🧁', '🍮', '🍩', '🍪', '🥧', '🍨', '🍦', '🍧',
                 '☕', '🍵', '🥤', '🍹', '🍸', '🍺', '🍻', '🍷', '🥃', '🧃'];

  useEffect(() => {
    loadCategories();
  }, []);

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
      await categoriesAPI.create(formData);
      setShowModal(false);
      resetForm();
      loadCategories();
      alert('Categoría creada exitosamente');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert('Error al crear categoría');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#4CAF50',
      icon: '🍽️'
    });
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>Gestión de Categorías</h2>
        <button 
          className="btn-add"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Nueva Categoría
        </button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="category-card"
            style={{ borderLeft: `4px solid ${category.color || '#4CAF50'}` }}
          >
            <div className="category-icon">{category.icon || '🍽️'}</div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nueva Categoría</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Platos Principales"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción de la categoría"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Icono</label>
                <div className="icon-picker">
                  {icons.map((icon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
