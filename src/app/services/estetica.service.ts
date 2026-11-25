import { Injectable, inject } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { AuthService } from './auth.service';
import { CatalogoCarritoService } from './catalogo-carrito.service';
import { CitasService } from './citas.service';
import { HistorialComprasService } from './historial-compras.service';
import { StripeApiService } from './stripe-api.service';
import {
  CitaAgendada,
  CitaPendientePago,
  ItemCarrito,
  ItemCatalogo,
} from '../models/catalogo.model';
import {
  ItemHistorialDetalle,
  PerfilUsuario,
  RegistroCompra,
  RespuestaPagoSandbox,
} from '../models/compra.model';

export {
  CitaAgendada,
  CitaPendientePago,
  ItemCarrito,
  ItemCatalogo,
} from '../models/catalogo.model';
export {
  ItemHistorialDetalle,
  PerfilUsuario,
  RegistroCompra,
  RespuestaPagoSandbox,
} from '../models/compra.model';

/**
 * Fachada y orquestador central de la estética.
 * Delega cada dominio a su servicio especializado:
 * - AuthService (usuarios, hash SHA-256, sesión y roles)
 * - CatalogoCarritoService (catálogo CRUD, carrito e IVA 16%)
 * - CitasService (agenda, disponibilidad y cita pendiente)
 * - HistorialComprasService (arreglo historial + doble persistencia)
 * - StripeApiService (pasarela de pago oficial Stripe API)
 */
@Injectable({
  providedIn: 'root',
})
export class EsteticaService {
  readonly auth = inject(AuthService);
  readonly catalogo = inject(CatalogoCarritoService);
  readonly citasService = inject(CitasService);
  readonly historialService = inject(HistorialComprasService);
  readonly stripeApi = inject(StripeApiService);

  apiUrl = 'https://fakestoreapi.com/products';
  ultimoReciboPago: RespuestaPagoSandbox | null = null;

  // --- Delegación: Autenticación (AuthService) ---
  get usuario(): PerfilUsuario { return this.auth.usuario; }
  set usuario(v: PerfilUsuario) { this.auth.usuario = v; }
  get usuarioAdmin(): PerfilUsuario { return this.auth.usuarioAdmin; }
  get usuariosRegistrados(): PerfilUsuario[] { return this.auth.usuariosRegistrados; }
  set usuariosRegistrados(v: PerfilUsuario[]) { this.auth.usuariosRegistrados = v; }
  get sesionActiva(): boolean { return this.auth.sesionActiva; }
  set sesionActiva(v: boolean) { this.auth.sesionActiva = v; }
  get tokenSesion(): string { return this.auth.tokenSesion; }
  set tokenSesion(v: string) { this.auth.tokenSesion = v; }
  get esAdmin(): boolean { return this.auth.esAdmin; }

  generarHashPassword(password: string) { return this.auth.generarHashPassword(password); }
  correoYaExiste(correo: string) { return this.auth.correoYaExiste(correo); }
  registrarNuevoUsuario(datos: Parameters<AuthService['registrarNuevoUsuario']>[0]) {
    return this.auth.registrarNuevoUsuario(datos);
  }
  autenticarUsuario(id: string, pass: string) { return this.auth.autenticarUsuario(id, pass); }
  cerrarSesion(): void { this.auth.cerrarSesion(); }

  // --- Delegación: Catálogo y Carrito (CatalogoCarritoService) ---
  get itemsCatalogo(): ItemCatalogo[] { return this.catalogo.itemsCatalogo; }
  set itemsCatalogo(v: ItemCatalogo[]) { this.catalogo.itemsCatalogo = v; }
  get productoSeleccionado(): ItemCatalogo { return this.catalogo.productoSeleccionado; }
  set productoSeleccionado(v: ItemCatalogo) { this.catalogo.productoSeleccionado = v; }
  get carrito(): ItemCarrito[] { return this.catalogo.carrito; }
  set carrito(v: ItemCarrito[]) { this.catalogo.carrito = v; }
  get preguntasFrecuentes() { return this.catalogo.preguntasFrecuentes; }
  get totalArticulosCarrito(): number { return this.catalogo.totalArticulosCarrito; }
  get totalCarrito(): number { return this.catalogo.totalCarrito; }
  get subtotalCarrito(): number { return this.catalogo.subtotalCarrito; }
  get ivaCarrito(): number { return this.catalogo.ivaCarrito; }

