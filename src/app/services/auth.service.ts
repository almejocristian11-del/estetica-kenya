import { Injectable } from '@angular/core';
import { PerfilUsuario } from '../models/compra.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_USUARIOS = 'estetica_kenya_usuarios_v1';
  private readonly STORAGE_SESION = 'estetica_kenya_sesion_v1';

  tokenSesion = '';
  sesionActiva = false;

  usuario: PerfilUsuario = {
    id: 'usr-1',
    nombreCompleto: 'Nadia Luz Flores Veronica',
    handle: '@NADI4LU7',
    correo: 'nadialuzyt@gmail.com',
    telefono: '271-123-4567',
    fechaNacimiento: '15/Mayo/2004',
    passwordHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    rol: 'cliente',
  };

  readonly usuarioAdmin: PerfilUsuario = {
    id: 'usr-admin',
    nombreCompleto: 'Administrador Estética Kenya',
    handle: '@ADMIN',
    correo: 'admin@esteticakenya.com',
    telefono: '271-999-0000',
    fechaNacimiento: '01/Enero/2000',
    passwordHash: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    rol: 'admin',
  };

  usuariosRegistrados: PerfilUsuario[] = [this.usuario, this.usuarioAdmin];

  constructor() {
    this.cargarAuthLocal();
  }

  get esAdmin(): boolean {
    return this.sesionActiva && this.usuario.rol === 'admin';
  }

  private cargarAuthLocal(): void {
    try {
      const usrRaw = localStorage.getItem(this.STORAGE_USUARIOS);
      if (usrRaw) {
        this.usuariosRegistrados = JSON.parse(usrRaw);
        if (!this.usuariosRegistrados.some((u) => u.rol === 'admin')) {
          this.usuariosRegistrados.push(this.usuarioAdmin);
        }
      } else {
        localStorage.setItem(this.STORAGE_USUARIOS, JSON.stringify(this.usuariosRegistrados));
      }

      const sesionRaw = localStorage.getItem(this.STORAGE_SESION);
      if (sesionRaw) {
        const data = JSON.parse(sesionRaw);
        this.usuario = data.usuario || this.usuario;
        this.tokenSesion = data.token || '';
        this.sesionActiva = true;
      }
    } catch {
      // Mantiene estado inicial si localStorage falla
    }
  }

  async generarHashPassword(password: string): Promise<string> {
    try {
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        const data = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }
    } catch {
      // Fallback si crypto.subtle no está disponible
    }
    return btoa(password);
  }

  correoYaExiste(correo: string): boolean {
    const limpio = correo.trim().toLowerCase();
    return this.usuariosRegistrados.some((u) => u.correo.trim().toLowerCase() === limpio);
  }

  async registrarNuevoUsuario(datos: {
    nombreUsuario: string;
    correo: string;
    telefono: string;
    fechaNacimiento: string;
    contrasena: string;
  }): Promise<{ ok: boolean; mensaje: string; hash?: string }> {
    const correoLimpio = datos.correo.trim().toLowerCase();
    if (this.correoYaExiste(correoLimpio)) {
      return { ok: false, mensaje: 'Este correo electrónico ya está registrado.' };
    }

    const passwordHash = await this.generarHashPassword(datos.contrasena);
    const nuevo: PerfilUsuario = {
      id: 'usr-' + Date.now(),
      nombreCompleto: datos.nombreUsuario.trim(),
      handle: '@' + datos.nombreUsuario.trim().replace(/\s+/g, '').toUpperCase().slice(0, 12),
      correo: correoLimpio,
      telefono: datos.telefono.trim(),
      fechaNacimiento: datos.fechaNacimiento,
      passwordHash,
      rol: 'cliente',
    };

    this.usuariosRegistrados.push(nuevo);
    this.sesionActiva = false;
    this.tokenSesion = '';

    try {
      localStorage.setItem(this.STORAGE_USUARIOS, JSON.stringify(this.usuariosRegistrados));
      localStorage.removeItem(this.STORAGE_SESION);
    } catch {}

    return {
      ok: true,
      mensaje: 'Tu cuenta ha sido creada correctamente. Ahora inicia sesión con tus datos.',
      hash: passwordHash,
    };
  }

  async autenticarUsuario(
    identificador: string,
    contrasena: string
  ): Promise<{ ok: boolean; mensaje: string; token?: string }> {
    const idLimpio = identificador.trim().toLowerCase();
    const passLimpia = contrasena.trim();

    if (
      idLimpio === 'admin' ||
      idLimpio === '@admin' ||
      idLimpio === 'admin@esteticakenya.com' ||
      idLimpio === 'johnd'
    ) {
      if (passLimpia === '123456' || passLimpia === 'admin123' || passLimpia === 'm38rmF$') {
        this.usuario = { ...this.usuarioAdmin };
        this.sesionActiva = true;
        this.tokenSesion = 'token-admin-' + Date.now();
        try {
          localStorage.setItem(
            this.STORAGE_SESION,
            JSON.stringify({ usuario: this.usuario, token: this.tokenSesion })
          );
        } catch {}
        return {
          ok: true,
          mensaje: 'Sesión iniciada como Administrador.',
          token: this.tokenSesion,
        };
      }
      return { ok: false, mensaje: 'La contraseña de administrador es incorrecta.' };
    }

    const passwordHash = await this.generarHashPassword(contrasena);

    const encontrado = this.usuariosRegistrados.find(
      (u) =>
        u.correo.toLowerCase() === idLimpio ||
        u.handle.toLowerCase() === idLimpio ||
        u.handle.toLowerCase() === '@' + idLimpio ||
        u.nombreCompleto.toLowerCase() === idLimpio
    );

    if (!encontrado) {
      return { ok: false, mensaje: 'No encontramos una cuenta con ese usuario o correo.' };
    }

    if (encontrado.passwordHash && encontrado.passwordHash !== passwordHash) {
      return { ok: false, mensaje: 'La contraseña ingresada es incorrecta.' };
    }

    this.usuario = encontrado;
    this.sesionActiva = true;
    this.tokenSesion = 'token-' + Date.now();

    try {
      localStorage.setItem(
        this.STORAGE_SESION,
        JSON.stringify({ usuario: this.usuario, token: this.tokenSesion })
      );
    } catch {}

    return { ok: true, mensaje: 'Sesión iniciada correctamente.', token: this.tokenSesion };
  }

  cerrarSesion(): void {
    this.sesionActiva = false;
    this.tokenSesion = '';
    try {
      localStorage.removeItem(this.STORAGE_SESION);
    } catch {}
  }
}
