import React from 'react';
import { FaCalendarTimes, FaMoneyBillWave, FaExclamationTriangle, FaCheckCircle, FaClock, FaQuestionCircle } from 'react-icons/fa';

const Cancellation = () => {
  const cancellationScenarios = [
    {
      period: 'Before Delivery',
      refund: '100% Refund',
      charges: 'No cancellation fee',
      icon: <FaCheckCircle className="text-green-500 text-2xl" />
    },
    {
      period: 'Within 7 days of delivery',
      refund: 'Prorated refund',
      charges: 'Delivery charges applicable',
      icon: <FaClock className="text-yellow-500 text-2xl" />
    },
    {
      period: 'After 7 days of delivery',
      refund: 'No refund for current month',
      charges: 'Can cancel for next month',
      icon: <FaCalendarTimes className="text-orange-500 text-2xl" />
    },
    {
      period: 'Mid-rental cancellation',
      refund: 'Future months refunded',
      charges: 'Current month non-refundable',
      icon: <FaMoneyBillWave className="text-blue-500 text-2xl" />
    }
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Cancellation Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 1, 2024</p>

        <div className="bg-yellow-50 border-l-4 border-warning p-4 mb-8">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-warning text-2xl mr-3" />
            <p className="text-gray-700">
              Please review our cancellation policy carefully before cancelling your rental.
            </p>
          </div>
        </div>

        {/* Cancellation Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6">Cancellation Timeline & Refunds</h2>
          <div className="space-y-4">
            {cancellationScenarios.map((scenario, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
                <div className="flex items-center space-x-4">
                  {scenario.icon}
                  <div>
                    <h3 className="font-semibold">{scenario.period}</h3>
                    <p className="text-sm text-gray-500">{scenario.charges}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary">{scenario.refund}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Cancel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">How to Cancel Your Rental</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">1</div>
              <h3 className="font-semibold mb-2">Login to Account</h3>
              <p className="text-sm text-gray-500">Go to My Rentals section</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">2</div>
              <h3 className="font-semibold mb-2">Select Rental</h3>
              <p className="text-sm text-gray-500">Choose the rental you want to cancel</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">3</div>
              <h3 className="font-semibold mb-2">Click Cancel</h3>
              <p className="text-sm text-gray-500">Follow prompts to confirm cancellation</p>
            </div>
          </div>
        </div>

        {/* Cancellation Fees */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Cancellation Fees</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time of Cancellation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">More than 7 days before delivery</td>
                  <td className="px-6 py-4 text-green-600">No cancellation fee</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">3-7 days before delivery</td>
                  <td className="px-6 py-4 text-yellow-600">10% of rental amount</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Less than 3 days before delivery</td>
                  <td className="px-6 py-4 text-orange-600">25% of rental amount</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">After delivery (within 7 days)</td>
                  <td className="px-6 py-4 text-red-600">No cancellation fee, but delivery charges apply</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Cases */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Special Circumstances</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold">Product Quality Issues</h3>
                <p className="text-gray-600 text-sm">Full refund including delivery charges if product is defective</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold">Wrong Product Delivered</h3>
                <p className="text-gray-600 text-sm">Immediate cancellation with full refund</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold">Medical Emergency</h3>
                <p className="text-gray-600 text-sm">Special consideration with proper documentation</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaQuestionCircle className="text-primary mr-2" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel anytime, but fees may apply based on timing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Will I get deposit back on cancellation?</h3>
              <p className="text-gray-600">Yes, security deposit is fully refundable unless there are damages.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How to cancel extension request?</h3>
              <p className="text-gray-600">Contact support within 24 hours of extension request.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">
            For cancellation assistance, contact us at{' '}
            <a href="mailto:cancellations@rentease.com" className="text-primary hover:underline">
              cancellations@rentease.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;
