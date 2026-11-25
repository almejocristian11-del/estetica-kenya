import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonText,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  personOutline,
} from 'ionicons/icons';
import { EsteticaService } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonText,
  ],
})
export class LoginPage {
  // Inyectamos el servicio Alert 
  private alertService: Alert = inject(Alert);
  private esteticaService = inject(EsteticaService);
  private router = inject(Router);

  usuarioOEmail = '';
  contrasena = '';
  mostrarContrasena = false;
  intentoEnvio = false;

  constructor() {
    addIcons({
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
    });
  }

  get errorUsuario(): string {
    if (!this.intentoEnvio) return '';
    const valor = this.usuarioOEmail.trim();
    if (!valor) {
      return 'El usuario o correo electrónico es obligatorio.';
    }
    if (valor.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(valor)) {
        return 'Ingresa un formato de correo válido (ejemplo@dominio.com).';
      }
    } else if (valor.length < 3) {
      return 'El nombre de usuario debe tener al menos 3 caracteres.';
    }
    return '';
  }

  get errorContrasena(): string {
    if (!this.intentoEnvio) return '';
    if (!this.contrasena) {
      return 'Ingresa tu contraseña para continuar.';
    }
    if (this.contrasena.length < 6) {
      return 'La contraseña debe tener mínimo 6 caracteres.';
    }
    return '';
  }

  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async iniciarSesion(): Promise<void> {
    this.intentoEnvio = true;

    if (this.errorUsuario || this.errorContrasena) {
      this.alertService.alertMessage(
        'Datos incompletos',
        this.errorUsuario || this.errorContrasena
      );
      return;
    }

    const res = await this.esteticaService.autenticarUsuario(
      this.usuarioOEmail,
      this.contrasena
    );

    if (!res.ok) {
      this.alertService.alertMessage('Inicio de sesión', res.mensaje);
      return;
    }

    this.router.navigate(['/servicios']);
  }

  recuperarContrasena(): void {
    const correo = this.usuarioOEmail.trim();
    if (!correo) {
      this.alertService.alertMessage(
        'Recuperar contraseña',
        'Escribe primero tu usuario o correo electrónico para enviarte las instrucciones de recuperación.'
      );
      return;
    }

    this.alertService.alertMessage(
      'Recuperar contraseña',
      `Se enviaron las instrucciones para restablecer tu contraseña a la cuenta asociada con "${correo}".`
    );
  }
}
