import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does RentEase work?',
      answer: 'RentEase allows you to rent furniture and appliances on a monthly basis. Simply browse our catalog, select the products you need, choose your rental tenure (1, 3, 6, or 12 months), and schedule delivery. We\'ll deliver the products to your doorstep and pick them up when you\'re done.'
    },
    {
      question: 'What is the security deposit?',
      answer: 'Security deposit varies by product and typically ranges from 1-3 months of rent. The deposit is fully refundable upon return of the product in good condition, subject to inspection for any damages beyond normal wear and tear.'
    },
    {
      question: 'Can I extend my rental period?',
      answer: 'Yes! You can extend your rental period anytime before the end date. Simply go to "My Rentals", select the rental you want to extend, and choose the extension period. Additional charges will apply for the extended duration.'
    },
    {
      question: 'What if the product gets damaged?',
      answer: 'We understand accidents happen. For minor damages, we may charge a nominal repair fee. For major damages, the cost will be deducted from the security deposit. We recommend handling products with care and reporting any issues immediately through our maintenance request system.'
    },
    {
      question: 'How do I request maintenance?',
      answer: 'You can request maintenance through your account dashboard. Go to "Maintenance Requests" and click "New Request". Provide details about the issue, upload photos if possible, and choose a preferred date for service. Our team will get in touch with you within 24 hours.'
    },
    {
      question: 'What is the cancellation policy?',
      answer: 'You can cancel your rental anytime. For cancellations before delivery, you\'ll receive a full refund. For active rentals, you\'ll be charged only for the period used, and the security deposit will be refunded after product inspection.'
    },
    {
      question: 'Do you offer delivery and pickup?',
      answer: 'Yes, we offer free delivery and pickup for all rentals within our service areas. Delivery slots are available in morning, afternoon, and evening. Our team will coordinate with you for a convenient time.'
    },
    {
      question: 'What cities do you serve?',
      answer: 'Currently, we serve Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Pune. We\'re expanding to more cities soon. Check our website for updates on new locations.'
    },
    {
      question: 'Can I rent multiple products at once?',
      answer: 'Absolutely! You can add multiple products to your cart and rent them together. We\'ll deliver all items in a single shipment when possible. You can manage each rental separately from your dashboard.'
    },
    {
      question: 'How do I return the products?',
      answer: 'At the end of your rental period, we\'ll schedule a pickup. Our team will inspect the products on-site, and if everything is in order, your security deposit will be refunded within 7-10 business days.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container-custom py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600">Find answers to common questions about RentEase</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full bg-white rounded-lg shadow-md p-4 text-left flex justify-between items-center hover:shadow-lg transition"
            >
              <span className="font-semibold text-lg">{faq.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && (
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Still have questions */}
      <div className="bg-primary text-white rounded-2xl p-8 text-center mt-12">
        <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
        <p className="mb-4">Can't find the answer you're looking for? Please contact our support team.</p>
        <a href="/contact" className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQs;