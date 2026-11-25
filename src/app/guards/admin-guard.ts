import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EsteticaService } from '../services/estetica.service';

export const adminGuard: CanActivateFn = () => {
  const esteticaService = inject(EsteticaService);
  const router = inject(Router);

  // 1) Sin sesión: al login
  if (!esteticaService.sesionActiva) {
    return router.createUrlTree(['/login']);
  }

  // 2) Con sesión y rol administrador: puede pasar
  if (esteticaService.esAdmin) {
    return true;
  }

  // 3) Con sesión pero sin permiso de administrador: a su vista de perfil
  return router.createUrlTree(['/usuario']);
};
