import Link from 'next/link';
export default function Footer() {
  return (
    <footer>
      <div>
          <h4>Contact Us</h4>
          <p>kuril Bisshaw Road, Dhaka, Bangladesh</p>
          <p>Phone: +880 1234 567890</p>
          <p>Email: info@bariforce.com</p>
        </div>
        
        <div>
          <h4>Follow Us</h4>
          <div>
            <Link href="https://facebook.com/bariforce">
              Facebook
            </Link>
          </div>
        </div>
      <div>
        <p>&copy; {new Date().getFullYear()} Bariforce. All rights reserved.</p>
      </div>
    </footer>
  );
}