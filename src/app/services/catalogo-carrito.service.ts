import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ItemCarrito, ItemCatalogo } from '../models/catalogo.model';
import { CATALOGO_INICIAL, PREGUNTAS_FRECUENTES } from '../models/catalogo.data';

@Injectable({
  providedIn: 'root',
})
export class CatalogoCarritoService {
  private readonly STORAGE_CATALOGO = 'estetica_kenya_catalogo_v1';

  itemsCatalogo: ItemCatalogo[] = [...CATALOGO_INICIAL];
  productoSeleccionado: ItemCatalogo = this.itemsCatalogo[0];
  carrito: ItemCarrito[] = [];
  readonly preguntasFrecuentes = PREGUNTAS_FRECUENTES.map((p) => ({ ...p }));

  constructor() {
    this.cargarCatalogoLocal();
  }

  private cargarCatalogoLocal(): void {
    try {
      const catRaw = localStorage.getItem(this.STORAGE_CATALOGO);
      if (catRaw) {
        const parsedCat = JSON.parse(catRaw);
        if (Array.isArray(parsedCat) && parsedCat.length > 0) {
          this.itemsCatalogo = parsedCat;
          this.productoSeleccionado = this.itemsCatalogo[0];
        }
      }
    } catch {
      // Mantiene catálogo semilla si localStorage falla
    }
  }

  guardarCatalogoLocal(): void {
    try {
      localStorage.setItem(this.STORAGE_CATALOGO, JSON.stringify(this.itemsCatalogo));
      Preferences.set({
        key: this.STORAGE_CATALOGO,
        value: JSON.stringify(this.itemsCatalogo),
      });
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  seleccionarItem(item: ItemCatalogo): void {
    this.productoSeleccionado = item;
  }

  obtenerPorCategoria(categoria: ItemCatalogo['categoria']): ItemCatalogo[] {
    return this.itemsCatalogo.filter((item) => item.categoria === categoria);
  }

  obtenerServicios(): ItemCatalogo[] {
    return this.itemsCatalogo.filter((item) => item.tipo === 'servicio');
  }

  obtenerPaquetes(): ItemCatalogo[] {
    return this.itemsCatalogo.filter((item) => item.tipo === 'paquete');
  }

  obtenerProductos(): ItemCatalogo[] {
    return this.itemsCatalogo.filter((item) => item.tipo === 'producto');
  }

  crearItemCatalogo(datos: Omit<ItemCatalogo, 'id' | 'icono'>): ItemCatalogo {
    const iconoPorTipo =
      datos.tipo === 'producto'
        ? 'water-outline'
        : datos.tipo === 'paquete'
          ? 'heart-outline'
          : 'cut-outline';

    const nuevo: ItemCatalogo = {
      ...datos,
      id: `${datos.categoria}-${Date.now()}`,
      precio: Number(datos.precio),
      icono: iconoPorTipo,
    };

    this.itemsCatalogo.unshift(nuevo);
    this.guardarCatalogoLocal();
    return nuevo;
  }

  actualizarItemCatalogo(
    id: string,
    datos: Omit<ItemCatalogo, 'id' | 'icono'>
  ): ItemCatalogo | null {
    const idx = this.itemsCatalogo.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    const actualizado: ItemCatalogo = {
      ...this.itemsCatalogo[idx],
      ...datos,
      precio: Number(datos.precio),
    };

    this.itemsCatalogo[idx] = actualizado;
    this.guardarCatalogoLocal();
    return actualizado;
  }

  eliminarItemCatalogo(id: string): void {
    const idx = this.itemsCatalogo.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.itemsCatalogo.splice(idx, 1);
      this.guardarCatalogoLocal();
    }
  }

  agregarAlCarrito(item: ItemCatalogo, cantidad = 1): boolean {
    if (item.tipo !== 'producto') return false;
    const existente = this.carrito.find((c) => c.item.id === item.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.carrito.push({ item, cantidad });
    }
    return true;
  }

  cambiarCantidadCarrito(itemId: string, delta: number): void {
    const idx = this.carrito.findIndex((c) => c.item.id === itemId);
    if (idx === -1) return;
    this.carrito[idx].cantidad += delta;
    if (this.carrito[idx].cantidad <= 0) {
      this.carrito.splice(idx, 1);
    }
  }

  eliminarDelCarrito(itemId: string): void {
    this.carrito = this.carrito.filter((c) => c.item.id !== itemId);
  }

  vaciarCarrito(): void {
    this.carrito = [];
  }

  get totalArticulosCarrito(): number {
    return this.carrito.reduce((acc, c) => acc + c.cantidad, 0);
  }

  get totalCarrito(): number {
    return Number(this.carrito.reduce((acc, c) => acc + c.item.precio * c.cantidad, 0).toFixed(2));
  }

  // El precio ya incluye el 16% de IVA; desglosamos subtotal e IVA sin aumentar el total
  get subtotalCarrito(): number {
    return Number((this.totalCarrito / 1.16).toFixed(2));
  }

  get ivaCarrito(): number {
    return Number((this.totalCarrito - this.subtotalCarrito).toFixed(2));
  }
}
