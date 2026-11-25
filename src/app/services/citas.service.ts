import { Injectable } from '@angular/core';
import { CitaAgendada, CitaPendientePago, ItemCatalogo } from '../models/catalogo.model';
import { CITAS_INICIALES } from '../models/catalogo.data';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  serviciosSeleccionadosCita: string[] = [];
  paquetesSeleccionadosCita: string[] = [];
  productosSeleccionadosCita: string[] = [];
  citaPendientePago: CitaPendientePago | null = null;
  citas: CitaAgendada[] = [...CITAS_INICIALES];

  agregarItemACita(item: ItemCatalogo): void {
    if (item.tipo === 'servicio' && !this.serviciosSeleccionadosCita.includes(item.id)) {
      this.serviciosSeleccionadosCita = [...this.serviciosSeleccionadosCita, item.id];
    } else if (item.tipo === 'paquete' && !this.paquetesSeleccionadosCita.includes(item.id)) {
      this.paquetesSeleccionadosCita = [...this.paquetesSeleccionadosCita, item.id];
    } else if (item.tipo === 'producto' && !this.productosSeleccionadosCita.includes(item.id)) {
      this.productosSeleccionadosCita = [...this.productosSeleccionadosCita, item.id];
    }
  }

  existeCitaEnFechaHora(fechaIso: string, hora24: string): boolean {
    return this.citas.some((c) => c.fechaIso === fechaIso && c.hora24 === hora24);
  }

  prepararCitaParaPago(cita: CitaPendientePago): void {
    this.citaPendientePago = cita;
  }

  agregarCita(nueva: Omit<CitaAgendada, 'id'>): CitaAgendada {
    const creada: CitaAgendada = { ...nueva, id: 'cita-' + Date.now() };
    this.citas.unshift(creada);
    return creada;
  }

  cancelarCita(id: string): void {
    this.citas = this.citas.filter((c) => c.id !== id);
  }

  limpiarCitaPendiente(): void {
    this.citaPendientePago = null;
    this.serviciosSeleccionadosCita = [];
    this.paquetesSeleccionadosCita = [];
    this.productosSeleccionadosCita = [];
  }
}
