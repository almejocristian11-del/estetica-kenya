export interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export type ProductoInput = Pick<Producto, 'title' | 'price' | 'description' | 'category' | 'image'>;
