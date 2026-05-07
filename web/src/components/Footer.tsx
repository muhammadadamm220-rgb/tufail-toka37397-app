import Link from "next/link";
import { Users as Facebook, Play as Youtube, Camera as Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="/trademark-logo.png" 
              alt="Seth M. Tufail Trademark" 
              className="h-20 w-auto brightness-110"
            />
            <p className="text-gray-400 text-sm">
              Pakistan's No.1 agricultural machinery manufacturer since 1980. Specialized in high-quality Toka machines, Threshers, and Rotavators.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full hover:bg-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/@sethmtufail" target="_blank" className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-full hover:bg-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-primary pb-2 w-fit pr-8">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-secondary transition-colors">Our Products</Link></li>
              <li><Link href="/dealers" className="hover:text-secondary transition-colors">Find a Dealer</Link></li>
              <li><Link href="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link href="/kisaan-corner" className="hover:text-secondary transition-colors">Kisaan Corner</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-primary pb-2 w-fit pr-8">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/order-tracking" className="hover:text-secondary transition-colors">Track Order</Link></li>
              <li><Link href="/dealer-login" className="hover:text-secondary transition-colors">Dealer Portal</Link></li>
              <li><Link href="/contact" className="hover:text-secondary transition-colors">Contact Us</Link></li>
              <li><Link href="/maintenance" className="hover:text-secondary transition-colors">Maintenance Guide</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-primary pb-2 w-fit pr-8">Contact Us</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex gap-3">
                <MapPin className="text-primary shrink-0" size={18} />
                <span>Samundri Road, Faisalabad, Punjab, Pakistan</span>
              </div>
              <div className="flex gap-3">
                <Phone className="text-primary shrink-0" size={18} />
                <span>(041) 8714167</span>
              </div>
              <div className="flex gap-3">
                <Mail className="text-primary shrink-0" size={18} />
                <span>info@sethmtufail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© 2026 Seth M. Tufail Foundry (Pvt.) Ltd. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
          <p className="flex items-center gap-1">
            Govt Reg No: <span className="text-secondary font-bold">37397</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
