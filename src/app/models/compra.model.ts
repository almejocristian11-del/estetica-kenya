export interface ItemHistorialDetalle {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}

export interface RegistroCompra {
  id: string;
  folio: string;
  fecha: string;
  cliente: string;
  metodoPago: string;
  proveedorPago: 'Stripe Sandbox' | 'Efectivo';
  estadoPago: 'EXITO' | 'PENDIENTE' | 'FALLO';
  items: ItemHistorialDetalle[];
  subtotal: number;
  iva: number;
  total: number;
}

export interface PerfilUsuario {
  id?: string;
  nombreCompleto: string;
  handle: string;
  correo: string;
  telefono: string;
  fechaNacimiento?: string;
  passwordHash?: string;
  rol?: 'cliente' | 'admin';
}

export interface RespuestaPagoSandbox {
  ok: boolean;
  estado: 'EXITO' | 'PENDIENTE' | 'FALLO';
  estadoStripe?: string;
  folio: string;
  proveedor: 'Stripe Sandbox';
  transaccionId: string;
  metodoElegido?: string;
  referenciaOxxoSpei?: string;
  fechaIso: string;
  mensaje: string;
  ultimos4: string;
  total: number;
}
