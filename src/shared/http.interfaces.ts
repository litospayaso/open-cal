export interface HttpRequestInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  api?: string;
}

export interface QueryParams {
  searchQuery?: string;
  search?: string;
  excludeFileType?: string;
  fileType?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  tags?: string;
  itemsPerPage?: number;
  page?: number;
  sortBy?: string;
  filter?: string;
  sortOrder?: 'Ascending' | 'Descending';
  sort?: 'desc' | 'asc';
}



export interface ProductInterface {
  code: string,
  status?: number;
  status_verbose?: string;
  product: {
    nutriments?: NutrimentInterface;
    brands?: string;
    product_name?: string;
  }
}

export interface SearchProductInterface {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  skip: number;
  products: SearchProductItemInterface[];
}

export interface SearchProductItemInterface {
  code: string,
  nutriments: NutrimentInterface;
  nutrition_data: string,
  nutrition_data_per: string,
  nutrition_data_prepared_per: string,
  product_name: string,
  brands?: string
}


export interface NutrimentInterface {
  alcohol: number,
  alcohol_100g: number,
  alcohol_serving: number,
  alcohol_unit: string,
  alcohol_value: number,
  calcium: number,
  calcium_100g: number,
  calcium_unit: string,
  calcium_value: number,
  carbohydrates: number,
  carbohydrates_100g: number,
  carbohydrates_unit: string,
  carbohydrates_value: number,
  energy: number,
  energy_kcal: number,
  energy_kcal_100g: number,
  energy_kcal_unit: string,
  energy_kcal_value: number,
  energy_kj: number,
  energy_kj_100g: number,
  energy_kj_unit: string,
  energy_kj_value: number,
  "energy-kcal": number,
  "energy-kcal_100g": number,
  "energy-kcal_serving": number,
  "energy-kcal_unit": string,
  "energy-kcal_value": number,
  energy_100g: number,
  energy_unit: string,
  energy_value: number,
  fat: number,
  fat_100g: number,
  fat_unit: string,
  fat_value: number,
  fiber: number,
  fiber_100g: number,
  fiber_unit: string,
  fiber_value: number,
  nova_group: number,
  nova_group_100g: number,
  nova_group_serving: number,
  nova_group_unit: string,
  nova_group_value: number,
  proteins: number,
  proteins_100g: number,
  proteins_unit: string,
  proteins_value: number,
  salt: number,
  salt_100g: number,
  salt_unit: string,
  salt_value: number,
  saturated_fat: number,
  saturated_fat_100g: number,
  saturated_fat_unit: string,
  saturated_fat_value: number,
  sodium: number,
  sodium_100g: number,
  sodium_unit: string,
  sodium_value: number,
  sugars: number,
  sugars_100g: number,
  sugars_unit: string,
  sugars_value: number
}