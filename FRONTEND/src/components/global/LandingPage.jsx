"use client"

import { useState } from "react"
import {
  Star,
  Search,
  Clock,
  Truck,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react"
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const featuredRestaurants = [
    {
      id: 1,
      name: "Hotel Balaji Sarovar Premiere",
      cuisine: "Indian",
      rating: 4.8,
      deliveryTime: "25-30 min",
      image: "/BalajiSarovar.jpg?height=200&width=300",
      discount: "20% OFF",
    },
    {
      id: 2,
      name: "Taj Hotels",
      cuisine: "India",
      rating: 4.6,
      deliveryTime: "30-35 min",
      image: "/Tajhotel.jpg?height=200&width=300",
      discount: "15% OFF",
    },
    {
      id: 3,
      name: "Hotel Bhagyashree",
      cuisine: "India",
      rating: 4.9,
      deliveryTime: "20-25 min",
      image: "/HotelBhagyashree.jpg?height=200&width=300",
      discount: "25% OFF",
    },
  ]

  const popularDishes = [
    {
      id: 1,
      name: "Butter Chicken",
      price: "₹399",
      image: "/ButterChicken.jpg?height=150&width=200",
      rating: 4.7,
    },
    {
      id: 2,
      name: "Masala Dosa",
      price: "₹133",
      image: "/MasalaDosa.jpg?height=150&width=200",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Paneer tikka",
      price: "₹149",
      image: "/Paneertikka.jpg?height=150&width=200",
      rating: 4.8,
    },
    {
      id: 4,
      name: "Vada Pav",
      price: "₹49",
      image: "/VadaPav.jpg?height=150&width=200",
      rating: 4.6,
    },
  ]

  const testimonials = [
    {
      id: 1,
      name: "Parmeshwar Talwar",
      rating: 5,
      comment: "Amazing food quality and super fast delivery! The app is so easy to use.",
      avatar: "/pamu.jpg?height=60&width=60",
    },
    {
      id: 2,
      name: "Darshan Gurav",
      rating: 5,
      comment: "Best food delivery service in town. Fresh ingredients and great variety!",
      avatar: "/sunderpichai.jpeg?height=60&width=60",
    },
    {
      id: 3,
      name: "Rohit Salunkhe",
      rating: 4,
      comment: "Love the user interface and the quick delivery. Highly recommended!",
      avatar: "/satyanadela.jpeg?height=60&width=60",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      {/* Header */}
      <header className="bg-white/80 shadow-md sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <h1 className="text-3xl font-extrabold text-orange-600 tracking-tight">FoodieExpress</h1>
             {/* Navigation Menu  */}
                  <nav className="hidden md:flex gap-8 text-base font-medium">
                    <a href="#home" className="hover:text-orange-600 transition-colors">Home</a>
                    <a href="#menu" className="hover:text-orange-600 transition-colors">Menu</a>
                    <a href="#offers" className="hover:text-orange-600 transition-colors">Offers</a>
                    <a href="#about" className="hover:text-orange-600 transition-colors">About Us</a>
                    <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
                  </nav>
                  <button
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg shadow font-semibold transition-colors"
                    onClick={() => window.location.href = "/login"}
                  >
                    Login / Signup
                  </button>
                  </div>
                </div>
                <div className="flex justify-end ">
  <Link
    to="/delivery/login"
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Delivery Partner
  </Link>
</div>

                </header>

                {/* Hero Section */}
      <section id="home" className="relative flex items-center justify-center min-h-[70vh] py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/80 to-red-100/60 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Delicious Food
              <span className="text-orange-600"> Delivered Fast</span>
            </h1>
            <p className="text-2xl text-gray-700 mb-10 max-w-xl">
              Order your favorite meals from top restaurants and get them delivered to your doorstep in minutes.
            </p>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Search restaurant or dish..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg shadow"
                />
              </div>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow transition-colors">
                Search
              </button>
            </div>
            <div className="flex gap-4">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow transition-colors">
                Order Now
              </button>
              <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 rounded-lg font-bold text-lg shadow transition-colors">
                View Menu
              </button>
            </div>
          </div>
          <div className="relative flex justify-center items-center">
            <img
              src="/herosection.jpg"
              alt="Delicious food"
              className="w-full max-w-lg h-auto rounded-2xl shadow-2xl border-4 border-orange-100"
            />
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
            <p className="text-xl text-gray-600">Discover top-rated restaurants serving authentic cuisines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {restaurant.discount}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-4">{restaurant.cuisine} Cuisine</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-700 font-medium">{restaurant.rating}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Dishes</h2>
            <p className="text-xl text-gray-600">Most loved dishes by our customers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img src={dish.image || "/placeholder.svg"} alt={dish.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{dish.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">{dish.price}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-700 text-sm">{dish.rating}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to get your favorite food delivered</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Choose</h3>
              <p className="text-gray-600">
                Browse through our wide selection of restaurants and dishes. Find exactly what you're craving.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Order</h3>
              <p className="text-gray-600">
                Place your order with just a few clicks. Customize your meal and choose your preferred payment method.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Enjoy</h3>
              <p className="text-gray-600">
                Sit back and relax while we prepare and deliver your delicious meal right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real reviews from satisfied customers</p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <img
                src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-4 italic">"{testimonials[currentTestimonial].comment}"</p>
              <h4 className="text-xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-orange-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">FoodieExpress</h3>
              <p className="text-gray-300 mb-6">
                Your favorite food delivery app bringing delicious meals from top restaurants directly to your doorstep.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-300 hover:text-orange-600 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-600 transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📧 support@foodieexpress.com</li>
                <li>📞 +91 7249594024</li>
                <li>📍 123 Food Street, Solapur, Maharastra 413219</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-300">© 2024 FoodieExpress. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