  guardarCatalogoLocal(): void { this.catalogo.guardarCatalogoLocal(); }
  seleccionarItem(item: ItemCatalogo): void { this.catalogo.seleccionarItem(item); }
  obtenerPorCategoria(cat: ItemCatalogo['categoria']) { return this.catalogo.obtenerPorCategoria(cat); }
  obtenerServicios() { return this.catalogo.obtenerServicios(); }
  obtenerPaquetes() { return this.catalogo.obtenerPaquetes(); }
  obtenerProductos() { return this.catalogo.obtenerProductos(); }
  crearItemCatalogo(datos: Omit<ItemCatalogo, 'id' | 'icono'>) { return this.catalogo.crearItemCatalogo(datos); }
  actualizarItemCatalogo(id: string, datos: Omit<ItemCatalogo, 'id' | 'icono'>) {
    return this.catalogo.actualizarItemCatalogo(id, datos);
  }
  eliminarItemCatalogo(id: string): void { this.catalogo.eliminarItemCatalogo(id); }
  agregarAlCarrito(item: ItemCatalogo, cantidad = 1) { return this.catalogo.agregarAlCarrito(item, cantidad); }
  cambiarCantidadCarrito(itemId: string, delta: number): void { this.catalogo.cambiarCantidadCarrito(itemId, delta); }
  eliminarDelCarrito(itemId: string): void { this.catalogo.eliminarDelCarrito(itemId); }
  vaciarCarrito(): void { this.catalogo.vaciarCarrito(); }

  // --- Delegación: Citas (CitasService) ---
  get citas(): CitaAgendada[] { return this.citasService.citas; }
  set citas(v: CitaAgendada[]) { this.citasService.citas = v; }
  get citaPendientePago(): CitaPendientePago | null { return this.citasService.citaPendientePago; }
  set citaPendientePago(v: CitaPendientePago | null) { this.citasService.citaPendientePago = v; }
  get serviciosSeleccionadosCita(): string[] { return this.citasService.serviciosSeleccionadosCita; }
  set serviciosSeleccionadosCita(v: string[]) { this.citasService.serviciosSeleccionadosCita = v; }
  get paquetesSeleccionadosCita(): string[] { return this.citasService.paquetesSeleccionadosCita; }
  set paquetesSeleccionadosCita(v: string[]) { this.citasService.paquetesSeleccionadosCita = v; }
  get productosSeleccionadosCita(): string[] { return this.citasService.productosSeleccionadosCita; }
  set productosSeleccionadosCita(v: string[]) { this.citasService.productosSeleccionadosCita = v; }

  agregarItemACita(item: ItemCatalogo): void { this.citasService.agregarItemACita(item); }
  existeCitaEnFechaHora(fechaIso: string, hora24: string) {
    return this.citasService.existeCitaEnFechaHora(fechaIso, hora24);
  }
  prepararCitaParaPago(cita: CitaPendientePago): void { this.citasService.prepararCitaParaPago(cita); }
  agregarCita(nueva: Omit<CitaAgendada, 'id'>) { return this.citasService.agregarCita(nueva); }
  cancelarCita(id: string): void { this.citasService.cancelarCita(id); }

  // --- Delegación: Historial de Compras (HistorialComprasService) ---
  get historialCompras(): RegistroCompra[] { return this.historialService.historialCompras; }
  set historialCompras(v: RegistroCompra[]) { this.historialService.historialCompras = v; }

  guardarHistorialLocal(): void { this.historialService.guardarHistorialLocal(); }
  registrarCompraEnHistorial(nueva: Omit<RegistroCompra, 'id'>) {
    return this.historialService.registrarCompraEnHistorial(nueva);
  }
  actualizarCompraHistorial(actualizada: RegistroCompra): void {
    this.historialService.actualizarCompraHistorial(actualizada);
  }
  eliminarCompraHistorial(id: string): void {
    this.historialService.eliminarCompraHistorial(id);
  }

