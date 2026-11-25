import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
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
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  calendarOutline,
  compassOutline,
  personOutline,
  trash,
} from 'ionicons/icons';
import { CitaAgendada, EsteticaService } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-calendario-citas',
  templateUrl: './calendario-citas.page.html',
  styleUrls: ['./calendario-citas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class CalendarioCitasPage {
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);

  constructor() {
    addIcons({
      addOutline,
      trash,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  get citasAgendadas(): CitaAgendada[] {
    return this.esteticaService.citas;
  }

  confirmarCancelarCita(cita: CitaAgendada): void {
    this.alertService.alertConfirm(
      'Cancelar cita',
      'Confirmación',
      `¿Está seguro de que desea cancelar la cita de "${cita.titulo}"?`,
      () => this.cancelarCita(cita.id),
      'No',
      'Cancelar cita'
    );
  }

  private cancelarCita(id: string): void {
    this.esteticaService.cancelarCita(id);
  }
}
