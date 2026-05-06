import React, { useEffect, useState } from 'react';
import { productService } from '../services/index';

const TestPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await productService.getProducts();
        console.log('Response:', response);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>Found {products.length} products</p>
      <ul className="mt-4 space-y-2">
        {products.slice(0, 5).map(p => (
          <li key={p._id} className="border p-2 rounded">
            {p.name} - ₹{p.monthlyRent}/month
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestPage;
