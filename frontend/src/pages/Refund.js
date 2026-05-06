import React from 'react';
import { FaShieldAlt, FaClock, FaUndo, FaMoneyBillWave, FaCreditCard, FaQuestionCircle } from 'react-icons/fa';

const Refund = () => {
  const refundSteps = [
    {
      icon: <FaClock className="text-3xl text-primary" />,
      title: 'Request Initiation',
      description: 'Submit refund request within 7 days of return pickup'
    },
    {
      icon: <FaUndo className="text-3xl text-primary" />,
      title: 'Product Inspection',
      description: 'We inspect returned product for damages (2-3 business days)'
    },
    {
      icon: <FaMoneyBillWave className="text-3xl text-primary" />,
      title: 'Refund Processing',
      description: 'Refund processed within 5-7 business days after approval'
    },
    {
      icon: <FaCreditCard className="text-3xl text-primary" />,
      title: 'Amount Credited',
      description: 'Refund amount credited to original payment method'
    }
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: January 1, 2024</p>

        <div className="bg-blue-50 border-l-4 border-primary p-4 mb-8">
          <div className="flex items-center">
            <FaShieldAlt className="text-primary text-2xl mr-3" />
            <p className="text-gray-700">
              At RentEase, customer satisfaction is our priority. We ensure transparent and fair refund policies.
            </p>
          </div>
        </div>

        {/* Security Deposit Refund */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Security Deposit Refund</h2>
          <div className="space-y-3 text-gray-600">
            <p>✓ Full refund of security deposit if product is returned in good condition</p>
            <p>✓ No deductions for normal wear and tear</p>
            <p>✓ Deductions only for damages beyond normal usage</p>
            <p>✓ Refund processed within 7-10 business days after pickup</p>
          </div>
        </div>

        {/* Rental Amount Refund */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Rental Amount Refund</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2">Before Delivery</h3>
              <p className="text-gray-600">100% refund of rental amount if cancelled before delivery</p>
            </div>
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2">After Delivery (First 7 Days)</h3>
              <p className="text-gray-600">Prorated refund for remaining days minus delivery charges</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">After 7 Days</h3>
              <p className="text-gray-600">No refund for current month, can cancel for next month</p>
            </div>
          </div>
        </div>

        {/* Refund Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6">Refund Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">{step.icon}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Refundable Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Non-Refundable Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Customized Products</p>
              <p className="text-sm text-red-600 mt-1">Made-to-order items cannot be refunded</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Damaged Products</p>
              <p className="text-sm text-red-600 mt-1">Products damaged due to misuse</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Missing Parts</p>
              <p className="text-sm text-red-600 mt-1">Products returned with missing accessories</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Beyond Return Period</p>
              <p className="text-sm text-red-600 mt-1">Return requests after 30 days</p>
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
              <h3 className="font-semibold text-lg mb-2">How long does refund take?</h3>
              <p className="text-gray-600">Refunds are processed within 5-7 business days after approval.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Will I get full deposit back?</h3>
              <p className="text-gray-600">Yes, full deposit is refunded if product is in good condition.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What if I cancel mid-month?</h3>
              <p className="text-gray-600">Current month's rent is non-refundable, future months are refunded.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">
            For refund-related queries, contact us at{' '}
            <a href="mailto:refunds@rentease.com" className="text-primary hover:underline">
              refunds@rentease.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Refund;
