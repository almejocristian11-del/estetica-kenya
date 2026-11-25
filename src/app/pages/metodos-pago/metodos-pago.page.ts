import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  cardOutline,
  compassOutline,
  personOutline,
} from 'ionicons/icons';
import {
  EsteticaService,
  RespuestaPagoSandbox,
} from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-metodos-pago',
  templateUrl: './metodos-pago.page.html',
  styleUrls: ['./metodos-pago.page.scss'],
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
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class MetodosPagoPage {
  private alertService: Alert = inject(Alert);
  private cdr = inject(ChangeDetectorRef);
  public esteticaService = inject(EsteticaService);

  pagarCon = 'Stripe';
  metodoElegido: 'tarjeta' | 'oxxo' | 'spei' = 'tarjeta';

  titular = '';
  numeroTarjeta = '';
  expiracion = '';
  cvv = '';

  procesando = false;
  reciboActual: RespuestaPagoSandbox | null = null;

  constructor() {
    addIcons({
      cardOutline,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  get hayAlgoPorPagar(): boolean {
    return (
      !!this.esteticaService.citaPendientePago ||
      this.esteticaService.carrito.length > 0
    );
  }

  get totalACobrar(): number {
    if (this.esteticaService.citaPendientePago) {
      return this.esteticaService.citaPendientePago.total;
    }
    if (this.esteticaService.carrito.length > 0) {
      return this.esteticaService.totalCarrito;
    }
    return 0;
  }

  // Agrega automáticamente un espacio cada 4 dígitos (0000 0000 0000 0000)
  formatearNumeroTarjeta(event: any): void {
    const raw = String(event?.detail?.value ?? '');
    const soloDigitos = raw.replace(/\D/g, '').slice(0, 16);
    const grupos = soloDigitos.match(/.{1,4}/g) || [];
    const formateado = grupos.join(' ');
    this.numeroTarjeta = formateado;
    if (event?.target && event.target.value !== formateado) {
      event.target.value = formateado;
    }
  }

  // Agrega automáticamente la diagonal / al escribir el mes y año (MM/AA)
  formatearExpiracion(event: any): void {
    const raw = String(event?.detail?.value ?? '');
    const soloDigitos = raw.replace(/\D/g, '').slice(0, 4);
    let formateado = soloDigitos;
    if (soloDigitos.length >= 3) {
      formateado = `${soloDigitos.slice(0, 2)}/${soloDigitos.slice(2, 4)}`;
    }
    this.expiracion = formateado;
    if (event?.target && event.target.value !== formateado) {
      event.target.value = formateado;
    }
  }

  formatearCvv(event: any): void {
    const raw = String(event?.detail?.value ?? '');
    const soloDigitos = raw.replace(/\D/g, '').slice(0, 4);
    this.cvv = soloDigitos;
    if (event?.target && event.target.value !== soloDigitos) {
      event.target.value = soloDigitos;
    }
  }

  procesarPago(): void {
    if (!this.hayAlgoPorPagar) {
      this.alertService.alertMessage(
        'Sin artículos por pagar',
        'Primero agrega un producto al carrito o selecciona una cita para pagar.'
      );
      return;
    }

    const pagandoCita = !!this.esteticaService.citaPendientePago;

    if (this.metodoElegido === 'tarjeta') {
      const titularLimpio = this.titular.trim();
      const digitos = this.numeroTarjeta.replace(/\D/g, '');
      const expLimpia = this.expiracion.trim();
      const cvvLimpio = this.cvv.trim();

      if (
        !titularLimpio ||
        titularLimpio.length < 3 ||
        !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(titularLimpio)
      ) {
        this.alertService.alertMessage(
          'Nombre del titular no válido',
          'Ingresa el nombre del titular usando únicamente letras (mínimo 3 caracteres).'
        );
        return;
      }

      if (digitos.length !== 16) {
        this.alertService.alertMessage(
          'Número de tarjeta incompleto',
          'El número de la tarjeta debe tener exactamente 16 dígitos.'
        );
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(expLimpia)) {
        this.alertService.alertMessage(
          'Vencimiento incompleto',
          'Ingresa la fecha de vencimiento en formato MM/AA (4 dígitos).'
        );
        return;
      }

      const [mesStr, anioStr] = expLimpia.split('/');
      const mes = Number(mesStr);
      const anio = Number(anioStr);
      if (mes < 1 || mes > 12) {
        this.alertService.alertMessage(
          'Mes de vencimiento no válido',
          'El mes de vencimiento debe estar entre 01 y 12.'
        );
        return;
      }

      if (anio < 26) {
        this.alertService.alertMessage(
          'Tarjeta vencida',
          'La fecha de vencimiento indica que la tarjeta ya expiró.'
        );
        return;
      }

      if (!/^\d{3,4}$/.test(cvvLimpio)) {
        this.alertService.alertMessage(
          'CVV no válido',
          'Ingresa los 3 o 4 dígitos numéricos del código de seguridad CVV.'
        );
        return;
      }
    }

    this.procesando = true;

    this.esteticaService
      .procesarPagoSandbox({
        proveedor: 'Stripe Sandbox',
        metodoElegido: this.metodoElegido,
        titular: this.titular || this.esteticaService.usuario.nombreCompleto,
        numeroTarjeta: this.numeroTarjeta || '4242424242424242',
        expiracion: this.expiracion,
        cvv: this.cvv,
      })
      .subscribe({
        next: (resp) => {
          this.procesando = false;
          this.reciboActual = resp;
          this.cdr.detectChanges();
          if (resp.estado === 'FALLO') {
            this.alertService.alertMessage(
              'Pago rechazado (Stripe)',
              resp.mensaje
            );
          } else if (pagandoCita) {
            this.alertService.alertMessage(
              resp.estado === 'PENDIENTE' ? 'Cita registrada (Pago pendiente)' : 'Cita confirmada',
              resp.estado === 'PENDIENTE'
                ? resp.mensaje
                : 'Tu pago vía Stripe se registró correctamente y tu cita ha sido agendada.'
            );
          } else {
            this.alertService.alertMessage(
              resp.estado === 'PENDIENTE' ? 'Pago pendiente (Stripe)' : 'Pago confirmado (Stripe)',
              resp.mensaje
            );
          }
        },
        error: () => {
          this.procesando = false;
          this.cdr.detectChanges();
          this.alertService.alertMessage(
            'Error al procesar',
            'No se pudo completar el pago en este momento.'
          );
        },
      });
  }
}
