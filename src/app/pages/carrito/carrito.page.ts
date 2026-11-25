import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  calendarOutline,
  compassOutline,
  personOutline,
  removeOutline,
  trash,
} from 'ionicons/icons';
import { EsteticaService } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonNote,
    IonItemOptions,
    IonItemOption,
    IonCard,
    IonCardContent,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class CarritoPage {
  // Inyectamos el servicio Alert 
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);
  private router = inject(Router);

  constructor() {
    addIcons({
      addOutline,
      removeOutline,
      trash,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  cambiarCantidad(itemId: string, delta: number): void {
    this.esteticaService.cambiarCantidadCarrito(itemId, delta);
  }

  confirmarEliminarItem(itemId: string, nombre: string): void {
    this.alertService.alertConfirm(
      'Eliminar artículo',
      'Confirmación',
      `¿Está seguro de que desea eliminar "${nombre}" del carrito?`,
      () => this.eliminarItem(itemId),
      'Cancelar',
      'Eliminar'
    );
  }

  private eliminarItem(itemId: string): void {
    console.log('El artículo a eliminar tiene id: ', itemId);
    this.esteticaService.eliminarDelCarrito(itemId);
  }

  irAPagar(): void {
    if (this.esteticaService.carrito.length === 0) {
      this.alertService.alertMessage(
        'Carrito vacío',
        'Agrega al menos un producto antes de proceder al pago.'
      );
      return;
    }
    this.esteticaService.citaPendientePago = null;
    this.router.navigate(['/metodos-pago']);
  }
}
