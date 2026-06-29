import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export type PropertyListing = {
  _id: string;
  title: string;
  location: string;
  price: number;
  currency?: string;
  image?: string;
  images?: string[];
  features?: string[];
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
};

export const realEstateService = {
  getListings() {
    return apiClient.get<PropertyListing[]>(ENDPOINTS.REAL_ESTATE.LISTINGS);
  },

  getById(id: string) {
    return apiClient.get<PropertyListing>(ENDPOINTS.REAL_ESTATE.BY_ID(id));
  },
};
