import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await fetch('https://rentease-backend-njvk.onrender.com/api/rentals/my-rentals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        toast.error('Session expired. Please login again.');
        return;
      }
      
      const data = await response.json();
      setRentals(data.rentals || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (rentals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-4">No Rentals Yet</h2>
        <button onClick={() => navigate('/products')} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Rentals</h1>
      <div className="space-y-4">
        {rentals.map((rental) => (
          <div key={rental._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div><h3 className="text-xl font-semibold">{rental.product?.name}</h3><p className="text-gray-500 text-sm">{rental.product?.subCategory}</p></div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">{rental.status?.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-gray-500">Rental Period</p><p className="font-medium">{new Date(rental.rentalStartDate).toLocaleDateString()} - {new Date(rental.rentalEndDate).toLocaleDateString()}</p></div>
              <div><p className="text-gray-500">Tenure</p><p className="font-medium">{rental.tenureMonths} months</p></div>
              <div><p className="text-gray-500">Monthly Rent</p><p className="font-medium text-blue-600">₹{rental.monthlyRent}/month</p></div>
              <div><p className="text-gray-500">Total Amount</p><p className="font-medium">₹{rental.totalAmount}</p></div>
            </div>
            <div className="mt-4 pt-4 border-t"><button onClick={() => navigate(`/rentals/${rental._id}`)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">View Details</button></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRentals;
