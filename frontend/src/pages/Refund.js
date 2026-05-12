import React from 'react';
import { FaShieldAlt, FaClock, FaUndo, FaMoneyBillWave, FaCreditCard, FaQuestionCircle, FaExchangeAlt, FaCalendarAlt, FaRupeeSign } from 'react-icons/fa';

const Refund = () => {
  const refundSteps = [
    {
      icon: <FaClock className="text-3xl text-blue-600" />,
      title: 'Request Initiation',
      description: 'Submit return request from "My Rentals" section within 7 days of rental end date'
    },
    {
      icon: <FaUndo className="text-3xl text-blue-600" />,
      title: 'Return Pickup',
      description: 'We schedule pickup from your address within 2-3 business days'
    },
    {
      icon: <FaExchangeAlt className="text-3xl text-blue-600" />,
      title: 'Product Inspection',
      description: 'Product inspected for damages at our facility (2-3 business days)'
    },
    {
      icon: <FaMoneyBillWave className="text-3xl text-blue-600" />,
      title: 'Refund Processing',
      description: 'Refund processed within 5-7 business days after inspection approval'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Refund & Cancellation Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: May 12, 2026</p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded-r-lg">
          <div className="flex items-center">
            <FaShieldAlt className="text-blue-600 text-2xl mr-3" />
            <p className="text-gray-700">
              At RentEase, your satisfaction is our priority. We ensure transparent and fair refund policies 
              for all our rental products.
            </p>
          </div>
        </div>

        {/* Security Deposit Refund */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaRupeeSign className="text-green-600 mr-2" />
            Security Deposit Refund
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>✅ <span className="font-semibold">Full refund</span> of security deposit if product is returned in good condition</p>
            <p>✅ No deductions for normal wear and tear</p>
            <p>✅ Partial refund for minor damages (deduction based on damage assessment)</p>
            <p>✅ Deductions only for damages beyond normal usage (photographic evidence provided)</p>
            <p>✅ Refund processed within 7-10 business days after pickup inspection</p>
            <p>✅ Refund credited to original payment method (Razorpay/UPI/Card) or as store credit</p>
          </div>
        </div>

        {/* Rental Amount Refund */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="text-orange-600 mr-2" />
            Rental Amount Refund
          </h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2 text-green-600">Before Delivery</h3>
              <p className="text-gray-600">💰 100% refund of rental amount + full security deposit if cancelled before delivery</p>
              <p className="text-sm text-gray-500 mt-1">No questions asked cancellation within 24 hours of booking</p>
            </div>
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2 text-yellow-600">After Delivery (First 7 Days)</h3>
              <p className="text-gray-600">💰 75% refund of rental amount + full security deposit</p>
              <p className="text-sm text-gray-500 mt-1">Less 25% handling and delivery charges</p>
            </div>
            <div className="border-b pb-3">
              <h3 className="font-semibold text-lg mb-2 text-blue-600">Early Return (After 7 Days)</h3>
              <p className="text-gray-600">💰 Pro-rated refund for remaining months (security deposit fully refundable)</p>
              <p className="text-sm text-gray-500 mt-1">Current month's rent is non-refundable</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-red-600">Late Cancellation</h3>
              <p className="text-gray-600">❌ No refund for current month if cancelled after 7 days</p>
              <p className="text-sm text-gray-500 mt-1">Cancel anytime for next month with 15 days notice</p>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6">How to Request a Return/Refund</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundSteps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-3 transform group-hover:scale-110 transition duration-200">
                  {step.icon}
                </div>
                <h3 className="font-semibold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Initiate Return */}
        <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">How to Initiate a Return?</h2>
          <div className="space-y-3 text-gray-700">
            <p>1️⃣ 📱 Go to <span className="font-semibold">"My Rentals"</span> section in your account</p>
            <p>2️⃣ 🔄 Click on <span className="font-semibold">"Request Return"</span> for the product you want to return</p>
            <p>3️⃣ 📝 Select reason for return (Damaged/Not Needed/Relocating/Upgrading/Other)</p>
            <p>4️⃣ 📸 Upload photos of product condition (helps faster inspection)</p>
            <p>5️⃣ 📅 Choose preferred pickup date and time slot</p>
            <p>6️⃣ ✅ Submit request - Our team will verify and schedule pickup</p>
          </div>
        </div>

        {/* Non-Refundable Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Non-Refundable Items & Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Products with Major Damages</p>
              <p className="text-sm text-red-600 mt-1">Broken parts, structural damage, or water damage</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Missing Original Parts</p>
              <p className="text-sm text-red-600 mt-1">Remote controls, cables, screws, or accessories</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Unhygienic Condition</p>
              <p className="text-sm text-red-600 mt-1">Products returned in severely dirty or stained condition</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="font-semibold text-red-800">❌ Beyond Return Window</p>
              <p className="text-sm text-red-600 mt-1">Return requests submitted after 30 days of rental end date</p>
            </div>
          </div>
        </div>

        {/* Delivery & Pickup Charges */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Delivery & Pickup Charges</h2>
          <div className="space-y-2 text-gray-600">
            <p>🚚 <span className="font-semibold">Delivery Charges:</span> Free delivery on all orders (limited to serviceable pincodes)</p>
            <p>📦 <span className="font-semibold">Pickup Charges:</span> Free pickup for returns within warranty period</p>
            <p>💵 <span className="font-semibold">Cancellation Fee:</span> ₹299 deducted if cancelled after delivery</p>
          </div>
        </div>

        {/* Refund Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Refund Timeline</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span>🕐 COD Payment Refund</span>
              <span className="font-semibold">7-10 business days</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>💳 Razorpay/Card/UPI Refund</span>
              <span className="font-semibold">5-7 business days</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>👛 Wallet/Store Credit</span>
              <span className="font-semibold">2-3 business days</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🔍 Security Deposit (Post Inspection)</span>
              <span className="font-semibold">7-10 business days</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaQuestionCircle className="text-blue-600 mr-2" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I track my refund status?</h3>
              <p className="text-gray-600">Visit <span className="font-semibold">"My Rentals" → "My Returns"</span> section to track your return and refund status in real-time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Will I get my full security deposit back?</h3>
              <p className="text-gray-600">Yes, full deposit is refunded if product is returned in good condition without major damages.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What if I want to cancel my rental mid-month?</h3>
              <p className="text-gray-600">Current month's rent is non-refundable, but future months will be refunded. Security deposit is fully refundable.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How are damage deductions calculated?</h3>
              <p className="text-gray-600">We assess damage based on severity: minor (10-20%), moderate (30-50%), major (60-100% of deposit). You'll receive photographic evidence.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I exchange a product instead of refund?</h3>
              <p className="text-gray-600">Yes, you can request an exchange by contacting support within 7 days of delivery.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">
            For refund-related queries or assistance, contact us at{' '}
            <a href="mailto:support@rentease.com" className="text-blue-600 hover:underline">
              support@rentease.com
            </a>
            {' '}or call{' '}
            <a href="tel:+919999999999" className="text-blue-600 hover:underline">
              +91 99999 99999
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Refund;