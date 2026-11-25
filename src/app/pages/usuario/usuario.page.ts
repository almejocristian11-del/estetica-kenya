import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  cardOutline,
  cartOutline,
  compassOutline,
  helpBuoyOutline,
  logOutOutline,
  personOutline,
  receiptOutline,
  serverOutline,
} from 'ionicons/icons';
import { EsteticaService, PerfilUsuario } from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
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
    IonContent,
    IonAvatar,
    IonCard,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class UsuarioPage {
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);
  private router = inject(Router);

  modoEdicion = false;
  borrador: PerfilUsuario = { ...this.esteticaService.usuario };

  constructor() {
    addIcons({
      personOutline,
      compassOutline,
      calendarOutline,
      cartOutline,
      cardOutline,
      receiptOutline,
      serverOutline,
      helpBuoyOutline,
      logOutOutline,
    });
  }

  get perfil(): PerfilUsuario {
    return this.esteticaService.usuario;
  }

  activarEdicion(): void {
    this.borrador = { ...this.esteticaService.usuario };
    this.modoEdicion = true;
  }

  guardarCambios(): void {
    const nombre = this.borrador.nombreCompleto.trim();
    const handle = this.borrador.handle.trim();
    const correo = this.borrador.correo.trim();
    const digitosTel = this.borrador.telefono.replace(/\D/g, '');

    if (!nombre || nombre.length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(nombre)) {
      this.alertService.alertMessage(
        'Nombre no válido',
        'El nombre completo debe tener al menos 3 letras y no contener números.'
      );
      return;
    }

    if (!handle || handle.length < 3) {
      this.alertService.alertMessage(
        'Usuario no válido',
        'El nombre de usuario debe tener al menos 3 caracteres.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(correo)) {
      this.alertService.alertMessage(
        'Correo no válido',
        'Ingresa un correo electrónico válido (ejemplo@dominio.com).'
      );
      return;
    }

    if (digitosTel.length !== 10) {
      this.alertService.alertMessage(
        'Teléfono no válido',
        'El número de teléfono debe tener exactamente 10 dígitos.'
      );
      return;
    }

    this.borrador.nombreCompleto = nombre;
    this.borrador.handle = handle.startsWith('@') ? handle : '@' + handle;
    this.borrador.correo = correo;

    this.esteticaService.usuario = { ...this.borrador };
    this.modoEdicion = false;
    this.alertService.alertMessage(
      'Perfil actualizado',
      'Tus datos personales se han guardado correctamente.'
    );
  }

  confirmarCerrarSesion(): void {
    this.alertService.alertConfirm(
      'Cerrar sesión',
      'Confirmación',
      '¿Está seguro de que desea cerrar su sesión actual?',
      () => this.cerrarSesion(),
      'Cancelar',
      'Salir'
    );
  }

  private cerrarSesion(): void {
    this.esteticaService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
