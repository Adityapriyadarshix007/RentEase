import React, { useState, useEffect } from 'react';
import { FaBullseye, FaHeart, FaLeaf, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';

const About = () => {
  const [aboutImages, setAboutImages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      // Fix: Don't add /api again since it's already in the service
      const response = await axios.get(`${API_URL}/api/upload/images/about`);
      setAboutImages(response.data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
      // Don't show error to user, just log it
    }
  };

  const values = [
    {
      icon: <FaBullseye className="text-4xl text-primary" />,
      title: 'Our Mission',
      description: 'To make furniture and appliance rental accessible, affordable, and hassle-free for everyone.'
    },
    {
      icon: <FaHeart className="text-4xl text-primary" />,
      title: 'Our Vision',
      description: 'Create a sustainable ecosystem where people can live comfortably without the burden of ownership.'
    },
    {
      icon: <FaLeaf className="text-4xl text-primary" />,
      title: 'Sustainability',
      description: 'Promote circular economy by reducing waste through product reuse and recycling.'
    }
  ];

  return (
    <div className="container-custom py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About RentEase</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Revolutionizing the way people rent furniture and appliances
        </p>
      </div>
      
      {/* Creator Section - YOUR DETAILS */}
      <div className="mb-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-4">Created By</h2>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-primary">Aditya Priyadarshi</h3>
                <p className="text-gray-600 mt-2">Full Stack Developer | Creator of RentEase</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-700">
                  <FaEnvelope className="text-primary mr-3" />
                  <span>aditya.priyadarshi@rentease.com</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaPhone className="text-primary mr-3" />
                  <span>+91 1234567890</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="text-primary mr-3" />
                  <span>India</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/adityapriyadarshi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition transform hover:scale-105"
                >
                  <FaGithub size={24} />
                </a>
                <a 
                  href="https://linkedin.com/in/adityapriyadarshi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-600 transition transform hover:scale-105"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 lg:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <FaUser className="text-white text-7xl" />
                </div>
                <p className="text-gray-700 text-lg italic">
                  "Creating innovative solutions for a better tomorrow"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Story Section */}
      <div className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              RentEase was founded by <strong className="text-primary">Aditya Priyadarshi</strong> with a simple idea: 
              why buy when you can rent? We noticed that students and working professionals frequently relocate 
              for education or jobs but struggle with the high cost of purchasing furniture and appliances.
            </p>
            <p className="text-gray-600 mb-4">
              Traditional ownership comes with challenges - high upfront costs, difficulty in transportation, 
              maintenance hassles, and lack of flexibility. We created RentEase to solve these problems and 
              provide a flexible, affordable solution for urban living.
            </p>
            <p className="text-gray-600">
              Today, we're proud to serve thousands of happy customers across multiple cities, helping them 
              live comfortably while reducing their environmental footprint.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🏠</div>
              <p className="text-gray-500">Furniture Rental Platform</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition transform hover:scale-105">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">1</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Products</h3>
            <p className="text-gray-600">Browse and select from our wide range of furniture and appliances</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition transform hover:scale-105">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">2</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Schedule Delivery</h3>
            <p className="text-gray-600">Choose delivery date and time that works for you</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition transform hover:scale-105">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">3</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enjoy Renting</h3>
            <p className="text-gray-600">Use quality products during your rental period</p>
          </div>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition transform hover:scale-105">
              <div className="flex justify-center mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-primary text-white rounded-2xl p-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold">5000+</div>
            <div className="text-lg mt-2">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold">1000+</div>
            <div className="text-lg mt-2">Products Delivered</div>
          </div>
          <div>
            <div className="text-4xl font-bold">98%</div>
            <div className="text-lg mt-2">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold">24/7</div>
            <div className="text-lg mt-2">Customer Support</div>
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Have a Question?</h2>
        <p className="mb-4">I'd love to hear from you. Get in touch for any queries or feedback.</p>
        <a 
          href="mailto:aditya@rentease.com" 
          className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
        >
          Contact Me
        </a>
      </div>
    </div>
  );
};

export default About;
