import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  IonLabel,
  IonList,
  IonListHeader,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  callOutline,
  compassOutline,
  logoWhatsapp,
  mailOutline,
  personOutline,
} from 'ionicons/icons';
import { EsteticaService } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: ['./soporte.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonCard,
    IonCardContent,
    IonTextarea,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class SoportePage {
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);

  descripcionProblema = '';

  constructor() {
    addIcons({
      logoWhatsapp,
      mailOutline,
      callOutline,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  alternarPregunta(idx: number): void {
    this.esteticaService.preguntasFrecuentes[idx].abierta =
      !this.esteticaService.preguntasFrecuentes[idx].abierta;
  }

  enviarReporte(): void {
    if (!this.descripcionProblema.trim()) {
      this.alertService.alertMessage(
        'Campo vacío',
        'Por favor describe tu problema antes de enviar el reporte.'
      );
      return;
    }

    this.descripcionProblema = '';
    this.alertService.alertMessage(
      'Reporte enviado',
      'Tu mensaje ha sido enviado al equipo de soporte de Estética Unisex Kenya.'
    );
  }
}
