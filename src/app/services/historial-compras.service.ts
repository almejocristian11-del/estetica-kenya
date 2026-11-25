import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { RegistroCompra } from '../models/compra.model';
import { HISTORIAL_INICIAL } from '../models/catalogo.data';

@Injectable({
  providedIn: 'root',
})
export class HistorialComprasService {
  private readonly STORAGE_HISTORIAL = 'estetica_kenya_historial_v1';

  historialCompras: RegistroCompra[] = [];

  constructor() {
    this.cargarHistorialLocal();
  }

  private cargarHistorialLocal(): void {
    try {
      const histRaw = localStorage.getItem(this.STORAGE_HISTORIAL);
      this.historialCompras = histRaw ? JSON.parse(histRaw) : [...HISTORIAL_INICIAL];
      if (!histRaw) {
        this.guardarHistorialLocal();
      }
    } catch {
      this.historialCompras = [...HISTORIAL_INICIAL];
    }
  }

  guardarHistorialLocal(): void {
    try {
      localStorage.setItem(this.STORAGE_HISTORIAL, JSON.stringify(this.historialCompras));
      Preferences.set({
        key: this.STORAGE_HISTORIAL,
        value: JSON.stringify(this.historialCompras),
      });
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  registrarCompraEnHistorial(nueva: Omit<RegistroCompra, 'id'>): RegistroCompra {
    const registro: RegistroCompra = {
      ...nueva,
      id: 'COMP-' + Math.floor(1000 + Math.random() * 9000),
    };
    this.historialCompras.unshift(registro);
    this.guardarHistorialLocal();
    return registro;
  }

  actualizarCompraHistorial(actualizada: RegistroCompra): void {
    const idx = this.historialCompras.findIndex((c) => c.id === actualizada.id);
    if (idx !== -1) {
      const itemsRecalculados = actualizada.items.map((it) => {
        const cantidad = Math.max(1, Math.floor(Number(it.cantidad)));
        return {
          ...it,
          cantidad,
          importe: Number((it.precioUnitario * cantidad).toFixed(2)),
        };
      });
      const total = Number(
        itemsRecalculados.reduce((acc, it) => acc + it.importe, 0).toFixed(2)
      );
      const subtotal = Number((total / 1.16).toFixed(2));
      const iva = Number((total - subtotal).toFixed(2));
      actualizada.items = itemsRecalculados;
      actualizada.total = total;
      actualizada.subtotal = subtotal;
      actualizada.iva = iva;
      this.historialCompras[idx] = { ...actualizada };
      this.guardarHistorialLocal();
    }
  }

  eliminarCompraHistorial(id: string): void {
    const index = this.historialCompras.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.historialCompras.splice(index, 1);
      this.guardarHistorialLocal();
    }
  }
}
