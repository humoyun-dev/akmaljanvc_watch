export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: Category;
  brand: Brand;
  image: string;
  watch_type: string;
  material: string;
  water_resistance: number | null;
  battery_life: number | null;
  strap_length: string;
  dial_size: string;
  weight: string;
  is_in_stock: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: any;
  name: string;
};

export type Brand = {
  id: any;
  name: string;
};
