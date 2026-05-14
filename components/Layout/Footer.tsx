import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h3>Bariforce</h3>
          <p>Your trusted platform for home services. Connect with verified professionals.</p>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <p>+880 1234 567890</p>
          <p>support@bariforce.com</p>
          <p>Dhaka, Bangladesh</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bariforce. All rights reserved.</p>
      </div>
    </footer>
  );
}