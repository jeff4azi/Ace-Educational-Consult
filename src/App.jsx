import { useState, useEffect, useRef } from 'react'
import AceLogo from './assets/Ace-Educational-Consult-Logo.png'

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true)
          }
        })
      },
      { threshold: 0.5 }
    )
    if (statsRef.current) {
      observer.observe(statsRef.current)
    }
    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  const Counter = ({ end, suffix }) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
      if (!statsVisible) return
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }, [statsVisible, end])
    return (
      <span>
        {count.toLocaleString()}
        {suffix}
      </span>
    )
  }

  const services = {
    "Examination Services": [
      { name: "WAEC GCE Registration", price: "₦38,500", description: "Register for WAEC GCE with ease and confidence.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=WAEC%20examination%20registration%20form%20and%20certificate%20in%20Nigeria%20professional%20education&image_size=square_hd" },
      { name: "WAEC Result Checker", price: "₦5,350", description: "Quickly check your WAEC results online.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=WAEC%20result%20checking%20online%20portal%20screen%20education&image_size=square_hd" },
      { name: "WAEC Verification", price: "₦5,500", description: "Verify your WAEC certificate authenticity.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=certificate%20verification%20stamp%20and%20document%20education&image_size=square_hd" },
      { name: "NECO Result Checker", price: "₦2,300", description: "Check your NECO results instantly.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=NECO%20examination%20result%20sheet%20education&image_size=square_hd" },
      { name: "NECO e-Verification Token", price: "₦6,000", description: "Get your NECO e-verification token.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20token%20and%20security%20code%20education&image_size=square_hd" },
      { name: "NECO e-Verification PDF", price: "₦5,800", description: "Download NECO verification PDF.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=PDF%20document%20download%20education&image_size=square_hd" },
      { name: "NABTEB GCE Registration", price: "₦25,000", description: "Register for NABTEB GCE.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=NABTEB%20registration%20form%20education&image_size=square_hd" },
      { name: "NABTEB Result Checker", price: "₦900", description: "Check NABTEB results quickly.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=result%20checker%20interface%20education&image_size=square_hd" },
      { name: "NBAIS Result Checker", price: "₦1,300", description: "Check NBAIS results online.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=examination%20result%20display%20education&image_size=square_hd" }
    ],
    "JAMB Services": [
      { name: "Admission Letter Printing", price: "Contact for Price", description: "Print your JAMB admission letter.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=university%20admission%20letter%20education&image_size=square_hd" },
      { name: "Original Result Printing", price: "Contact for Price", description: "Get your original JAMB result printed.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=JAMB%20result%20slip%20education&image_size=square_hd" },
      { name: "Change of Course Processing", price: "Contact for Price", description: "Process your JAMB change of course.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=course%20change%20form%20education&image_size=square_hd" },
      { name: "Reprinting Services", price: "Contact for Price", description: "JAMB reprinting services available.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=printer%20printing%20document%20education&image_size=square_hd" },
      { name: "O'Level Upload Support", price: "Contact for Price", description: "Upload your O'Level results to JAMB.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=upload%20document%20to%20portal%20education&image_size=square_hd" },
      { name: "CAPS Admission Processing", price: "Contact for Price", description: "JAMB CAPS admission assistance.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=university%20admission%20portal%20education&image_size=square_hd" }
    ],
    "Identity & Verification": [
      { name: "NIN Services", price: "Contact for Price", description: "National Identity Number services.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Nigerian%20NIN%20identity%20card%20verification&image_size=square_hd" },
      { name: "Lost NIN Retrieval", price: "₦500", description: "Retrieve your lost NIN quickly.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=lost%20id%20card%20retrieval%20service&image_size=square_hd" },
      { name: "BVN Services", price: "Contact for Price", description: "Bank Verification Number services.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bank%20verification%20number%20BVN%20card&image_size=square_hd" }
    ],
    "Digital & Utility Services": [
      { name: "Airtime Recharge", price: "Contact for Price", description: "Recharge your mobile airtime.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mobile%20phone%20airtime%20recharge&image_size=square_hd" },
      { name: "Data Subscription", price: "Contact for Price", description: "Subscribe to mobile data plans.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mobile%20data%20subscription%20smartphone&image_size=square_hd" },
      { name: "Electricity Bill Payment", price: "Contact for Price", description: "Pay your electricity bills online.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=electricity%20bill%20payment%20meter&image_size=square_hd" },
      { name: "TV Subscription", price: "Contact for Price", description: "Renew your TV subscription.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=television%20subscription%20remote%20control&image_size=square_hd" },
      { name: "PIN Vending", price: "Contact for Price", description: "Purchase various PINs.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20pin%20code%20security&image_size=square_hd" },
      { name: "Digital Coupons", price: "Contact for Price", description: "Get digital coupons and vouchers.", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20coupon%20voucher%20discount&image_size=square_hd" }
    ]
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <img src={AceLogo} alt="Ace Educational Consult Logo" className="h-16 object-contain" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-[#4169E1] font-medium transition-colors">Home</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-[#4169E1] font-medium transition-colors">Services</button>
              <button onClick={() => scrollToSection('why-us')} className="text-gray-700 hover:text-[#4169E1] font-medium transition-colors">Why Us</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-[#4169E1] font-medium transition-colors">Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-[#4169E1] font-medium transition-colors">Contact</button>
              <button onClick={() => scrollToSection('contact')} className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-6 py-2.5 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105">Get Started</button>
            </div>
            <button className="md:hidden text-gray-700 text-2xl">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-gray-900 leading-tight mb-6">
                Your Trusted Partner for <span className="text-[#4169E1]">Educational & Digital Services</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Fast, secure, and reliable assistance for examination registrations, result verification, admissions, identity services, utility payments, and more.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollToSection('services')} className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:scale-105">
                  Get Started
                </button>
                <button onClick={() => scrollToSection('contact')} className="border-2 border-[#4169E1] text-[#4169E1] hover:bg-[#4169E1] hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="floating">
              <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=students%20graduation%20certificates%20books%20university%20admissions%20happy%20education%20Nigeria&image_size=landscape_16_9" alt="Education" className="rounded-3xl shadow-2xl w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section ref={statsRef} id="stats" className="py-16 bg-[#4169E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2"><Counter end={10000} suffix="+" /></div>
              <div className="text-white text-lg font-medium">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2"><Counter end={98} suffix="%" /></div>
              <div className="text-white text-lg font-medium">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2"><Counter end={50} suffix="+" /></div>
              <div className="text-white text-lg font-medium">Available Services</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#FFC107] mb-2">24/7</div>
              <div className="text-white text-lg font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">We provide exceptional services with professionalism and care</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'fa-bolt', title: 'Fast Processing', desc: 'Quick turnaround for all educational and digital services.' },
              { icon: 'fa-lock', title: 'Secure Transactions', desc: 'Your information is handled with privacy and security.' },
              { icon: 'fa-headset', title: 'Trusted Support', desc: 'Professional customer support whenever you need assistance.' },
              { icon: 'fa-tags', title: 'Affordable Pricing', desc: 'Competitive pricing with transparent service charges.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4169E1] to-[#3658c9] rounded-2xl flex items-center justify-center mb-6">
                  <i className={`fas ${feature.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore our comprehensive range of educational and digital services</p>
          </div>
          {Object.entries(services).map(([category, items], catIdx) => (
            <div key={catIdx} className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#4169E1] pl-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                    <div className="h-48 overflow-hidden">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h4>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{service.description}</p>
                      <div className="text-2xl font-bold text-[#4169E1] mb-4">{service.price}</div>
                      <button onClick={() => scrollToSection('contact')} className="w-full bg-[#4169E1] hover:bg-[#3658c9] text-white py-3 rounded-xl font-semibold transition-all hover:scale-105">
                        Proceed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Three simple steps to get your service</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Choose the service you need.', icon: 'fa-list-check' },
              { step: 2, title: 'Submit your request or contact us.', icon: 'fa-paper-plane' },
              { step: 3, title: 'Receive your completed service quickly and securely.', icon: 'fa-check-circle' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-[#4169E1] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <i className={`fas ${item.icon} text-[#FFC107] text-4xl`}></i>
                {idx < 2 && <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-900 mb-4">Testimonials</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">What our clients say about us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stars: 5, text: 'Very reliable and fast service. I received my result verification the same day.' },
              { stars: 5, text: 'Excellent customer support and affordable pricing.' },
              { stars: 5, text: 'Highly recommended for JAMB and WAEC services.' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-[#FFC107] text-2xl mb-4">
                  {Array(testimonial.stars).fill(0).map((_, i) => <i key={i} className="fas fa-star"></i>)}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4169E1] rounded-full flex items-center justify-center text-white font-bold">U</div>
                  <div className="text-gray-500 font-medium">Happy Client</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-[#4169E1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">Contact Ace Educational Consult today for fast and reliable educational solutions.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => scrollToSection('contact')} className="bg-white hover:bg-gray-100 text-[#4169E1] px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:scale-105">
              Contact Us
            </button>
            <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1ebe57] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:scale-105 flex items-center gap-2">
              <i className="fab fa-whatsapp text-xl"></i>
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">Subscribe to receive updates about admission opportunities, registration deadlines, educational news, and special offers.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20" />
            <button className="bg-[#4169E1] hover:bg-[#3658c9] text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Get in touch with us today</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Office Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center text-white text-xl shrink-0">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone Number</h4>
                    <p className="text-gray-600">+234 800 000 0000</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center text-white text-xl shrink-0">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email Address</h4>
                    <p className="text-gray-600">contact@aceeducational.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center text-white text-xl shrink-0">
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Office Address</h4>
                    <p className="text-gray-600">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#4169E1] rounded-xl flex items-center justify-center text-white text-xl shrink-0">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Saturday: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4169E1] focus:ring-2 focus:ring-[#4169E1]/20" />
                </div>
                <button type="submit" className="w-full bg-[#4169E1] hover:bg-[#3658c9] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src={AceLogo} alt="Ace Educational Consult Logo" className="h-16 object-contain" />
              </div>
              <p className="text-gray-400 mb-6">Your trusted partner for educational and digital services in Nigeria.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#4169E1] rounded-full flex items-center justify-center transition-colors"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#4169E1] rounded-full flex items-center justify-center transition-colors"><i className="fab fa-twitter"></i></a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#4169E1] rounded-full flex items-center justify-center transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-[#4169E1] rounded-full flex items-center justify-center transition-colors"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => scrollToSection('why-us')} className="text-gray-400 hover:text-white transition-colors">Why Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Contact Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li>+234 800 000 0000</li>
                <li>contact@aceeducational.com</li>
                <li>Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Ace Educational Consult. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/2348000000000" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group">
        <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white text-3xl shadow-2xl pulse-whatsapp hover:scale-110 transition-transform">
          <i className="fab fa-whatsapp"></i>
        </div>
        <div className="absolute bottom-full right-0 mb-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need Help? Chat with us!
        </div>
      </a>
    </div>
  )
}

export default App
