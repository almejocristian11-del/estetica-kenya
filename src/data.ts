export type Categoria = 'dama' | 'caballero' | 'boda';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  tipo: 'servicio' | 'paquete';
}

export const CATEGORIAS: { id: Categoria; titulo: string }[] = [
  { id: 'dama', titulo: 'Cortes para dama' },
  { id: 'caballero', titulo: 'Cortes para caballero' },
  { id: 'boda', titulo: 'Paquete para boda' },
];

// Catálogo de ejemplo: edítalo con tus servicios y precios reales.
export const PRODUCTOS: Producto[] = [
  { id: 'd1', nombre: 'Corte de cabello para dama', descripcion: 'Lavado, corte y secado con el estilo que prefieras.', precio: 120, categoria: 'dama', tipo: 'servicio' },
  { id: 'd2', nombre: 'Arreglo de uñas francesas', descripcion: 'Manicure con acabado francés clásico.', precio: 220, categoria: 'dama', tipo: 'servicio' },
  { id: 'd3', nombre: 'Peinado y secado', descripcion: 'Peinado para ocasión especial o uso diario.', precio: 180, categoria: 'dama', tipo: 'servicio' },
  { id: 'c1', nombre: 'Corte de cabello caballero', descripcion: 'Corte clásico o moderno con máquina y tijera.', precio: 100, categoria: 'caballero', tipo: 'servicio' },
  { id: 'c2', nombre: 'Arreglo de barba', descripcion: 'Perfilado y recorte de barba con toalla caliente.', precio: 80, categoria: 'caballero', tipo: 'servicio' },
  { id: 'c3', nombre: 'Corte + barba', descripcion: 'Combo de corte de cabello y arreglo de barba.', precio: 160, categoria: 'caballero', tipo: 'paquete' },
  { id: 'b1', nombre: 'Paquete boda novia', descripcion: 'Peinado, maquillaje y manicure para la novia.', precio: 1800, categoria: 'boda', tipo: 'paquete' },
  { id: 'b2', nombre: 'Paquete boda novio', descripcion: 'Corte, barba y arreglo de manos para el novio.', precio: 600, categoria: 'boda', tipo: 'paquete' },
  { id: 'b3', nombre: 'Paquete boda damas', descripcion: 'Peinado para damas de honor (precio por persona).', precio: 450, categoria: 'boda', tipo: 'paquete' },
];

export const SOPORTE = {
  // Cambia estos datos por los reales del negocio.
  whatsapp: '2711082867',
  correo: 'contacto@esteticakenya.com',
  horario: 'Lunes a sábado de 10:00 a 19:00',
};

export const PREGUNTAS_FRECUENTES: { q: string; a: string }[] = [
  { q: '¿Cómo cancelo una cita?', a: 'Entra a la pestaña Citas y pulsa el botón "Cancelar" de la cita que quieras eliminar.' },
  { q: '¿Cuáles son los métodos de pago?', a: 'Aceptamos efectivo y transferencia. El pago se realiza en el establecimiento.' },
  { q: '¿Cuál es el horario de atención?', a: SOPORTE.horario },
  { q: '¿Necesitas mover tu cita?', a: 'Cancela la cita actual y crea una nueva con la fecha y hora que prefieras.' },
];

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const formatoPrecio = (n: number) => `$${n.toFixed(2)}`;

export function formatoCita(fecha: string, hora: string): string {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dia = date.toLocaleDateString('es-MX', { weekday: 'long' });
  const diaCap = dia.charAt(0).toUpperCase() + dia.slice(1);
  const [hh, mm] = hora.split(':').map(Number);
  const sufijo = hh >= 12 ? 'pm' : 'am';
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${diaCap} ${String(d).padStart(2, '0')} | ${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${sufijo}`;
}
