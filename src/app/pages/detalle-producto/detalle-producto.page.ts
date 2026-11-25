import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  cartOutline,
  compassOutline,
  personOutline,
} from 'ionicons/icons';
import { EsteticaService, ItemCatalogo } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonButton,
    IonBadge,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonFooter,
    IonIcon,
  ],
})
export class DetalleProductoPage {
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);
  private router = inject(Router);

  constructor() {
    addIcons({
      cartOutline,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  get itemActual(): ItemCatalogo {
    return this.esteticaService.productoSeleccionado;
  }

  agregarACita(): void {
    this.esteticaService.agregarItemACita(this.itemActual);
    this.router.navigate(['/nueva-cita']);
  }

  agregarAlCarrito(): void {
    if (this.itemActual.tipo !== 'producto') {
      this.alertService.alertMessage(
        'Solo en citas',
        'Los servicios y paquetes únicamente se pueden atender agendando una cita.'
      );
      return;
    }
    this.esteticaService.agregarAlCarrito(this.itemActual, 1);
    this.alertService.alertMessage(
      'Producto agregado',
      `Se agregó "${this.itemActual.nombre}" al carrito de compras.`
    );
  }
}
