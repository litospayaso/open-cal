/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from './httpRequest';

export const getProduct = async (barcode: string): Promise<any> => {
  return request(`v3/product/${barcode}?product_type=food&cc=es&lc=en&fields=nutriments&knowledge_panel_client=web&activate_knowledge_panels_simplified=true&activate_knowledge_panel_physical_activities=false&knowledge_panels_included=nutriments&knowledge_panels_excluded=+allergens_hierarchy&blame=1"`);
};
