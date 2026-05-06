import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/index';
import Loader from '../../components/common/Loader';
import { FaSave, FaUndo } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'RentEase',
    siteDescription: 'Furniture & Appliance Rental Platform',
    contactEmail: 'support@rentease.com',
    contactPhone: '+91 1234567890',
    address: '',
    deliveryCharge: 0,
    freeDeliveryAbove: 5000,
    maintenanceCharge: 0,
    refundPercentage: 100,
    maxRentalMonths: 12,
    minRentalMonths: 1,
    enableCod: true,
    enableOnlinePayment: true,
    enableMaintenanceRequest: true,
    enableAutoRenewal: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminService.getSettings();
      setSettings(response.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default?')) {
      fetchSettings();
      toast.success('Settings reset');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure platform settings and preferences</p>
        </div>
        <button onClick={handleReset} className="btn-outline flex items-center gap-2">
          <FaUndo /> Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Site Description</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Address</label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="input"
                rows="2"
              />
            </div>
          </div>
        </div>

        {/* Rental Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rental Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Minimum Rental (months)</label>
              <input
                type="number"
                value={settings.minRentalMonths}
                onChange={(e) => setSettings({ ...settings, minRentalMonths: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="12"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Maximum Rental (months)</label>
              <input
                type="number"
                value={settings.maxRentalMonths}
                onChange={(e) => setSettings({ ...settings, maxRentalMonths: parseInt(e.target.value) })}
                className="input"
                min="1"
                max="24"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Delivery Charge (₹)</label>
              <input
                type="number"
                value={settings.deliveryCharge}
                onChange={(e) => setSettings({ ...settings, deliveryCharge: parseInt(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Free Delivery Above (₹)</label>
              <input
                type="number"
                value={settings.freeDeliveryAbove}
                onChange={(e) => setSettings({ ...settings, freeDeliveryAbove: parseInt(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Refund Percentage (%)</label>
              <input
                type="number"
                value={settings.refundPercentage}
                onChange={(e) => setSettings({ ...settings, refundPercentage: parseInt(e.target.value) })}
                className="input"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Maintenance Charge (₹)</label>
              <input
                type="number"
                value={settings.maintenanceCharge}
                onChange={(e) => setSettings({ ...settings, maintenanceCharge: parseInt(e.target.value) })}
                className="input"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Feature Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <span>Enable Cash on Delivery</span>
              <input
                type="checkbox"
                checked={settings.enableCod}
                onChange={(e) => setSettings({ ...settings, enableCod: e.target.checked })}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <span>Enable Online Payments</span>
              <input
                type="checkbox"
                checked={settings.enableOnlinePayment}
                onChange={(e) => setSettings({ ...settings, enableOnlinePayment: e.target.checked })}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <span>Enable Maintenance Requests</span>
              <input
                type="checkbox"
                checked={settings.enableMaintenanceRequest}
                onChange={(e) => setSettings({ ...settings, enableMaintenanceRequest: e.target.checked })}
                className="toggle"
              />
            </label>
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <span>Enable Auto-Renewal</span>
              <input
                type="checkbox"
                checked={settings.enableAutoRenewal}
                onChange={(e) => setSettings({ ...settings, enableAutoRenewal: e.target.checked })}
                className="toggle"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .toggle {
          width: 40px;
          height: 20px;
          appearance: none;
          background: #ccc;
          border-radius: 20px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
        }
        .toggle:checked {
          background: #3B82F6;
        }
        .toggle::before {
          content: '';
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: all 0.3s;
        }
        .toggle:checked::before {
          transform: translateX(20px);
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;