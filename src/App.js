import React, { useState, useEffect } from 'react';
import defaultMenuData from './resources/menu.json';
import './App.css';

function App() {
  const [menuData, setMenuData] = useState(() => {
    const savedData = localStorage.getItem('menuData');
    return savedData ? JSON.parse(savedData) : defaultMenuData;
  });

  const [showForm, setShowForm] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    preparation_time: ''
  });

  const [errors, setErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('menuData', JSON.stringify(menuData));
  }, [menuData]);

  const handleDelete = (indexToRemove) => {
    const newMenu = [...menuData.menu];
    newMenu.splice(indexToRemove, 1);
    setMenuData({ menu: newMenu });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newItem.name.trim()) newErrors.name = 'הקלד שם מנה';
    if (!newItem.description.trim()) newErrors.description = 'הקלד תיאור';
    if (!newItem.price.trim()) newErrors.price = 'הקלד מחיר';
    else if (isNaN(Number(newItem.price))) newErrors.price = 'המחיר חייב להיות מספר';
    if (!newItem.category.trim()) newErrors.category = 'הקלד קטגוריה';
    if (!newItem.preparation_time.trim()) newErrors.preparation_time = 'הקלד זמן הכנה';
    else if (isNaN(Number(newItem.preparation_time))) newErrors.preparation_time = 'זמן הכנה חייב להיות מספר';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const itemToAdd = {
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price),
      category: newItem.category.trim(),
      preparation_time: parseInt(newItem.preparation_time, 10)
    };

    const updatedMenu = [...menuData.menu, itemToAdd];
    setMenuData({ menu: updatedMenu });

    setNewItem({ name: '', description: '', price: '', category: '', preparation_time: '' });
    setShowForm(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMenu = menuData.menu
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => item.name.includes(searchTerm));

  return (
    <div dir="rtl" className="app-container">
      <h2>תפריט</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="חפש לפי שם"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <button onClick={() => setShowForm(true)} className="add-button">
        הוסף מנה חדשה
      </button>

      <table className="menu-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>מחיר</th>
            <th>מחיקה</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenu.map((item) => (
            <tr key={item.originalIndex}>
              <td>{item.name}</td>
              <td>{item.price} ₪</td>
              <td>
                <button
                  onClick={() => handleDelete(item.originalIndex)}
                  className="delete-button"
                >
                  מחק
                </button>
              </td>
            </tr>
          ))}
          {filteredMenu.length === 0 && (
            <tr>
              <td colSpan="3">אין מנות</td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>הוסף מנה חדשה</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>שם:</label>
                <input name="name" value={newItem.name} onChange={handleChange} />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label>תיאור:</label>
                <input name="description" value={newItem.description} onChange={handleChange} />
                {errors.description && <div className="error">{errors.description}</div>}
              </div>

              <div className="form-group">
                <label>מחיר:</label>
                <input name="price" value={newItem.price} onChange={handleChange} />
                {errors.price && <div className="error">{errors.price}</div>}
              </div>

              <div className="form-group">
                <label>קטגוריה:</label>
                <input name="category" value={newItem.category} onChange={handleChange} />
                {errors.category && <div className="error">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label>זמן הכנה:</label>
                <input name="preparation_time" value={newItem.preparation_time} onChange={handleChange} />
                {errors.preparation_time && <div className="error">{errors.preparation_time}</div>}
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-button">שמור</button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-button">
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;