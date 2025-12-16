import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Trash2, Plus, LogOut, Edit2, X, Check } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Create States
  const [newCatName, setNewCatName] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '1', note: '' });

  // Edit States
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({ name: '', quantity: '', note: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/data/dashboard');
      setCategories(res.data.categories);
      setItems(res.data.items);
      if (res.data.categories.length > 0 && !activeCategory) {
        setActiveCategory(res.data.categories[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Category Handlers ---
  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await api.post('/data/categories', { name: newCatName });
      setCategories([...categories, res.data]);
      setActiveCategory(res.data._id);
      setNewCatName('');
    } catch (err) {
      console.error(err);
    }
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat._id);
    setEditCatName(cat.name);
  };

  const saveEditCategory = async (id) => {
    try {
      const res = await api.put(`/data/categories/${id}`, { name: editCatName });
      setCategories(categories.map(c => c._id === id ? res.data : c));
      setEditingCatId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEditCategory = () => {
    setEditingCatId(null);
    setEditCatName('');
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure? This will delete all items in this category.")) return;
    try {
      await api.delete(`/data/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
      setItems(items.filter(i => i.category !== id));
      if (activeCategory === id) setActiveCategory(null);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Item Handlers ---
  const addItem = async (e) => {
    e.preventDefault();
    if (!activeCategory) return;
    try {
      const res = await api.post('/data/items', { ...newItem, categoryId: activeCategory });
      setItems([...items, res.data]);
      setNewItem({ name: '', quantity: '1', note: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const startEditItem = (item) => {
    setEditingItemId(item._id);
    setEditItemData({ name: item.name, quantity: item.quantity, note: item.note || '' });
  };

  const saveEditItem = async (id) => {
    try {
      const res = await api.put(`/data/items/${id}`, editItemData);
      setItems(items.map(i => i._id === id ? res.data : i));
      setEditingItemId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/data/items/${id}`);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBought = async (item) => {
    try {
      const res = await api.put(`/data/items/${item._id}`, { isBought: !item.isBought });
      setItems(items.map(i => i._id === item._id ? res.data : i));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(i => i.category === activeCategory);

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">My Shopping List</h1>
        <div className="user-info">
          <span style={{ color: 'var(--text-secondary)' }}>Hello, <strong style={{ color: 'var(--text-primary)' }}>{user?.username}</strong></span>
          <button onClick={logout} className="btn" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        
        {/* Sidebar: Categories */}
        <div className="glass-panel sidebar">
          <h3 className="sidebar-heading">
            Categories
            <span className="count-badge">{categories.length}</span>
          </h3>
          
          <form onSubmit={addCategory} className="add-category-form">
            <input
              className="input-field"
              style={{ marginBottom: 0 }}
              placeholder="New Category..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 0.8rem' }}><Plus size={20} /></button>
          </form>

          <div className="category-list">
            {categories.map(cat => (
              <div
                key={cat._id}
                onClick={() => !editingCatId && setActiveCategory(cat._id)}
                className={`category-item ${activeCategory === cat._id ? 'active' : ''}`}
                style={{ cursor: editingCatId === cat._id ? 'default' : 'pointer' }}
              >
                {editingCatId === cat._id ? (
                  <div className="edit-input-group">
                    <input 
                      value={editCatName} 
                      onChange={(e) => setEditCatName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="input-field"
                      style={{ flex: 1, padding: '0.4rem', border: '1px solid #000', marginBottom: 0, color: '#000' }}
                      autoFocus
                    />
                    <button onClick={(e) => { e.stopPropagation(); saveEditCategory(cat._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><Check size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); cancelEditCategory(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000' }}><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    <div className="actions" style={{ display: 'flex', gap: '0.5rem', opacity: activeCategory === cat._id ? 1 : 0.6 }}>
                      <Edit2 size={15} onClick={(e) => { e.stopPropagation(); startEditCategory(cat); }} style={{ cursor: 'pointer' }} />
                      <Trash2 size={15} onClick={(e) => { e.stopPropagation(); deleteCategory(cat._id); }} style={{ cursor: 'pointer' }} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Items */}
        <div className="glass-panel item-panel">
          {activeCategory ? (
            <>
              <div style={{ marginBottom: '2rem' }}>
                 <form onSubmit={addItem} className="add-item-form">
                    <div className="form-group-lg">
                        <label className="label-sm">Item Name</label>
                        <input
                            className="input-invisible"
                            placeholder="e.g. Milk"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="divider-vertical"></div>
                    <div className="form-group-sm">
                        <label className="label-sm">Qty</label>
                        <input
                            className="input-invisible"
                            placeholder="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                        />
                    </div>
                    <div className="divider-vertical"></div>
                     <div className="form-group-lg">
                        <label className="label-sm">Note</label>
                        <input
                            className="input-invisible"
                            placeholder="e.g. Low fat"
                            value={newItem.note}
                            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.2rem', borderRadius: '8px' }}>Add</button>
                  </form>
              </div>

              <div className="item-list">
                {filteredItems.map(item => (
                  <div
                    key={item._id}
                    className={`item-row ${item.isBought ? 'bought' : ''}`}
                  >
                     {editingItemId === item._id ? (
                        <div className="edit-input-group">
                            <input 
                                className="input-field"
                                style={{ marginBottom: 0, flex: 2 }}
                                value={editItemData.name} 
                                onChange={(e) => setEditItemData({...editItemData, name: e.target.value})}
                            />
                            <input 
                                className="input-field"
                                style={{ marginBottom: 0, flex: 1 }}
                                value={editItemData.quantity} 
                                onChange={(e) => setEditItemData({...editItemData, quantity: e.target.value})}
                            />
                             <input 
                                className="input-field"
                                style={{ marginBottom: 0, flex: 2 }}
                                value={editItemData.note} 
                                onChange={(e) => setEditItemData({...editItemData, note: e.target.value})}
                                placeholder="Note"
                            />
                             <button onClick={() => saveEditItem(item._id)} style={{ background: 'var(--success)', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#fff' }}><Check size={18} /></button>
                             <button onClick={() => setEditingItemId(null)} style={{ background: 'var(--danger)', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#fff' }}><X size={18} /></button>
                        </div>
                     ) : (
                        <>
                            <div 
                                onClick={() => toggleBought(item)}
                                className={`check-circle ${item.isBought ? 'checked' : ''}`}
                            >
                                {item.isBought && <Check size={14} color="#000" />}
                            </div>
                            
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    textDecoration: item.isBought ? 'line-through' : 'none', 
                                    fontWeight: 600, 
                                    fontSize: '1.1rem',
                                    color: item.isBought ? 'var(--text-secondary)' : 'var(--text-primary)'
                                }}>
                                    {item.name}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ background: 'var(--bg-primary)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>x {item.quantity}</span>
                                    {item.note && <span>{item.note}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => startEditItem(item)} className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }}>
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => deleteItem(item._id)} className="btn" style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </>
                     )}
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon-wrapper">
                        <Plus size={32} color="var(--accent-primary)" />
                    </div>
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>No items in this category yet.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Add your first item above!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-secondary)' }}>
                <Edit2 size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.2rem' }}>Select a category to view items</p>
              <p>or create a new one to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
