// types/index.ts
export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<any> | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  email_verified_at?: string | null;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Auth {
  user: User;
}

export interface SharedData {
  auth: Auth;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  links: PaginationLink[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface CategoriesFilters {
  search?: string;
  status?: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image?: string;
  author_id: string;
  author: User;
  category_id: string;
  category: Category;
  isbn?: string;
  publication_date?: string;
  price: number;
  discount_percentage: number;
  is_published: boolean;
  is_featured: boolean;
  total_chapters?: string;
  reading_time_minutes?: string;
  language: string;
  tags: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BooksFilters {
  search?: string;
  category?: string;
  status?: string;
  featured?: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  is_published: boolean;
  is_free: boolean;
  price: number;
  reading_time_minutes?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  previous_chapter?: {
    id: string;
    title: string;
    chapter_number: number;
  };
  next_chapter?: {
    id: string;
    title: string;
    chapter_number: number;
  };
}

export interface ChaptersFilters {
  search?: string;
  status?: string;
  type?: string;
}

export interface Media {
  id: string;
  chapter_id: string;
  filename: string;
  file_name: string;
  file_path: string;
  original_name: string;
  mime_type: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  file_size: number;
  url: string;
  alt_text?: string;
  caption?: string;
  sort_order?: number;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  transaction_code: string;
  user_id: string;
  user: User;
  type: 'book_purchase' | 'chapter_purchase';
  status: 'pending' | 'paid' | 'failed' | 'expired';
  payment_status: 'pending' | 'paid' | 'failed' | 'expired';
  total_amount: number;
  payment_method: string;
  payment_data?: any;
  midtrans_order_id?: string;
  midtrans_transaction_id?: string;
  midtrans_payment_type?: string;
  paid_at?: string;
  expired_at?: string;
  created_at: string;
  updated_at: string;
  items?: TransactionItem[];
  purchases?: UserPurchase[];
}

export interface UserPurchase {
  id: string;
  user_id: string;
  purchasable_type: 'book' | 'chapter';
  purchasable_id: string;
  transaction_id: string;
  purchased_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  item_type: 'book' | 'chapter';
  item_id: string;
  item_title: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionStats {
  total_transactions: number;
  total_revenue: number;
  pending_count: number;
  pending_transactions: number;
  paid_count: number;
  paid_transactions: number;
  failed_count: number;
  failed_transactions: number;
  expired_transactions: number;
  today_transactions: number;
  today_revenue: number;
  monthly_revenue: number;
  this_month_revenue: number;
  pending_amount: number;
  failed_amount: number;
  expired_amount: number;
  revenue_growth?: number;
  transaction_growth?: number;
}

export interface TransactionFilters {
  search?: string;
  status?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  verified?: string;
  date_from?: string;
  date_to?: string;
}