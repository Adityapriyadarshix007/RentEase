import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Category created successfully');
        setShowModal(false);
        setFormData({ name: '', slug: '', description: '' });
        fetchCategories();
      } else {
        toast.error('Failed to create category');
      }
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://rentease-backend-njvk.onrender.com/api/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          toast.success('Category deleted');
          fetchCategories();
        } else {
          toast.error('Failed to delete');
        }
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading categories...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Category
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (<tr key={cat._id}><td className="px-6 py-4 text-sm text-gray-900">{cat.name}</td><td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td><td className="px-6 py-4 text-sm text-gray-500">{cat.description || '-'}</td><td className="px-6 py-4"><button onClick={() => handleDelete(cat._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button></td></tr>))}
          </tbody>
        </table>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Category</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4"><label className="block mb-2">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })} className="w-full px-4 py-2 border rounded-lg" required /></div>
              <div className="mb-4"><label className="block mb-2">Slug</label><input type="text" value={formData.slug} className="w-full px-4 py-2 border rounded-lg bg-gray-100" readOnly /></div>
              <div className="mb-4"><label className="block mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows="3" /></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg">Create</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
