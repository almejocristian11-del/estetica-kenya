import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    redirectTo: 'servicios',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./pages/servicios/servicios.page').then((m) => m.ServiciosPage),
  },
  {
    path: 'detalle-producto',
    loadComponent: () =>
      import('./pages/detalle-producto/detalle-producto.page').then(
        (m) => m.DetalleProductoPage
      ),
  },
  {
    path: 'nueva-cita',
    loadComponent: () =>
      import('./pages/nueva-cita/nueva-cita.page').then((m) => m.NuevaCitaPage),
  },
  {
    path: 'calendario-citas',
    loadComponent: () =>
      import('./pages/calendario-citas/calendario-citas.page').then(
        (m) => m.CalendarioCitasPage
      ),
  },
  {
    path: 'usuario',
    loadComponent: () =>
      import('./pages/usuario/usuario.page').then((m) => m.UsuarioPage),
  },
  {
    path: 'soporte',
    loadComponent: () =>
      import('./pages/soporte/soporte.page').then((m) => m.SoportePage),
  },
  {
    path: 'carrito',
    loadComponent: () =>
      import('./pages/carrito/carrito.page').then((m) => m.CarritoPage),
  },
  {
    path: 'metodos-pago',
    loadComponent: () =>
      import('./pages/metodos-pago/metodos-pago.page').then(
        (m) => m.MetodosPagoPage
      ),
  },
  {
    path: 'historial-compras',
    loadComponent: () =>
      import('./pages/historial-compras/historial-compras.page').then(
        (m) => m.HistorialComprasPage
      ),
  },
  {
    path: 'api-crud',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/api-crud/api-crud.page').then((m) => m.ApiCrudPage),
  },
];
