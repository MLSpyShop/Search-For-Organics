/// <reference types="vite/client" />

export interface NutritionInfo {
  [key: string]: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
  type: 'web' | 'maps';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  purity: number;
  certifications: string[];
  price: string;
  shippingPrice: string;
  vendor: string;
  isLocal: boolean;
  isOfficial?: boolean;
  imageUrl?: string; 
  sourceUrl?: string;
  nutrition?: NutritionInfo;
  criticism?: string;
}

export interface SearchResponse {
  products: Product[];
  sources: GroundingSource[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}