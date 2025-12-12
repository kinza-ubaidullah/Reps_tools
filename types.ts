
export enum Rank {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
  ADMIN = 'Admin'
}

export interface User {
  id: string; // UUID from Supabase
  username: string;
  email: string;
  avatar?: string;
  banner?: string; // Added Banner URL support
  rank: Rank;
  joinDate: string;
  reputation: number; // For "activity"
  description?: string; // User bio
}

export interface ShippingLine {
  name: string;
  minWeight: number;
  maxWeight: number;
  basePrice: number; // in USD
  pricePer500g: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  features: string[]; // e.g., "Insurance", "Tax Free"
}

export interface Agent {
  id: string;
  name: string;
  website: string;
  logo: string;
  shippingLines: ShippingLine[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  userRank: Rank;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Product {
  id: string;
  title: string;
  priceCNY: number;
  image: string;
  sales: number;
  platform: 'Taobao' | 'Weidian' | '1688';
  link: string;
}

export interface TrackingStep {
  date: string;
  status: string;
  location: string;
  description: string;
}

export interface TrackingData {
  trackingNumber: string;
  carrier: string;
  status: 'In Transit' | 'Delivered' | 'Exception' | 'Pending';
  estimatedDelivery?: string;
  steps: TrackingStep[];
}

// Database Interfaces
export interface Seller {
  id: number;
  name: string;
  category: string;
  status: 'Trusted' | 'Pending' | 'Rejected';
  rating: number;
  link?: string;
  created_at?: string;
}

export interface Spreadsheet {
  id: number;
  title: string;
  items: string; // e.g. "1.5k" or count
  author: string;
  link: string;
  category?: string;
  created_at?: string;
}

export interface QCCacheEntry {
  id?: number;
  product_id: string;
  data: any[]; // Stores the QCPhoto[]
  created_at?: string;
}
