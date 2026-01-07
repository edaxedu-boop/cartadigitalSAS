
export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  id: string;
  name: string;
  isMultiSelect: boolean;
  options: ProductOption[];
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface OrderTypes {
  delivery: boolean;
  takeaway: boolean;
  dineIn: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappNumber: string;
  primaryColor: string;
  address: string;
  slug: string;
  email?: string;
  password?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  businessHours?: string;
  deliveryZones?: DeliveryZone[];
  paymentMethods?: PaymentMethod[];
  orderTypes?: OrderTypes;
  promoBanners?: string[]; // Lista de URLs para el carrusel
  plan?: 'basic' | 'standard' | 'premium';
  isActive?: boolean;
  createdAt?: string;
  planExpiresAt?: string;
}

export const PLAN_LIMITS = {
  basic: 50,
  standard: 100,
  premium: Infinity
};

export const PLAN_DETAILS = {
  basic: { name: 'Básico', price: 'S/ 5/mes', annualPrice: 'S/ 49/año', limit: 50 },
  standard: { name: 'Estándar', price: 'S/ 9/mes', annualPrice: 'S/ 99/año', limit: 100 },
  premium: { name: 'Premium', price: 'S/ 19/mes', annualPrice: 'S/ 199/año', limit: 'Ilimitado' }
};

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
}

export interface Product {
  id: string;
  categoryId: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  optionGroups?: ProductOptionGroup[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedOptions?: {
    groupName: string;
    options: ProductOption[];
  }[];
  totalPricePerUnit: number;
}

export interface AppState {
  restaurants: Restaurant[];
  categories: Category[];
  products: Product[];
  currentUserId: string | null;
  isSuperAdmin: boolean; // Identifica si el usuario es el administrador central
}