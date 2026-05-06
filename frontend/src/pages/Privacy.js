import React from 'react';

const Privacy = () => {
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-gray-600">
              We collect information you provide directly to us, including your name, email address, 
              phone number, delivery address, and payment information. We also automatically collect 
              information about your use of our platform, such as IP address, browser type, and pages visited.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-gray-600">
              We use your information to process rentals, communicate with you about your orders, 
              provide customer support, improve our services, and send you marketing communications 
              (with your consent). We do not sell your personal information to third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p className="text-gray-600">
              We implement industry-standard security measures to protect your personal information. 
              All payment transactions are encrypted using SSL technology. However, no method of 
              transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Cookies</h2>
            <p className="text-gray-600">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize 
              content. You can control cookie settings through your browser preferences.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-gray-600">
              We may use third-party services for payment processing, analytics, and marketing. 
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, correct, or delete your personal information. You can 
              also opt out of marketing communications at any time. Contact us to exercise these rights.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not intended for children under 18. We do not knowingly collect 
              personal information from children under 18.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this privacy policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us at privacy@rentease.com 
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

export default Privacy;