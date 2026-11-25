import { CitaAgendada, ItemCatalogo } from './catalogo.model';
import { RegistroCompra } from './compra.model';

export const CATALOGO_INICIAL: ItemCatalogo[] = [
  // Cortes para dama
  { id: 'dama-1', nombre: 'Corte de cabello para dama', categoria: 'dama', tipo: 'servicio', precio: 120, duracion: '45 min', icono: 'cut-outline', imagen: 'assets/images/cabello_ref1.png', descripcion: 'Corte personalizado según tu tipo de rostro, incluye lavado revitalizante, despunte o cambio de estilo y secado con cepillo.' },
  { id: 'dama-2', nombre: 'Corte en capas y estilizado', categoria: 'dama', tipo: 'servicio', precio: 150, duracion: '50 min', icono: 'sparkles-outline', imagen: 'assets/images/peinado_1.jpg', descripcion: 'Diseño de capas para dar volumen y movimiento natural al cabello, con aplicación de protector térmico y planchado o moldeado.' },
  { id: 'dama-3', nombre: 'Arreglo de Uñas Francesas', categoria: 'dama', tipo: 'servicio', precio: 220, duracion: '60 min', icono: 'color-wand-outline', imagen: 'assets/images/unas_1.jpg', descripcion: 'Manicura completa con diseño francés clásico o moderno, exfoliación hidratante de manos y acabado en gel de larga duración.' },

  // Cortes para caballero
  { id: 'caballero-1', nombre: 'Corte clásico para caballero', categoria: 'caballero', tipo: 'servicio', precio: 100, duracion: '30 min', icono: 'person-outline', imagen: 'assets/images/servicios_hero.png', descripcion: 'Corte ejecutivo con tijera y máquina, delineado de contornos con navaja y peinado con cera o pomada profesional.' },
  { id: 'caballero-2', nombre: 'Corte Fade / Degradado', categoria: 'caballero', tipo: 'servicio', precio: 130, duracion: '40 min', icono: 'flash-outline', imagen: 'assets/images/servicios_ref4.png', descripcion: 'Degradado limpio con diseño de textura en la parte superior y perfilado de cejas incluido.' },
  { id: 'caballero-3', nombre: 'Corte y ritual de barba', categoria: 'caballero', tipo: 'servicio', precio: 170, duracion: '50 min', icono: 'shield-checkmark-outline', imagen: 'assets/images/inicio_hero.jpg', descripcion: 'Corte completo más arreglo de barba con toalla caliente, aceites esenciales hidratantes y perfilado de precisión.' },

  // Paquetes para boda
  { id: 'boda-1', nombre: 'Paquete Novia Radiante', categoria: 'boda', tipo: 'paquete', precio: 1200, duracion: '3 hrs', icono: 'heart-outline', imagen: 'assets/images/peinado_1.jpg', descripcion: 'Incluye prueba previa de maquillaje y alto peinado, preparación facial luminosa, pestañas pelo a pelo y manicura nupcial.' },
  { id: 'boda-2', nombre: 'Paquete Damas de Honor', categoria: 'boda', tipo: 'paquete', precio: 650, duracion: '90 min', icono: 'rose-outline', imagen: 'assets/images/unas_2.jpg', descripcion: 'Peinado recogido u ondas suaves más maquillaje social de alta duración a prueba de agua y fijador profesional.' },
  { id: 'boda-3', nombre: 'Paquete Novio Gala', categoria: 'boda', tipo: 'paquete', precio: 450, duracion: '75 min', icono: 'diamond-outline', imagen: 'assets/images/cabello_ref1.png', descripcion: 'Corte de gala, diseño y perfilado de barba, mascarilla facial matificante y manicura para caballero.' },

  // Productos
  { id: 'prod-1', nombre: 'Shampoo Hidratante con Keratina', categoria: 'producto', tipo: 'producto', precio: 190, duracion: 'Envase 500 ml', icono: 'water-outline', imagen: 'assets/images/producto_1.jpg', descripcion: 'Fórmula libre de sulfatos enriquecida con keratina hidrolizada y aceite de argán para restaurar el brillo y suavidad.' },
  { id: 'prod-2', nombre: 'Mascarilla Capilar Reparadora', categoria: 'producto', tipo: 'producto', precio: 240, duracion: 'Tarro 350 g', icono: 'leaf-outline', imagen: 'assets/images/producto_2.jpg', descripcion: 'Tratamiento intensivo para cabello teñido o procesado; sella las puntas abiertas desde la primera aplicación.' },
  { id: 'prod-3', nombre: 'Sérum Protector Termo-Activo', categoria: 'producto', tipo: 'producto', precio: 160, duracion: 'Frasco 120 ml', icono: 'flame-outline', imagen: 'assets/images/unas_1.jpg', descripcion: 'Protege la fibra capilar del calor de planchas y secadoras hasta 230°C eliminando el frizz al instante.' },
];

