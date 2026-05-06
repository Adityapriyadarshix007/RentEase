import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AdminImages = () => {
  const [selectedType, setSelectedType] = useState('products');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      toast.success(`${files.length} images uploaded successfully!`);
      setUploading(false);
    }, 1500);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Image Manager</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Category</label>
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-lg"
          >
            <option value="products">Products</option>
            <option value="about">About Page</option>
            <option value="team">Team Section</option>
          </select>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="mb-4"
          />
          {uploading && <p className="text-blue-600">Uploading...</p>}
          <p className="text-gray-500 text-sm mt-2">
            Upload images for {selectedType} category
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminImages;
