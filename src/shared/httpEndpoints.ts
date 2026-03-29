/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductInterface, SearchProductInterface, SearchProductItemInterface } from './http.interfaces';
import { request } from './httpRequest';


let cachedPopularProducts: { [lang: string]: string[] } = {};

export const getProduct = async (barcode: string): Promise<ProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';
  const response = await request(`api/v3/product/${barcode}?product_type=food&cc=${lang}&lc=${lang}&fields=brands,nutriments,product_name,product_name_${lang},product_name_en&knowledge_panel_client=web&activate_knowledge_panels_simplified=true&activate_knowledge_panel_physical_activities=false&knowledge_panels_included=nutriments&knowledge_panels_excluded=+allergens_hierarchy&blame=0`);
  return response;
};

export const searchProduct = async (query: string): Promise<SearchProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';

  if (!cachedPopularProducts[lang]) {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/litospayaso/brote/refs/heads/main/assets/data/products_${lang}.json`);
      if (response.ok) {
        cachedPopularProducts[lang] = await response.json();
      } else {
        cachedPopularProducts[lang] = [];
      }
    } catch (error) {
      console.error(`Error fetching popular products for ${lang}:`, error);
      cachedPopularProducts[lang] = [];
    }
  }

  const popularProducts = cachedPopularProducts[lang];
  const lowerQuery = query.toLowerCase();

  const filtered = popularProducts.filter(item => item.toLowerCase().includes(lowerQuery));

  const products: SearchProductItemInterface[] = filtered.map(item => {
    const code = item.split(' :: ')[0];
    const lastDashIndex = item.lastIndexOf(' - ');
    const colonIndex = item.indexOf(' :: ');
    const firstBracketsIndex = item.lastIndexOf('[');
    const lastBracketsIndex = item.lastIndexOf(']');
    let productName = '';
    let brands = '';
    let kcal;

    if (lastDashIndex !== -1 && firstBracketsIndex !== -1) {
      productName = item.substring(colonIndex + 4, lastDashIndex);
      brands = item.substring(lastDashIndex + 3, firstBracketsIndex);
      kcal = item.substring(firstBracketsIndex + 1, lastBracketsIndex);
    } else if (lastDashIndex !== -1) {
      productName = item.substring(colonIndex + 4, lastDashIndex);
      brands = item.substring(lastDashIndex + 3);
    } else if (lastBracketsIndex !== -1) {
      productName = item.substring(colonIndex + 4, firstBracketsIndex);
      kcal = item.substring(firstBracketsIndex + 1, lastBracketsIndex);
    } else {
      productName = item.substring(colonIndex + 4);
    }

    return {
      code,
      product_name: productName,
      brands: brands,
      nutriments: {
        'energy-kcal': Number(kcal),
      } as any,
      nutrition_data: '',
      nutrition_data_per: '',
      nutrition_data_prepared_per: ''
    };
  });

  return {
    count: filtered.length,
    page: 1,
    page_count: Math.ceil(filtered.length / 35),
    page_size: 35,
    skip: 0,
    products
  };
};
