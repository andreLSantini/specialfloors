import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, Check, X, Menu, Phone, Mail, MapPin, Send, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServiceLandingPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Estados para serviços
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', image: '' });
  const [showAddService, setShowAddService] = useState(false);
  
  // Estados para reviews
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '', service: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Estados para contatos
  const [contacts, setContacts] = useState([]);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [showContactSuccess, setShowContactSuccess] = useState(false);

  // Carousel images - Special Floors
  const carouselImages = [
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565183928294-7d22f2d8655f?w=1600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&h=600&fit=crop&q=80'
  ];

  // Carregar dados do storage
  useEffect(() => {
    loadData();
  }, []);

  // Carousel auto-play
  useEffect(() => {
    if (carouselImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const loadData = async () => {
    try {
      const servicesData = await window.storage.get('services');
      const reviewsData = await window.storage.get('reviews');
      const contactsData = await window.storage.get('contacts');
      
      if (servicesData) setServices(JSON.parse(servicesData.value));
      if (reviewsData) setReviews(JSON.parse(reviewsData.value));
      if (contactsData) setContacts(JSON.parse(contactsData.value));
    } catch (error) {
      console.log('Starting with empty data');
    }
  };

  // Funções de Admin
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // Funções de Serviços
  const handleAddService = async () => {
    if (!newService.title || !newService.description) {
      alert('Fill in title and description!');
      return;
    }

    const service = {
      id: Date.now(),
      ...newService,
      date: new Date().toLocaleDateString('en-US')
    };

    const updatedServices = [...services, service];
    setServices(updatedServices);
    await window.storage.set('services', JSON.stringify(updatedServices));
    
    setNewService({ title: '', description: '', image: '' });
    setShowAddService(false);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Do you really want to delete this service?')) return;
    
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);
    await window.storage.set('services', JSON.stringify(updatedServices));
  };

  // Funções de Reviews
  const handleAddReview = async () => {
    if (!newReview.name || !newReview.comment) {
      alert('Fill in name and comment!');
      return;
    }

    const review = {
      id: Date.now(),
      ...newReview,
      approved: false,
      date: new Date().toLocaleDateString('en-US')
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    await window.storage.set('reviews', JSON.stringify(updatedReviews));
    
    setNewReview({ name: '', rating: 5, comment: '', service: '' });
    setShowReviewForm(false);
    alert('Review submitted! Waiting for approval.');
  };

  const handleApproveReview = async (id) => {
    const updatedReviews = reviews.map(r => 
      r.id === id ? { ...r, approved: true } : r
    );
    setReviews(updatedReviews);
    await window.storage.set('reviews', JSON.stringify(updatedReviews));
  };

  const handleDeleteReview = async (id) => {
    const updatedReviews = reviews.filter(r => r.id !== id);
    setReviews(updatedReviews);
    await window.storage.set('reviews', JSON.stringify(updatedReviews));
  };

  // Funções de Contato
  const handleSubmitContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Fill in all required fields!');
      return;
    }

    const contact = {
      id: Date.now(),
      ...contactForm,
      date: new Date().toLocaleString('en-US'),
      read: false
    };

    const updatedContacts = [...contacts, contact];
    setContacts(updatedContacts);
    await window.storage.set('contacts', JSON.stringify(updatedContacts));
    
    setContactForm({ name: '', email: '', phone: '', message: '' });
    setShowContactSuccess(true);
    setTimeout(() => setShowContactSuccess(false), 3000);
  };

  const handleMarkAsRead = async (id) => {
    const updatedContacts = contacts.map(c => 
      c.id === id ? { ...c, read: true } : c
    );
    setContacts(updatedContacts);
    await window.storage.set('contacts', JSON.stringify(updatedContacts));
  };

  const approvedReviews = reviews.filter(r => r.approved);
  const pendingReviews = reviews.filter(r => !r.approved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img 
                src="logo.png" 
                alt="Special Build & Renovate Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <h1 
                className="text-2xl sm:text-3xl font-bold text-indigo-600 cursor-pointer select-none"
                onClick={(e) => {
                  if (e.detail === 3 && !isAdmin) {
                    setShowAdminLogin(true);
                  }
                }}
                title="Triple-click for admin"
              >
                Special Build & Renovate
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-indigo-600 transition">Home</a>
              <a href="#services" className="text-gray-700 hover:text-indigo-600 transition">Services</a>
              <a href="#cases" className="text-gray-700 hover:text-indigo-600 transition">Cases</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              {isAdmin && (
                <button
                  onClick={handleAdminLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              )}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-700"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <nav className="md:hidden mt-4 pb-4 space-y-2">
              <a href="#home" className="block text-gray-700 hover:text-indigo-600 transition">Home</a>
              <a href="#services" className="block text-gray-700 hover:text-indigo-600 transition">Services</a>
              <a href="#cases" className="block text-gray-700 hover:text-indigo-600 transition">Cases</a>
              <a href="#contact" className="block text-gray-700 hover:text-indigo-600 transition">Contact</a>
              {!isAdmin && (
                <button
                  onClick={() => {
                    setShowAdminLogin(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left text-gray-500 hover:text-indigo-600 transition text-sm"
                >
                  Admin
                </button>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAdminLogin}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPassword('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">Default password: admin123</p>
          </div>
        </div>
      )}

      {/* Hero Section with Carousel */}
      <section id="home" className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        {/* Carousel */}
        <div className="relative h-96 md:h-[500px] overflow-hidden bg-gray-900">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: index === currentSlide ? 1 : 0
              }}
            >
              <img
                src={image}
                alt={`Floor Design ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-blue-900/70"></div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition z-10"
            style={{ zIndex: 10 }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full transition z-10"
            style={{ zIndex: 10 }}
          >
            <ChevronRight size={32} />
          </button>

          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10" style={{ zIndex: 10 }}>
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Hero Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ zIndex: 5 }}>
            <div className="text-center px-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Excellence in Construction & Renovation
              </h2>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
                Transforming your projects into reality with quality and professionalism
              </p>
              <a
                href="#contact"
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800">Our Services</h3>
            {isAdmin && (
              <button
                onClick={() => setShowAddService(true)}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={20} className="mr-2" />
                Add Service
              </button>
            )}
          </div>

          {/* Add Service Form */}
          {showAddService && isAdmin && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h4 className="text-xl font-bold mb-4">New Service</h4>
              <input
                type="text"
                placeholder="Service title"
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
              />
              <textarea
                placeholder="Service description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 h-24"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newService.image}
                onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddService}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddService(false);
                    setNewService({ title: '', description: '', image: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">
                No services registered yet.
              </p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  {service.image && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h4>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-sm text-gray-400">Posted on: {service.date}</p>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="mt-4 flex items-center text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Cases Section (Reviews) */}
      <section id="cases" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800">Customer Reviews & Cases</h3>
            {!isAdmin && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus size={20} className="mr-2" />
                Leave a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && !isAdmin && (
            <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-8">
              <h4 className="text-xl font-bold mb-4">Leave Your Review</h4>
              <input
                type="text"
                placeholder="Your name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
              />
              <select
                value={newReview.service}
                onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
              >
                <option value="">Select service (optional)</option>
                {services.map(s => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
              </select>
              <div className="mb-3">
                <label className="block text-gray-700 mb-2">Rating:</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Your comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-24"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddReview}
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ name: '', rating: 5, comment: '', service: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Admin Panel - Pending Reviews */}
          {isAdmin && pendingReviews.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-4 text-orange-600">Pending Reviews for Approval</h4>
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-bold">{review.name}</h5>
                        {review.service && <p className="text-sm text-gray-600">Service: {review.service}</p>}
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-400 mb-3">{review.date}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveReview(review.id)}
                        className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                      >
                        <Check size={16} className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReviews.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">
                No approved reviews yet.
              </p>
            ) : (
              approvedReviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-6 shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-bold text-gray-800">{review.name}</h5>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  {review.service && (
                    <p className="text-sm text-indigo-600 mb-2">Service: {review.service}</p>
                  )}
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  <p className="text-sm text-gray-400">{review.date}</p>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="mt-3 flex items-center text-red-500 hover:text-red-700 transition text-sm"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get in Touch</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            {!isAdmin && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h4 className="text-xl font-bold mb-4">Send Your Message</h4>
                <input
                  type="text"
                  placeholder="Your name *"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
                />
                <textarea
                  placeholder="Your message *"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-32"
                />
                <button
                  onClick={handleSubmitContact}
                  className="w-full flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Send size={20} className="mr-2" />
                  Send Message
                </button>
                {showContactSuccess && (
                  <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Message sent successfully!
                  </div>
                )}
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold mb-6">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="text-indigo-600 mr-3 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">(11) 9999-9999</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="text-indigo-600 mr-3 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">contato@specialbuild.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-indigo-600 mr-3 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-600">São Paulo, SP - Brazil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Panel - Messages */}
          {isAdmin && (
            <div className="mt-8">
              <h4 className="text-xl font-bold mb-4">Received Messages ({contacts.length})</h4>
              {contacts.length === 0 ? (
                <p className="text-center text-gray-500 py-8 bg-white rounded-lg">
                  No messages received yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {contacts.slice().reverse().map((contact) => (
                    <div
                      key={contact.id}
                      className={`rounded-lg p-4 ${contact.read ? 'bg-gray-100' : 'bg-blue-50 border-l-4 border-blue-500'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-bold">{contact.name}</h5>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                        </div>
                        {!contact.read && (
                          <button
                            onClick={() => handleMarkAsRead(contact.id)}
                            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                          >
                            <Check size={16} className="mr-1" />
                            Mark as read
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{contact.message}</p>
                      <p className="text-sm text-gray-400">{contact.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">Special Build & Renovate</p>
          <p className="text-gray-400">© 2026 All rights reserved</p>
          {!isAdmin && (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-gray-700 hover:text-gray-500 text-xs mt-2 opacity-20 hover:opacity-40 transition"
            >
              •
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
