import Link from 'next/link';
import Image from "next/image";

const services = [
  {
    title: "Electrician",
    description: "Professional electrical services for your home",
    image: "/current.jpg",
  },
  {
    title: "Plumber",
    description: "Expert plumbing and pipe fitting services",
    image: "/plumber.png",
  },
  {
    title: "Cook",
    description: "Experienced cooks for your kitchen",
    image: "/cook.jpg",
  },
  {
    title: "Maid",
    description: "Trusted home cleaning and maid services",
    image: "/maid.jpg",
  },
  {
    title: "Driver",
    description: "Professional drivers for your daily commute",
    image: "/driver.png",
  },
  {
    title: "Security Guard",
    description: "Trained security personnel for your safety",
    image: "/guard.jpg",
  },
];

export default function Home() {
  return (
    <>
      <h1>Welcome to Bariforce</h1>
      <p>Your trusted platform for home services</p>
      
      <section>
        <div>
          <div>
            <h2>What We Offer</h2>
            <p>Choose from a wide range of professional home services</p>
          </div>

          <div>
            {services.map((service) => (
              <div key={service.title}>
                <div>
                  <Image src={service.image} alt={service.title} width={55} height={55} />
                </div>
                <h3>{service.title}</h3>
                <p>
                  {service.description} <br />
                  <Link href="/register/member1">Book Now</Link>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <div>
        <h2>For Workers</h2>
        <p>Find jobs and grow your career</p>
        <Link href="/register">Register as Worker</Link>
      </div>
      
      <div>
        <h2>Already have an account?</h2>
        <Link href="/login">Login Here</Link>
      </div>
    </>
  );
}