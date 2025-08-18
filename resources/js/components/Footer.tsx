import { Link } from '@inertiajs/react';
import { IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, IconBrandLinkedin, IconMail, IconPhone, IconMapPin, IconBook, IconFileText, IconCloudUpload } from '@tabler/icons-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { name: 'Academic Books', href: '/services/academic-books' },
            { name: 'Scientific Journals', href: '/services/journals' },
            { name: 'Digital Library', href: '/services/digital-library' },
            { name: 'Publishing Packages', href: '/packages' },
        ],
        publishing: [
            { name: 'Monograph', href: '/publishing/monograph' },
            { name: 'Reference Books', href: '/publishing/reference' },
            { name: 'Textbooks', href: '/publishing/textbooks' },
            { name: 'Collaborative Writing', href: '/publishing/collaborative' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Publishing Guide', href: '/guide' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Author Support', href: '/author-support' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Our Values', href: '/about#values' },
            { name: 'Partnership', href: '/partnership' },
            { name: 'Contact', href: '/contact' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Copyright Policy', href: '/copyright' },
           
        ],
    };

    const socialLinks = [
        { name: 'Facebook', icon: IconBrandFacebook, href: '#facebook' },
        { name: 'Twitter', icon: IconBrandTwitter, href: '#twitter' },
        { name: 'Instagram', icon: IconBrandInstagram, href: '#instagram' },
        { name: 'LinkedIn', icon: IconBrandLinkedin, href: '#linkedin' },
    ];

    const services = [
        { 
            icon: IconBook, 
            title: 'Academic Books', 
            description: 'Penerbitan buku akademik dengan standar internasional' 
        },
        { 
            icon: IconFileText, 
            title: 'IJHTM Journal', 
            description: 'Indonesia Journal of Hygiene and Infectious Disease' 
        },
        { 
            icon: IconCloudUpload, 
            title: 'Digital Library', 
            description: 'Platform perpustakaan digital yang canggih' 
        },
    ];

    return (
        <footer className="bg-gradient-to-br from-[#3674B5] to-[#578FCA] text-white">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img 
                                src="/assets/images/logo.png" 
                                alt="Ganesha Science Institute Logo" 
                                className="h-16 w-16"
                            />
                            <div>
                                <span className="text-xl font-bold block">Ganesha Science Institute</span>
                                <span className="text-sm text-blue-200">PT. Ganesha Sains Nusantara</span>
                            </div>
                        </div>
                        <p className="text-blue-100 mb-6 max-w-md leading-relaxed">
                            Platform digital terdepan untuk penerbitan buku ilmiah, jurnal akademik, 
                            dan perpustakaan digital dengan standar internasional.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-blue-100">
                                <IconMail className="h-5 w-5 text-blue-300" />
                                <span>ganeshascience@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-blue-100">
                                <IconMapPin className="h-5 w-5 text-blue-300" />
                                <span>ganeshainstitute.org</span>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <p className="text-xs text-blue-200">
                                <strong>AHU:</strong> AHU-033821.AH.01.30.Tahun 2025
                            </p>
                        </div>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-yellow-300">Services</h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-blue-100 hover:text-yellow-300 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Publishing Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-yellow-300">Publishing</h3>
                        <ul className="space-y-3">
                            {footerLinks.publishing.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-blue-100 hover:text-yellow-300 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-yellow-300">Support</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-blue-100 hover:text-yellow-300 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-yellow-300">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link 
                                        href={link.href}
                                        className="text-blue-100 hover:text-yellow-300 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                

                {/* Bottom Footer */}
                <div className="mt-12 pt-8 border-t border-blue-400/30">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="text-blue-100 text-center lg:text-left">
                            <p>&copy; {currentYear} PT. Ganesha Sains Nusantara. All rights reserved.</p>
                            <p className="text-sm text-blue-200 mt-1">
                                "Advanced in Academic and Scientific Publishing"
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            {footerLinks.legal.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-blue-100 hover:text-yellow-300 transition-colors text-sm"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}