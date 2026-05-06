import { useState, useEffect } from 'react';
import { rentalService } from '../services/api';
import toast from 'react-hot-toast';

export const useRentals = (initialFilters = {}) => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchRentals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rentalService.getMyRentals(filters);
      setRentals(response.data.rentals);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [filters]);

  const createRental = async (rentalData) => {
    try {
      const response = await rentalService.createRental(rentalData);
      toast.success('Rental created successfully');
      await fetchRentals();
      return response.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create rental');
      throw err;
    }
  };

  const cancelRental = async (id) => {
    try {
      await rentalService.cancelRental(id);
      toast.success('Rental cancelled successfully');
      await fetchRentals();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel rental');
      throw err;
    }
  };

  const extendRental = async (id, extensionMonths) => {
    try {
      await rentalService.extendRental(id, { extensionMonths });
      toast.success(`Rental extended by ${extensionMonths} month(s)`);
      await fetchRentals();
    } catch (err) {
      toast.error(err.message || 'Failed to extend rental');
      throw err;
    }
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const changePage = (page) => {
    setFilters({ ...filters, page });
  };

  return {
    rentals,
    loading,
    error,
    pagination,
    filters,
    createRental,
    cancelRental,
    extendRental,
    updateFilters,
    changePage,
    refetch: fetchRentals
  };
};