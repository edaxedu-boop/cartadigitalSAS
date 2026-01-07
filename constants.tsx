
import { AppState, Restaurant, Category, Product } from './types';

export const THEME_COLORS = [
  { name: 'Rojo Brasa', value: '#ef4444' },
  { name: 'Naranja Ají', value: '#f97316' },
  { name: 'Amarillo Maíz', value: '#eab308' },
  { name: 'Negro Carbón', value: '#0f172a' },
];

export const SUPER_ADMIN_CREDENTIALS = {
  username: 'admin@menupe.com',
  password: 'pe-master-2025'
};

const DEMO_RESTAURANT: Restaurant = {
  id: 'demo-1',
  name: 'El Sabor Peruano',
  slug: 'el-sabor-peruano',
  description: 'Los mejores platos tradicionales con el toque secreto de la casa. ¡Sabor que enamora!',
  address: 'Av. Larco 123, Miraflores, Lima',
  whatsappNumber: '51900000000',
  primaryColor: '#ef4444',
  username: 'demo',
  password: 'demo',
  logoUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=200&h=200&fit=crop',
  bannerUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&h=400&fit=crop',
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com'
  }
};

const DEMO_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Entradas', restaurantId: 'demo-1' },
  { id: 'cat-2', name: 'Platos de Fondo', restaurantId: 'demo-1' },
  { id: 'cat-3', name: 'Bebidas', restaurantId: 'demo-1' },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    restaurantId: 'demo-1',
    categoryId: 'cat-1',
    name: 'Ceviche de Pescado',
    description: 'Pescado fresco del día, marinado en limón de piura, con ají limo, cebolla roja y camote glaseado.',
    price: 35.00,
    imageUrl: 'https://images.unsplash.com/photo-1535850456674-91518056d2d5?q=80&w=400&h=300&fit=crop',
    isAvailable: true
  },
  {
    id: 'prod-2',
    restaurantId: 'demo-1',
    categoryId: 'cat-2',
    name: 'Lomo Saltado',
    description: 'Trozos de lomo fino salteados al wok con cebolla, tomate y un toque de pisco. Servido con papas fritas y arroz.',
    price: 42.00,
    imageUrl: 'https://images.unsplash.com/photo-1626777553732-48963481b1dd?q=80&w=400&h=300&fit=crop',
    isAvailable: true
  },
  {
    id: 'prod-3',
    restaurantId: 'demo-1',
    categoryId: 'cat-2',
    name: 'Ají de Gallina',
    description: 'Crema de ají amarillo con pechuga de gallina deshilachada, acompañada de huevo, aceituna y arroz.',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&h=300&fit=crop',
    isAvailable: true
  },
  {
    id: 'prod-4',
    restaurantId: 'demo-1',
    categoryId: 'cat-3',
    name: 'Chicha Morada (Jarra)',
    description: 'Refrescante bebida a base de maíz morado, piña, manzana y canela. 100% natural.',
    price: 18.00,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=400&h=300&fit=crop',
    isAvailable: true
  }
];

export const INITIAL_DATA: AppState = {
  restaurants: [DEMO_RESTAURANT],
  categories: DEMO_CATEGORIES,
  products: DEMO_PRODUCTS,
  currentUserId: null,
  isSuperAdmin: false
};