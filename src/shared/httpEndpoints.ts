/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductInterface, SearchProductInterface } from './http.interfaces';
import { request } from './httpRequest';



export const getData = async (): Promise<any> => {
  return request(`/whatever`);
};

export const getProduct = async (barcode: string): Promise<ProductInterface> => {
  return request(`v3/product/${barcode}?product_type=food&cc=es&lc=en&fields=nutriments,product_name&knowledge_panel_client=web&activate_knowledge_panels_simplified=true&activate_knowledge_panel_physical_activities=false&knowledge_panels_included=nutriments&knowledge_panels_excluded=+allergens_hierarchy&blame=0`);
};

export const searchProduct = async (query: string): Promise<SearchProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';
  return request(`/v2/search?categories_tags_${lang}=${query}&fields=code,brands,product_name,nutriments&lc=${lang}&page_size=30&sort_by=popularity`);
  // return request(`v2/search?categories_tags=${query}&lc=en&fields=code,product_name&sort_by=popularity`);
};
