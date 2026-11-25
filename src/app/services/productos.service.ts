import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, ProductoInput } from '../models/producto.model';
import { EsteticaService } from './estetica.service';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly http = inject(HttpClient);
  private readonly esteticaService = inject(EsteticaService);
  readonly apiUrl = environment.apiUrl;

  private obtenerHeaders(): HttpHeaders {
    const token = this.esteticaService.tokenSesion;
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  // GET: Obtener productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, { headers: this.obtenerHeaders() });
  }

  // POST: Crear producto
  crearProducto(producto: ProductoInput): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto, { headers: this.obtenerHeaders() });
  }

  // PUT: Actualizar producto
  actualizarProducto(id: number, producto: ProductoInput): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, { headers: this.obtenerHeaders() });
  }

  // DELETE: Eliminar producto
  eliminarProducto(id: number): Observable<Producto> {
    return this.http.delete<Producto>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  // GET: Obtener categorías
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`, { headers: this.obtenerHeaders() });
  }
}
