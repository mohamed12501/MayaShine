import { Link } from "wouter";
import { FaInstagram, FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-playfair mb-4">MAYA <span className="text-primary">Jewelry</span></h3>
            <p className="font-montserrat text-sm text-gray-300 mb-4">
              Creating timeless, elegant jewelry pieces that tell your unique story.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/mayajewelry15" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a 
                href="https://www.tiktok.com/@maya.shine06" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition duration-300"
                aria-label="TikTok"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-playfair mb-4">Quick Links</h3>
            <ul className="font-montserrat text-sm space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/#order">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Custom Order</a>
                </Link>
              </li>
              <li>
                <Link href="/#collection">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Collection</a>
                </Link>
              </li>
              <li>
                <Link href="/#about">
                  <a className="text-gray-300 hover:text-primary transition duration-300">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/#contact">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <a className="text-gray-300 hover:text-primary transition duration-300">Admin</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div id="contact">
            <h3 className="text-lg font-playfair mb-4">Contact Us</h3>
            <ul className="font-montserrat text-sm space-y-2 text-gray-300">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary" />
                info@mayajewelry.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-primary" />
                (555) 123-4567
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary" />
                123 Luxury Lane, New York, NY
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="font-montserrat text-xs text-gray-400">
            &copy; {new Date().getFullYear()} MAYA Jewelry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
