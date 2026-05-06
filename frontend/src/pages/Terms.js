import React from 'react';

const Terms = () => {
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using RentEase, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Rental Agreement</h2>
            <p className="text-gray-600">
              When you rent a product through RentEase, you enter into a rental agreement with us. 
              You agree to pay the rental fees and security deposit as specified, and to return 
              the product in good condition at the end of the rental period.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
            <p className="text-gray-600">
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to provide accurate and complete information when creating your account 
              and for all transactions. You are responsible for all activities that occur under your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Payments and Fees</h2>
            <p className="text-gray-600">
              All payments must be made in advance according to the selected payment schedule. 
              Late payments may result in additional fees or termination of the rental agreement. 
              Security deposits are refundable subject to product inspection.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Delivery and Pickup</h2>
            <p className="text-gray-600">
              We will deliver the rented products to the address you provide. You must ensure 
              someone is available to receive the delivery. At the end of the rental period, 
              we will schedule a pickup. You are responsible for ensuring the products are 
              available for pickup.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Product Condition</h2>
            <p className="text-gray-600">
              You agree to use the rented products with reasonable care and maintain them in 
              good condition. Normal wear and tear is acceptable, but you will be charged for 
              any damages beyond normal use. Report any issues immediately through our maintenance system.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Cancellation and Refunds</h2>
            <p className="text-gray-600">
              Cancellation policies vary by product and rental period. Generally, cancellations 
              made before delivery receive a full refund. For active rentals, refunds are 
              prorated based on usage. Security deposits are refunded after product return and inspection.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600">
              RentEase shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising from your use of our services. Our total liability 
              shall not exceed the amount paid by you for the specific rental giving rise to the claim.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Modifications to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of our services constitutes acceptance 
              of the modified terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms of Service, please contact us at legal@rentease.com 
              or call +91 1234567890.
            </p>
          </section>
          
          <div className="text-sm text-gray-500 pt-4 border-t">
            Last updated: January 1, 2024
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;