export const CITAS_INICIALES: CitaAgendada[] = [
  { id: 'cita-1', titulo: 'Corte de cabello para dama', fechaIso: '2026-11-20', hora24: '15:00', fechaHora: '2026-11-20 | 03:00 pm', precio: 120, notificar: true, folioPago: 'FOLIO-KENYA-8841' },
  { id: 'cita-2', titulo: 'Arreglo de Uñas Francesas', fechaIso: '2026-11-22', hora24: '11:00', fechaHora: '2026-11-22 | 11:00 am', precio: 220, notificar: true, folioPago: 'FOLIO-KENYA-9104' },
];

export const HISTORIAL_INICIAL: RegistroCompra[] = [
  {
    id: 'COMP-1001',
    folio: 'FOLIO-KENYA-8841',
    fecha: '2026-10-20',
    cliente: 'Nadia Luz Flores Veronica',
    metodoPago: 'Tarjeta Visa **** 4242',
    proveedorPago: 'Stripe Sandbox',
    estadoPago: 'EXITO',
    items: [
      { id: 'dama-1', nombre: 'Corte de cabello para dama', tipo: 'servicio', cantidad: 1, precioUnitario: 120, importe: 120 },
      { id: 'prod-1', nombre: 'Shampoo Hidratante con Keratina', tipo: 'producto', cantidad: 1, precioUnitario: 190, importe: 190 },
    ],
    subtotal: 267.24,
    iva: 42.76,
    total: 310,
  },
  {
    id: 'COMP-1002',
    folio: 'FOLIO-KENYA-9104',
    fecha: '2026-10-25',
    cliente: 'Nadia Luz Flores Veronica',
    metodoPago: 'Stripe Card **** 4242',
    proveedorPago: 'Stripe Sandbox',
    estadoPago: 'EXITO',
    items: [
      { id: 'dama-3', nombre: 'Arreglo de Uñas Francesas', tipo: 'servicio', cantidad: 1, precioUnitario: 220, importe: 220 },
    ],
    subtotal: 189.66,
    iva: 30.34,
    total: 220,
  },
];

export const PREGUNTAS_FRECUENTES = [
  { pregunta: '¿Cómo cancelo una cita?', respuesta: 'Dirígete a la sección "Calendario de citas" en el menú inferior, ubica la cita que deseas eliminar y presiona el botón "Cancelar" al menos 2 horas antes de tu horario agendado.', abierta: false },
  { pregunta: '¿Cuáles son los métodos de pago?', respuesta: 'Aceptamos tarjetas de crédito y débito mediante Stripe, transferencias SPEI y pagos en efectivo en OXXO.', abierta: false },
  { pregunta: '¿Cuál es el horario de atención?', respuesta: 'Nuestro horario para agendar citas en Estética Unisex Kenya es de 08:00 am a 06:00 pm.', abierta: false },
  { pregunta: '¿Necesitas mover tu cita?', respuesta: 'Puedes cancelar tu cita actual desde el Calendario de citas y crear una nueva con el día y hora que prefieras, o contactarnos directamente por WhatsApp.', abierta: false },
];
