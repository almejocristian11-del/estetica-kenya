import { ItemHistorialDetalle } from './compra.model';

export interface ItemCatalogo {
  id: string;
  nombre: string;
  categoria: 'dama' | 'caballero' | 'boda' | 'producto';
  tipo: 'servicio' | 'paquete' | 'producto';
  precio: number;
  descripcion: string;
  duracion: string;
  icono: string;
  imagen: string;
}

export interface ItemCarrito {
  item: ItemCatalogo;
  cantidad: number;
}

export interface CitaAgendada {
  id: string;
  titulo: string;
  fechaIso?: string;
  hora24?: string;
  fechaHora: string;
  precio: number;
  notificar: boolean;
  productoExtra?: string;
  items?: ItemHistorialDetalle[];
  folioPago?: string;
}

export interface CitaPendientePago {
  titulo: string;
  fechaIso: string;
  hora24: string;
  fechaHora: string;
  notificar: boolean;
  items: ItemHistorialDetalle[];
  subtotal: number;
  iva: number;
  total: number;
}