  // --- Orquestación de Pagos (StripeApiService + Citas + Historial + Carrito) ---
  procesarPagoSandbox(datosPago: {
    proveedor: 'Stripe Sandbox';
    metodoElegido?: 'tarjeta' | 'oxxo' | 'spei';
    numeroTarjeta: string;
    titular: string;
    expiracion: string;
    cvv: string;
  }): Observable<RespuestaPagoSandbox> {
    const limpia = datosPago.numeroTarjeta.replace(/\s+/g, '');
    const ultimos4 = limpia.slice(-4) || '4242';
    const folio = 'FOLIO-KENYA-' + Math.floor(1000 + Math.random() * 9000);
    const metodo = datosPago.metodoElegido || 'tarjeta';

    const etiquetaMetodo =
      metodo === 'oxxo'
        ? 'Efectivo en OXXO (Stripe)'
        : metodo === 'spei'
          ? 'Transferencia SPEI (Stripe)'
          : `Stripe Card **** ${ultimos4}`;

    const montoTotalCobrar = this.citaPendientePago
      ? this.citaPendientePago.total
      : this.totalCarrito;

    const descripcion = this.citaPendientePago
      ? `Cita Estética Unisex Kenya - ${this.citaPendientePago.titulo}`
      : `Compra Estética Unisex Kenya - ${datosPago.titular || this.usuario.nombreCompleto}`;

    return from(
      this.stripeApi.crearIntentoPago(
        montoTotalCobrar,
        descripcion,
        datosPago.numeroTarjeta,
        datosPago.titular,
        metodo
      )
    ).pipe(
      map((stripeResp) => {
        const res: RespuestaPagoSandbox = {
          ok: stripeResp.exito,
          estado: stripeResp.estadoApp,
          estadoStripe: stripeResp.estadoStripe,
          folio,
          proveedor: 'Stripe Sandbox',
          transaccionId: stripeResp.idTransaccion || 'pi_failed_' + Date.now(),
          metodoElegido: etiquetaMetodo,
          referenciaOxxoSpei: stripeResp.referenciaOxxoSpei,
          fechaIso: new Date().toISOString().slice(0, 10),
          mensaje: stripeResp.mensaje,
          ultimos4,
          total: montoTotalCobrar,
        };

        this.ultimoReciboPago = res;

        if (this.citaPendientePago) {
          if (res.estado !== 'FALLO') {
            const citaPend = this.citaPendientePago;
            this.citasService.agregarCita({
              titulo: citaPend.titulo,
              fechaIso: citaPend.fechaIso,
              hora24: citaPend.hora24,
              fechaHora: citaPend.fechaHora,
              precio: citaPend.total,
              notificar: citaPend.notificar,
              items: citaPend.items,
              folioPago: res.folio,
            });

            this.historialService.registrarCompraEnHistorial({
              folio: res.folio,
              fecha: citaPend.fechaIso || res.fechaIso,
              cliente: datosPago.titular || this.usuario.nombreCompleto,
              metodoPago: `${etiquetaMetodo} (${res.transaccionId}) - Cita ${citaPend.fechaHora}`,
              proveedorPago: 'Stripe Sandbox',
              estadoPago: res.estado,
              items: citaPend.items,
              subtotal: citaPend.subtotal,
              iva: citaPend.iva,
              total: citaPend.total,
            });

            this.citasService.limpiarCitaPendiente();
          }
          return res;
        }

        if (res.estado !== 'FALLO' && this.carrito.length > 0) {
          const itemsDetalle: ItemHistorialDetalle[] = this.carrito.map((c) => ({
            id: c.item.id,
            nombre: c.item.nombre,
            tipo: c.item.tipo,
            cantidad: c.cantidad,
            precioUnitario: c.item.precio,
            importe: Number((c.item.precio * c.cantidad).toFixed(2)),
          }));

          this.historialService.registrarCompraEnHistorial({
            folio: res.folio,
            fecha: res.fechaIso,
            cliente: datosPago.titular || this.usuario.nombreCompleto,
            metodoPago: `${etiquetaMetodo} (${res.transaccionId})`,
            proveedorPago: 'Stripe Sandbox',
            estadoPago: res.estado,
            items: itemsDetalle,
            subtotal: this.subtotalCarrito,
            iva: this.ivaCarrito,
            total: this.totalCarrito,
          });

          if (res.estado === 'EXITO') {
            this.catalogo.vaciarCarrito();
          }
        }
        return res;
      })
    );
  }
}
