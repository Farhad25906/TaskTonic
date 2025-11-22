import logo from "@/assets/logo/logo.png";
import { Link } from "react-router";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto container space-y-8 px-4 py-16 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="TasTonic Logo" className="h-32 w-auto" />
            </Link>

            <p className="mt-4 max-w-xs text-gray-600">
              Your trusted partner for innovative solutions and exceptional
              service. We're dedicated to helping you achieve your goals with
              cutting-edge technology.
            </p>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: "#4871dc" }} />
                <span>contact@tastonic.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: "#4871dc" }} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: "#4871dc" }} />
                <span>123 Business Ave, Suite 100</span>
              </div>
            </div>

            <ul className="mt-8 flex gap-6">
              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-600 transition hover:opacity-80"
                  style={{ color: "#4871dc" }}
                >
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-600 transition hover:opacity-80"
                  style={{ color: "#4871dc" }}
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-600 transition hover:opacity-80"
                  style={{ color: "#4871dc" }}
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            <div>
              <p className="font-semibold text-gray-900">Company</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Our Team
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Services</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Web Development
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Mobile Apps
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Consulting
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Support</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 transition hover:text-[#4871dc]"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-xs text-gray-600 text-center">
            &copy; {currentYear} TasTonic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
