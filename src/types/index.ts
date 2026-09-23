export type ProductCategory = 
  | 'all'
  | 'camiseta_oversize'
  | 'camiseta'
  | 'musculosa'
  | 'bermuda'
  | 'pantalon';

export type ProductFit = 'oversized' | 'tapered' | 'compression' | 'regular';

export type ProductCollection = 'thunder_drop' | 'atomic_beast' | 'heavy_iron';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  categoryLabel: string;
  collection: ProductCollection;
  collectionLabel: string;
  fit: ProductFit;
  fitLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL')[];
  colors: { name: string; hex: string }[];
  gsm?: number;
  composition: string;
  description: string;
  features: string[];
  inStock: boolean;
  stockAlert?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  // Visual asset configuration
  accentColor: string; // Electric blue or cyan
  graphicType: 'spine_bolt' | 'chest_lightning' | 'pump_raw' | 'gear_strap' | 'shorts_layer' | 'duffel_pack' | 'hoodie_heavy' | 'long_sleeve_mapped';
  imageUrl: string;
  backImageUrl?: string;
}

export interface CartItem {
  product: Product;
  selectedSize: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
  selectedColor: string;
  quantity: number;
}

export interface FilterState {
  category: ProductCategory;
  collection: string;
  fit: string;
  search: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
