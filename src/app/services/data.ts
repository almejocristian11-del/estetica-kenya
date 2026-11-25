import { Injectable, inject } from '@angular/core';
import { EsteticaService } from './estetica.service';
import { ItemCatalogo, ItemCarrito, CitaAgendada } from '../models/catalogo.model';
import { RegistroCompra } from '../models/compra.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private estetica = inject(EsteticaService);

  get catalogo(): ItemCatalogo[] {
    return this.estetica.itemsCatalogo;
  }

  get carrito(): ItemCarrito[] {
    return this.estetica.carrito;
  }

  get misCitas(): CitaAgendada[] {
    return this.estetica.citas;
  }

  get historialCompras(): RegistroCompra[] {
    return this.estetica.historialCompras;
  }

  public getCatalogoPorCategoria(categoria: string): ItemCatalogo[] {
    if (categoria === 'todos' || categoria === 'Todos') {
      return this.estetica.itemsCatalogo;
    }
    return this.estetica.itemsCatalogo.filter((p) => p.categoria === categoria);
  }

  public buscarCatalogo(query: string): ItemCatalogo[] {
    return this.estetica.itemsCatalogo.filter((p) =>
      p.nombre.toLowerCase().includes(query.toLowerCase())
    );
  }

  public agregarAlCarrito(itemObj: ItemCatalogo) {
    this.estetica.agregarAlCarrito(itemObj, 1);
  }

  public obtenerTotalCarrito(): number {
    return this.estetica.totalCarrito;
  }

  public vaciarCarrito() {
    this.estetica.vaciarCarrito();
  }
}
