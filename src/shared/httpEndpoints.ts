/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProductInterface, SearchProductInterface } from './http.interfaces';
import { request } from './httpRequest';


export const getProduct = async (barcode: string): Promise<ProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';
  const response = await request(`api/v3/product/${barcode}?product_type=food&cc=${lang}&lc=${lang}&fields=brands,nutriments,product_name,product_name_${lang},product_name_en&knowledge_panel_client=web&activate_knowledge_panels_simplified=true&activate_knowledge_panel_physical_activities=false&knowledge_panels_included=nutriments&knowledge_panels_excluded=+allergens_hierarchy&blame=0`);
  return response;
};

export const searchProduct = async (query: string): Promise<SearchProductInterface> => {
  const lang = localStorage.getItem('language') || 'en';
  const response = await request(`/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=35&fields=code,brands,product_name,product_name_${lang},product_name_en,nutriments&lc=${lang}`);

  if (response && response.products) {
    const products = response.products.map((p: any) => {
      return {
        ...p,
        product_name: p[`product_name_${lang}`] || p.product_name_en || p.product_name || ''
      };
    });

    const lowerQuery = query.toLowerCase();
    products.sort((a: any, b: any) => {
      const nameA = (a.product_name || '').toLowerCase();
      const nameB = (b.product_name || '').toLowerCase();

      const exactA = nameA === lowerQuery;
      const exactB = nameB === lowerQuery;
      if (exactA && !exactB) return -1;
      if (!exactA && exactB) return 1;

      const startA = nameA.startsWith(lowerQuery);
      const startB = nameB.startsWith(lowerQuery);
      if (startA && !startB) return -1;
      if (!startA && startB) return 1;

      const incA = nameA.includes(lowerQuery);
      const incB = nameB.includes(lowerQuery);
      if (incA && !incB) return -1;
      if (!incA && incB) return 1;

      return 0;
    });

    response.products = products;
  }

  return response;
};
