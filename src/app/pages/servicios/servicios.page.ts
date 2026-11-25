import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  calendarOutline,
  cartOutline,
  compassOutline,
  personOutline,
} from 'ionicons/icons';
import { EsteticaService, ItemCatalogo } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonBadge,
    IonContent,
    IonSearchbar,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonFooter,
    IonIcon,
  ],
})
export class ServiciosPage {
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);
  private router = inject(Router);

  terminoBusqueda = '';
  categoriaFiltro: 'todos' | 'dama' | 'caballero' | 'boda' | 'producto' = 'todos';
  rangoPrecio: 'todos' | 'economico' | 'medio' | 'premium' = 'todos';

  readonly secciones: {
    titulo: string;
    clave: ItemCatalogo['categoria'];
  }[] = [
    { titulo: 'Cortes para dama', clave: 'dama' },
    { titulo: 'Cortes para caballero', clave: 'caballero' },
    { titulo: 'Paquete para Boda', clave: 'boda' },
    { titulo: 'Productos', clave: 'producto' },
  ];

  constructor() {
    addIcons({
      cartOutline,
      compassOutline,
      calendarOutline,
      personOutline,
      addOutline,
    });
  }

  get seccionesVisibles() {
    if (this.categoriaFiltro === 'todos') {
      return this.secciones;
    }
    return this.secciones.filter((s) => s.clave === this.categoriaFiltro);
  }

  itemsDeSeccion(categoria: ItemCatalogo['categoria']): ItemCatalogo[] {
    const q = this.terminoBusqueda.trim().toLowerCase();
    return this.esteticaService
      .obtenerPorCategoria(categoria)
      .filter((item) => {
        const coincideTexto =
          !q ||
          item.nombre.toLowerCase().includes(q) ||
          item.descripcion.toLowerCase().includes(q);

        let coincidePrecio = true;
        if (this.rangoPrecio === 'economico') {
          coincidePrecio = item.precio <= 150;
        } else if (this.rangoPrecio === 'medio') {
          coincidePrecio = item.precio > 150 && item.precio <= 300;
        } else if (this.rangoPrecio === 'premium') {
          coincidePrecio = item.precio > 300;
        }

        return coincideTexto && coincidePrecio;
      });
  }

  abrirDetalle(item: ItemCatalogo): void {
    this.esteticaService.seleccionarItem(item);
    this.router.navigate(['/detalle-producto']);
  }

  // Solo para productos: se agregan al carrito de compras
  agregarAlCarritoRapido(item: ItemCatalogo, event: Event): void {
    event.stopPropagation();
    const ok = this.esteticaService.agregarAlCarrito(item, 1);
    if (ok) {
      this.alertService.alertMessage(
        'Producto en carrito',
        `Se agregó el producto "${item.nombre}" al carrito de compras.`
      );
    }
  }

  // Para servicios, paquetes y también productos: se agregan a una cita
  agregarACitaRapido(item: ItemCatalogo, event: Event): void {
    event.stopPropagation();
    this.esteticaService.agregarItemACita(item);
    this.router.navigate(['/nueva-cita']);
  }
}
