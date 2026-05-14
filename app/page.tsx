import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout/Layout";

const services = [

  { title: "Electrician", 
    description: "Professional electrical services for your home",
     image: "/currentp.webp"
  },
  { title: "Plumber", 
    description: "Expert plumbing and pipe fitting services", 
    image: "/plumP.jpg" 
  },
  { title: "Cook", 
    description: "Experienced cooks for your kitchen",
     image: "/cookp.webp" 
  },
  { title: "Maid", 
    description: "Trusted home cleaning and maid services", 
    image: "/maid3.jpg" 
  },
  { title: "Driver",
    description: "Professional drivers for your daily commute", 
    image: "/driver1.jpg"
 },
  { title: "Security Guard", 
    description: "Trained security personnel for your safety", 
    image: "/guard1.jpg" 
  },
];

const features = [
  { title: "Trusted Professionals", description: "All service providers are verified and background-checked" },
  { title: "Best Price Guarantee", description: "Get competitive pricing with no hidden charges" },
  { title: "24/7 Support", description: "Our support team is always here to help you" },
  { title: "Easy Booking", description: "Book any service in just a few clicks" },
];

export default function HomePage() {
  return (
    <Layout activePage="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Your Trusted <span>Home Service</span> Platform</h1>
            <p>Connect with verified professionals for all your home service needs. From electricians to cooks, find the right expert for every job.</p>
            <div className="hero-buttons">
        
              <Link href="/login" className="btn-primary">
                Book a Service
              </Link>
              {/* "Become a Worker" → Registration page */}
              <Link href="/Register/member2" className="btn-outline">
                Become a Worker
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/home.gif"
              alt="Bariforce Hero"
              width={150}
              height={100}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Our Services</p>
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">Choose from a wide range of professional home services</p>
          </div>
          <div className="cards-grid">
            {services.map((service) => (
              <div key={service.title} className="card">
                <div className="card-icon">
                  <Image src={service.image} alt={service.title} width={550} height={550} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href="/Register/member2" className="card-link">
                  Join as Worker →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ backgroundColor: "#f1f5f9" }}>
        <div className="container">
          <div className="section-header">
            <p className="section-tag">Why Choose Us</p>
            <h2 className="section-title">Why Bariforce?</h2>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}