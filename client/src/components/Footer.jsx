import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'Marketplace', to: '/marketplace' },
    { label: 'Latest Feed', to: '/feed' },
    { label: 'My Cart', to: '/cart' },
    { label: 'My Account', to: '/dashboard' },
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Contact Us', href: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-main">
        <div className="grid grid-cols-1 gap-12 py-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">SocialMart</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Your one-stop destination for social commerce. Connect, share, and shop in a vibrant community.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Shop</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 shrink-0 text-muted-foreground/80" />
                <span>123 Commerce St, Tech City, TC 90210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0 text-muted-foreground/80" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground/80" />
                <span>support@socialmart.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SocialMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
