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
  product: {
    nutriment: NutrimentInterface;
  }
}

export interface NutrimentInterface {
  alcohol: number,
  alcohol_100g: number,
  alcohol_serving: number,
  alcohol_unit: string,
  alcohol_value: number,
  carbohydrates: number,
  carbohydrates_100g: number,
  carbohydrates_serving: number,
  carbohydrates_unit: string,
  carbohydrates_value: number,
  'carbon-footprint-from-known-ingredients_product': number,
  'carbon-footprint-from-known-ingredients_serving': number,
  energy: number,
  'energy-kcal': string,
  'energy-kcal_100g': string,
  'energy-kcal_serving': number,
  'energy-kcal_unit': string,
  'energy-kcal_value': number,
  'energy-kj': number,
  'energy-kj_100g': number,
  'energy-kj_serving': number,
  'energy-kj_unit': string,
  'energy-kj_value': number,
  energy_100g: number,
  energy_serving: number,
  energy_unit: string,
  energy_value: number,
  fat: number,
  fat_100g: number,
  fat_serving: number,
  fat_unit: string,
  fat_value: number,
  'fruits-vegetables-nuts-estimate-from-ingredients_100g': number,
  'fruits-vegetables-nuts-estimate-from-ingredients_serving': number,
  'nova-group': number,
  'nova-group_100g': number,
  'nova-group_serving': number,
  'nutrition-score-fr': number,
  'nutrition-score-fr_100g': number,
  proteins: number,
  proteins_100g: number,
  proteins_serving: number,
  proteins_unit: string,
  proteins_value: number,
  salt: number,
  salt_100g: number,
  salt_serving: number,
  salt_unit: string,
  salt_value: number,
  'saturated-fat': number,
  'saturated-fat_100g': number,
  'saturated-fat_serving': number,
  'saturated-fat_unit': string,
  'saturated-fat_value': number,
  sodium: number,
  sodium_100g: number,
  sodium_serving: number,
  sodium_unit: string,
  sodium_value: number,
  sugars: number,
  sugars_100g: number,
  sugars_serving: number,
  sugars_unit: string,
  sugars_value: number,
  }