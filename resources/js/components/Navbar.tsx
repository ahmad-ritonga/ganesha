"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { User, Settings, LogOut, ChevronDown, BookOpen, Users, Atom, Heart, Wrench, ShoppingCart, History, PenTool } from "lucide-react";
import axios from 'axios';

interface NavItem {
  name: string;
  link: string;
  hasDropdown?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  books_count?: number;
}

interface GaneshaNavbarProps {
  className?: string;
}

export default function GaneshaNavbar({ className }: GaneshaNavbarProps) {
  const { auth } = usePage().props as any;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Navigation items for guests
  const guestNavItems: NavItem[] = [
    {
      name: "Beranda",
      link: "/",
    },
    {
      name: "Tentang",
      link: "/about",
    },
    {
      name: "Kategori",
      link: "/categories",
      hasDropdown: true,
    },
    {
      name: "E-Books",
      link: "/books",
    },
  ];

  // Navigation items for authenticated users
  const userNavItems: NavItem[] = [
    {
      name: "Beranda",
      link: "/",
    },
    {
      name: "Tentang",
      link: "/about",
    },
    {
      name: "Kategori",
      link: "/categories",
      hasDropdown: true,
    },
    
    {
      name: "E-Books",
      link: "/books",
    },
    {
      name: "Buku Saya",
      link: "/my-books",
    },
  ];

  // Navigation items for admin
  const adminNavItems: NavItem[] = [
    {
      name: "Dashboard",
      link: "/admin/dashboard",
    },
    {
      name: "Pengguna",
      link: "/admin/users",
    },
    {
      name: "E-Books",
      link: "/admin/ebooks",
    },
    {
      name: "Pengaturan",
      link: "/admin/settings",
    },
  ];

  // Determine which nav items to show
  const getNavItems = () => {
    if (!auth?.user) return guestNavItems;
    if (auth.user.role === 'admin') return adminNavItems;
    return userNavItems;
  };

  const navItems = getNavItems();

  // User dropdown menu items - focused on personal/account items only
  const userDropdownItems = auth?.user?.role === 'admin' ? [
    {
      name: "Profil Saya",
      link: "/profile",
      icon: User,
    },
    {
      name: "Pengaturan Admin",
      link: "/admin/settings",
      icon: Settings,
    },
  ] : [
    {
      name: "Profil Saya",
      link: "/profile",
      icon: User,
    },
    {
      name: "Riwayat Transaksi",
      link: "/transactions",
      icon: ShoppingCart,
    },
    {
      name: "Riwayat Baca",
      link: "/reading-history",
      icon: History,
    },
    // Add Author Dashboard if user has active author subscription
    ...(auth?.user?.has_active_author_subscription ? [{
      name: "Dashboard Penulis",
      link: "/author/dashboard",
      icon: PenTool,
    }] : []),
  ];

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await axios.get('/api/navbar/categories');
        setCategories(response.data || {});
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories({});
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Categories sudah digroup berdasarkan slug dari backend
  const categoriesBySlug = {
    eksakta: categories.eksakta || [],
    soshum: categories.soshum || [],
    terapan: categories.terapan || [],
    interdisipliner: categories.interdisipliner || []
  };

  // Debug untuk memastikan categories tersedia
  const hasCategoriesData = Object.values(categoriesBySlug).some(cats => cats.length > 0);

  const slugConfig = [
    {
      key: 'eksakta',
      name: 'Ilmu Eksakta',
      description: 'Matematika, Fisika, Kimia, Biologi',
      icon: Atom,
      color: 'blue'
    },
    {
      key: 'soshum',
      name: 'Sosial Humaniora',
      description: 'Sosiologi, Psikologi, Ekonomi, Hukum',
      icon: Users,
      color: 'purple'
    },
    {
      key: 'terapan',
      name: 'Ilmu Terapan',
      description: 'Kedokteran, Teknik, Pertanian',
      icon: Heart,
      color: 'green'
    },
    {
      key: 'interdisipliner',
      name: 'Interdisipliner',
      description: 'Bioteknologi, Data Science, AI',
      icon: Wrench,
      color: 'orange'
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="categories"]')) {
        setShowCategoriesDropdown(false);
      }
      if (!target.closest('[data-dropdown="user"]') && !target.closest('[data-dropdown="mobile-user"]')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <GaneshaLogo />
          <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            {/* Inertia Nav Items */}
            <div
              onMouseLeave={() => setHovered(null)}
              className="flex flex-row items-center justify-center space-x-2 text-sm font-medium lg:space-x-4"
            >
              {navItems.map((item, idx) => (
                <div key={`link-${idx}`} className="relative">
                  {item.hasDropdown ? (
                    <div 
                      className="relative"
                      data-dropdown="categories"
                      onMouseEnter={() => {
                        setHovered(idx);
                        setShowCategoriesDropdown(true);
                      }}
                      onMouseLeave={() => {
                        setShowCategoriesDropdown(false);
                      }}
                    >
                      <button
                        className="relative px-3 py-2 text-black hover:text-emerald-600 transition-colors duration-200 font-medium flex items-center gap-1"
                      >
                        {hovered === idx && (
                          <div className="absolute inset-0 h-full w-full rounded-full bg-emerald-50 border border-emerald-100" />
                        )}
                        <span className="relative z-20 font-medium">{item.name}</span>
                        <ChevronDown className={`h-4 w-4 relative z-20 transition-transform duration-200 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Categories Dropdown */}
                      <div className={`absolute left-0 top-full mt-1 w-[800px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-200 z-50 ${
                        showCategoriesDropdown 
                          ? 'opacity-100 translate-y-0 visible' 
                          : 'opacity-0 translate-y-2 invisible'
                      }`}>
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-emerald-100">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-emerald-600" />
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">Kategori Buku</h3>
                              <p className="text-sm text-gray-600">Pilih kategori sesuai bidang ilmu yang Anda minati</p>
                            </div>
                          </div>
                        </div>

                        {/* Categories Grid */}
                        <div className="p-6">
                          {loadingCategories ? (
                            <div className="text-center py-8">
                              <div className="text-gray-500 mb-4">
                                <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300 animate-pulse" />
                                <p className="text-sm">Memuat kategori...</p>
                              </div>
                            </div>
                          ) : hasCategoriesData ? (
                            <div className="grid grid-cols-2 gap-6">
                              {slugConfig.map((slug) => {
                                const Icon = slug.icon;
                                const slugCategories = categoriesBySlug[slug.key as keyof typeof categoriesBySlug];
                                
                                if (slugCategories.length === 0) return null;

                                return (
                                  <div key={slug.key} className="space-y-3">
                                    {/* Slug Header */}
                                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                      <div className={`p-2 rounded-lg bg-${slug.color}-100`}>
                                        <Icon className={`h-5 w-5 text-${slug.color}-600`} />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{slug.name}</h4>
                                        <p className="text-xs text-gray-500">{slug.description}</p>
                                      </div>
                                    </div>

                                    {/* Categories List */}
                                    <div className="space-y-1">
                                      {slugCategories.slice(0, 6).map((category) => (
                                        <Link
                                          key={category.id}
                                          href={`/books?category=${category.id}`}
                                          className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-all duration-200 group"
                                        >
                                          <span className="font-medium">{category.name}</span>
                                          {category.books_count && (
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700">
                                              {category.books_count}
                                            </span>
                                          )}
                                        </Link>
                                      ))}
                                      {slugCategories.length > 6 && (
                                        <Link
                                          href={`/books?slug=${slug.key}`}
                                          className="block px-3 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                          Lihat semua ({slugCategories.length})
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="text-gray-500 mb-4">
                                <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Tidak ada kategori tersedia</p>
                              </div>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mt-6 pt-4 border-t border-gray-100">
                            <Link
                              href="/categories"
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                            >
                              <BookOpen className="h-4 w-4" />
                              Lihat Semua Kategori
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      onMouseEnter={() => setHovered(idx)}
                      className="relative px-3 py-2 text-black hover:text-emerald-600 transition-colors duration-200 font-medium"
                      href={item.link}
                    >
                      {hovered === idx && (
                        <div className="absolute inset-0 h-full w-full rounded-full bg-emerald-50 border border-emerald-100" />
                      )}
                      <span className="relative z-20 font-medium">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {!auth?.user ? (
              // Guest buttons
              <>
                <Link href="/login">
                  <NavbarButton variant="secondary">Masuk</NavbarButton>
                </Link>
                <Link href="/register">
                  <NavbarButton variant="primary">Daftar</NavbarButton>
                </Link>
              </>
            ) : (
              // Authenticated user with avatar dropdown
              <div 
                className="relative"
                data-dropdown="user"
                onMouseEnter={() => setShowUserDropdown(true)}
                onMouseLeave={() => setShowUserDropdown(false)}
              >
                <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-200">
                  {/* User Avatar */}
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-emerald-200 shadow-sm">
                    {auth.user.avatar_url ? (
                      <img 
                        src={auth.user.avatar_url} 
                        alt={auth.user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {auth.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="text-left">
                    <p className="font-medium text-black text-sm leading-tight whitespace-nowrap">
                      {auth.user.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {auth.user.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                  
                  {/* Dropdown Arrow */}
                  <ChevronDown 
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      showUserDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* User Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-200 z-50 ${
                  showUserDropdown 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 translate-y-2 invisible'
                }`}>
                  {/* User Info Header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-emerald-100">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-emerald-200 shadow-lg">
                        {auth.user.avatar_url ? (
                          <img 
                            src={auth.user.avatar_url} 
                            alt={auth.user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {auth.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-black text-base truncate">
                          {auth.user.name}
                        </p>
                        <p className="text-sm text-slate-600 truncate">
                          {auth.user.email}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          auth.user.role === 'admin' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {auth.user.role === 'admin' ? 'Administrator' : 'User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {userDropdownItems.map((item, idx) => (
                      <Link
                        key={`dropdown-${idx}`}
                        href={item.link}
                        className="flex items-center gap-3 px-5 py-3 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                    
                    {/* Logout */}
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <Link
                        href="/logout"
                        method="post"
                        className="flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">Keluar</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <GaneshaLogo />
            <div className="flex items-center gap-2">
              {/* Mobile User Avatar (only for authenticated users) */}
              {auth?.user && (
                <div 
                  className="relative lg:hidden"
                  data-dropdown="mobile-user"
                  onMouseEnter={() => setShowUserDropdown(true)}
                  onMouseLeave={() => setShowUserDropdown(false)}
                >
                  <button 
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-emerald-200 shadow-sm">
                      {auth.user.avatar_url ? (
                        <img 
                          src={auth.user.avatar_url} 
                          alt={auth.user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {auth.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Mobile User Dropdown */}
                  <div className={`absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 z-50 ${
                    showUserDropdown 
                      ? 'opacity-100 translate-y-0 visible' 
                      : 'opacity-0 translate-y-2 invisible'
                  }`}>
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-cyan-50 border-b border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-cyan-500 border-2 border-emerald-200">
                          {auth.user.avatar_url ? (
                            <img 
                              src={auth.user.avatar_url} 
                              alt={auth.user.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {auth.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {auth.user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {auth.user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {userDropdownItems.map((item, idx) => (
                        <Link
                          key={`mobile-dropdown-${idx}`}
                          href={item.link}
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      ))}
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          href="/logout"
                          method="post"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm font-medium">Keluar</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* Mobile Navigation Items */}
            <div className="w-full space-y-2">
              {navItems.map((item, idx) => (
                <div key={`mobile-link-${idx}`}>
                  {item.hasDropdown ? (
                    <Link
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 text-black hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left px-4 py-3 text-black hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile action buttons for guests only */}
            {!auth?.user && (
              <div className="w-full space-y-4 pt-6 mt-6 border-t border-gray-200">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                  <NavbarButton variant="secondary" className="w-full">
                    Masuk
                  </NavbarButton>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                  <NavbarButton variant="primary" className="w-full">
                    Daftar
                  </NavbarButton>
                </Link>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

// Custom Ganesha Logo Component
const GaneshaLogo = () => {
  const { auth } = usePage().props as any;
  
  const getLogoLink = () => {
    if (!auth?.user) return "/";
    if (auth.user.role === 'admin') return "/admin/dashboard";
    return "/";
  };

  return (
    <Link
      href={getLogoLink()}
      className="relative z-20 flex items-center space-x-3 px-2 py-1 text-sm font-normal"
    >
      <img 
        src="/assets/images/logo.png" 
        alt="Ganesha Logo" 
        className="h-8 w-8"
      />
      <span className="font-bold text-xl text-black">
        Ganesha
      </span>
    </Link>
  );
};