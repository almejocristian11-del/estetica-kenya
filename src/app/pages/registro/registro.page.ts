import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { EsteticaService } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
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
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
  ],
})
export class RegistroPage {
  private alertService: Alert = inject(Alert);
  private esteticaService = inject(EsteticaService);
  private router = inject(Router);

  nombreUsuario = '';
  correo = '';
  telefono = '';
  fechaNacimiento = '';
  contrasena = '';
  confirmarContrasena = '';
  mostrarContrasena = false;
  mostrarConfirmar = false;

  intentoRegistro = false;

  constructor() {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  get errorNombre(): string {
    if (!this.intentoRegistro) return '';
    const limpio = this.nombreUsuario.trim();
    if (!limpio) {
      return 'El nombre completo es obligatorio.';
    }
    if (limpio.length < 3) {
      return 'Ingresa al menos 3 caracteres.';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(limpio)) {
      return 'El nombre solo debe contener letras y espacios.';
    }
    return '';
  }

  get errorCorreo(): string {
    if (!this.intentoRegistro) return '';
    const valor = this.correo.trim();
    if (!valor) {
      return 'El correo electrónico es obligatorio.';
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!regex.test(valor)) {
      return 'Ingresa un correo electrónico válido.';
    }
    if (this.esteticaService.correoYaExiste(valor)) {
      return 'Este correo ya está registrado.';
    }
    return '';
  }

  get errorTelefono(): string {
    if (!this.intentoRegistro) return '';
    const soloDigitos = this.telefono.replace(/\D/g, '');
    if (!soloDigitos) {
      return 'El número de teléfono es obligatorio.';
    }
    if (soloDigitos.length !== 10) {
      return 'El teléfono debe tener exactamente 10 dígitos.';
    }
    return '';
  }

  get errorFechaNacimiento(): string {
    if (!this.intentoRegistro) return '';
    if (!this.fechaNacimiento) {
      return 'Selecciona tu fecha de nacimiento.';
    }
    const anioNac = Number(this.fechaNacimiento.slice(0, 4));
    const anioActual = new Date().getFullYear();
    if (anioNac > anioActual - 10 || anioNac < 1920) {
      return 'Ingresa una fecha de nacimiento válida.';
    }
    return '';
  }

  formatearTelefono(event: any): void {
    const raw = String(event?.detail?.value ?? '');
    const soloDigitos = raw.replace(/\D/g, '').slice(0, 10);
    this.telefono = soloDigitos;
    if (event?.target && event.target.value !== soloDigitos) {
      event.target.value = soloDigitos;
    }
  }

  get errorContrasena(): string {
    if (!this.intentoRegistro) return '';
    if (!this.contrasena) {
      return 'La contraseña es obligatoria.';
    }
    if (this.contrasena.length < 6) {
      return 'Debe tener al menos 6 caracteres.';
    }
    return '';
  }

  get errorConfirmar(): string {
    if (!this.intentoRegistro) return '';
    if (!this.confirmarContrasena) {
      return 'Confirma tu contraseña.';
    }
    if (this.contrasena !== this.confirmarContrasena) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  }

  async crearCuenta(): Promise<void> {
    this.intentoRegistro = true;

    const primerError =
      this.errorNombre ||
      this.errorCorreo ||
      this.errorTelefono ||
      this.errorFechaNacimiento ||
      this.errorContrasena ||
      this.errorConfirmar;

    if (primerError) {
      this.alertService.alertMessage('Verifica tus datos', primerError);
      return;
    }

    const res = await this.esteticaService.registrarNuevoUsuario({
      nombreUsuario: this.nombreUsuario,
      correo: this.correo,
      telefono: this.telefono,
      fechaNacimiento: this.fechaNacimiento,
      contrasena: this.contrasena,
    });

    if (!res.ok) {
      this.alertService.alertMessage('Correo ya registrado', res.mensaje);
      return;
    }

    this.alertService.alertMessage(
      'Cuenta creada',
      'Tu cuenta se creó correctamente. Ahora inicia sesión con tu correo y contraseña.'
    );
    this.router.navigate(['/login']);
  }
}
