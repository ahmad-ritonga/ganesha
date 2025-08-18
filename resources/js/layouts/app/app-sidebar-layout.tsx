import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { InertiaSidebarLink } from "@/components/ui/inertia-sidebar-link";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { type BreadcrumbItem } from '@/types';
import { initializeTheme } from '@/utils/theme';
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconSettings,
  IconLogout,
  IconPlus,
  IconUser,
  IconHome,
  IconCategory,
  IconCreditCard,
  IconHistory,
  IconChartBar,
  IconProgress,
  IconStar,
  IconStarFilled,
  IconAnalyze,
  IconUsersGroup,
  IconTrendingUp,
  IconChevronRight,
  IconChevronDown,
  IconFiles,
  IconFolders,
  IconFileText,
  IconPhoto,
  IconLock,
} from "@tabler/icons-react";

interface AppSidebarLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

interface SidebarLinkWithSubItems {
  label: string;
  href?: string;
  icon: React.ReactNode;
  subItems?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
}

export default function AppSidebarLayout({ children, breadcrumbs }: AppSidebarLayoutProps) {
  const { auth } = usePage().props as any;
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cleanup = initializeTheme();
    return cleanup;
  }, []);

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const getLinks = (): SidebarLinkWithSubItems[] => {
    if (auth.user?.role === 'admin') {
      return [
        {
          label: "Dashboard",
          href: route('admin.dashboard'),
          icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        
        {
          label: "Kategori",
          href: route('admin.categories.index'),
          icon: <IconCategory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Manajemen Buku",
          icon: <IconBook className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Semua E-Books",
              href: route('admin.books.index'),
              icon: <IconBook className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
            {
              label: "Tambah E-Book",
              href: route('admin.books.create'),
              icon: <IconPlus className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
          ]
        },
        {
          label: "Reviews",
          href: route('admin.reviews.index'),
          icon: <IconStar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Transaksi",
          icon: <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Semua Transaksi",
              href: route('admin.transactions.index'),
              icon: <IconCreditCard className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
            {
              label: "Analytics",
              href: route('admin.transactions.analytics'),
              icon: <IconChartBar className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
          ]
        },
        {
          label: "Analytics",
          icon: <IconAnalyze className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "Reading Progress",
              href: route('admin.analytics.reading-progress'),
              icon: <IconProgress className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
            {
              label: "User Engagement",
              href: route('admin.analytics.user-engagement'),
              icon: <IconTrendingUp className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
          ]
        },
        {
          label: "Pengguna",
          href: route('admin.users.index'),
          icon: <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Pengaturan",
          icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
          subItems: [
            {
              label: "General",
              href: route('admin.settings'),
              icon: <IconSettings className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
            {
              label: "Profile",
              href: route('admin.settings.profile.edit'),
              icon: <IconUser className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
            {
              label: "Password",
              href: route('admin.settings.password.edit'),
              icon: <IconLock className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
            {
              label: "Appearance",
              href: route('admin.settings.appearance'),
              icon: <IconSettings className="h-4 w-4 shrink-0 text-neutral-600 dark:text-neutral-300" />,
            },
          ]
        },
      ];
    } else {
      return [
        {
          label: "Home",
          href: route('home'),
          icon: <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "My Books",
          href: route('my-books'),
          icon: <IconBook className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Reading Progress",
          href: route('reading-progress.index'),
          icon: <IconProgress className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Progress Analytics",
          href: route('reading-progress.analytics'),
          icon: <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "My Reviews",
          href: route('reviews.index'),
          icon: <IconStarFilled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Transaksi",
          href: route('transactions.index'),
          icon: <IconCreditCard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Reading History",
          href: route('reading-history'),
          icon: <IconHistory className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
        {
          label: "Profile",
          href: route('profile.edit'),
          icon: <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
      ];
    }
  };

  const links = getLinks();

  return (
    <div className={cn(
      "mx-auto flex w-full max-w-full flex-1 flex-col bg-gray-100 md:flex-row dark:bg-neutral-800",
      "min-h-screen"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Logo - Show LogoIcon on mobile, Logo on desktop when open */}
            <div className="block md:hidden">
              <LogoIcon />
            </div>
            <div className="hidden md:block">
              {open ? <Logo /> : <LogoIcon />}
            </div>
            
            <div className="mt-8 flex flex-col gap-2 overflow-y-auto flex-1 pr-2">
              {links.map((link, idx) => (
                <div key={idx}>
                  {link.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(link.label)}
                        className="flex w-full items-center justify-between gap-2 group/sidebar py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {link.icon}
                          <motion.span
                            animate={{
                              display: open ? "inline-block" : "none",
                              opacity: open ? 1 : 0,
                            }}
                            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                          >
                            {link.label}
                          </motion.span>
                        </div>
                        {open && (
                          <motion.div
                            animate={{
                              rotate: expandedItems.has(link.label) ? 90 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <IconChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                          </motion.div>
                        )}
                      </button>
                      {expandedItems.has(link.label) && open && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-6 mt-1 space-y-1"
                        >
                          {link.subItems.map((subItem, subIdx) => (
                            <InertiaSidebarLink
                              key={subIdx}
                              link={{
                                label: subItem.label,
                                href: subItem.href,
                                icon: subItem.icon || <div className="w-4 h-4" />,
                              }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <InertiaSidebarLink
                      link={{
                        label: link.label,
                        href: link.href!,
                        icon: link.icon,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <SidebarLink
              link={{
                label: auth.user?.name || "Guest",
                href: auth.user?.role === 'admin' ? "#" : route('profile.edit'),
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {auth.user?.name?.charAt(0)?.toUpperCase() || "G"}
                  </div>
                ),
              }}
            />
            
            <Link
              href={route('logout')}
              method="post"
              className="flex items-center justify-start gap-2 group/sidebar py-2 mt-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md px-2 transition-colors"
            >
              <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
              >
                Keluar
              </motion.span>
            </Link>
          </div>
        </SidebarBody>
      </Sidebar>
      
      {/* Main Content Area - Fixed for mobile scrolling */}
      <main className="flex flex-1 flex-col min-h-screen pt-16 md:pt-0">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-6 py-3 shrink-0">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="text-neutral-400 mx-2">/</span>
                    )}
                    {breadcrumb.href ? (
                      <Link
                        href={breadcrumb.href}
                        className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                      >
                        {breadcrumb.title}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {breadcrumb.title}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        )}
        
        {/* Content Container - This is where the scrolling happens */}
        <div className="flex flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export const Logo = () => {
  const { auth } = usePage().props as any;
  const isAdmin = auth.user?.role === 'admin';
  
  return (
    <Link
      href={isAdmin ? route('admin.dashboard') : route('home')}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <img 
        src="/assets/images/logo.png" 
        alt="Ganesha Logo" 
        className="h-16 w-16 shrink-0 object-contain"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        {isAdmin ? "Ganesha Admin" : "Ganesha"}
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  const { auth } = usePage().props as any;
  const isAdmin = auth.user?.role === 'admin';
  
  return (
    <Link
      href={isAdmin ? route('admin.dashboard') : route('home')}
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <img 
        src="/assets/images/logo.png" 
        alt="Ganesha Logo" 
        className="h-8 w-8 shrink-0 object-contain"
      />
    </Link>
  );
};