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
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline,
  calendarOutline,
  compassOutline,
  createOutline,
  personOutline,
  trash,
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';
import {
  EsteticaService,
  RegistroCompra,
} from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.page.html',
  styleUrls: ['./historial-compras.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonItemOptions,
    IonItemOption,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class HistorialComprasPage {
  // Inyectamos el servicio Alert para poder utilizarlo en la página
  private alertService: Alert = inject(Alert);
  private cdr = inject(ChangeDetectorRef);
  public esteticaService = inject(EsteticaService);

  private readonly STORAGE_KEY = 'estetica_kenya_historial_v1';

  busquedaFolioOCliente = '';
  filtroFecha = '';
  orden: 'recientes' | 'montoMayor' | 'montoMenor' = 'recientes';

  compraEditando: RegistroCompra | null = null;

  constructor() {
    addIcons({
      addOutline,
      trash,
      createOutline,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  // Carga el historial guardado al entrar a la página 
  async ionViewWillEnter() {
    console.log('ionViewWillEnter');

    const savedHistory = await Preferences.get({
      key: this.STORAGE_KEY,
    });

    if (savedHistory.value) {
      try {
        const parsed = JSON.parse(savedHistory.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.esteticaService.historialCompras = parsed;
        }
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      }

      console.log('[HISTORIAL CARGADO AL INICIAR]:');
      console.table(this.esteticaService.historialCompras);
    } else {
      console.log('[HISTORIAL]: Se utiliza el historial inicial en memoria.');
      console.table(this.esteticaService.historialCompras);
    }

    this.cdr.detectChanges();
  }

  get comprasFiltradas(): RegistroCompra[] {
    const q = this.busquedaFolioOCliente.trim().toLowerCase();
    const filtradas = this.esteticaService.historialCompras.filter((c) => {
      const coincideTexto =
        !q ||
        c.folio.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.cliente.toLowerCase().includes(q) ||
        c.items.some((i) => i.nombre.toLowerCase().includes(q));

      const coincideFecha = !this.filtroFecha || c.fecha === this.filtroFecha;
      return coincideTexto && coincideFecha;
    });

    return [...filtradas].sort((a, b) => {
      if (this.orden === 'montoMayor') return b.total - a.total;
      if (this.orden === 'montoMenor') return a.total - b.total;
      return b.fecha.localeCompare(a.fecha);
    });
  }

  get granTotalAcumulado(): number {
    return Number(
      this.comprasFiltradas
        .reduce((acc, c) => acc + c.total, 0)
        .toFixed(2)
    );
  }

  iniciarEdicion(compra: RegistroCompra): void {
    this.compraEditando = JSON.parse(JSON.stringify(compra));
  }

  recalcularItemEditado(item: RegistroCompra['items'][number]): void {
    const cantidad = Number(item.cantidad);
    if (Number.isInteger(cantidad) && cantidad >= 1) {
      item.importe = Number((item.precioUnitario * cantidad).toFixed(2));
    }
  }

  get totalEdicion(): number {
    if (!this.compraEditando) return 0;
    return Number(
      this.compraEditando.items
        .reduce((acc, it) => acc + it.precioUnitario * (Number(it.cantidad) || 0), 0)
        .toFixed(2)
    );
  }

  get subtotalEdicion(): number {
    return Number((this.totalEdicion / 1.16).toFixed(2));
  }

  get ivaEdicion(): number {
    return Number((this.totalEdicion - this.subtotalEdicion).toFixed(2));
  }

  cancelarEdicion(): void {
    this.compraEditando = null;
  }

  guardarEdicion(): void {
    if (!this.compraEditando) return;
    if (!this.compraEditando.fecha || !this.compraEditando.metodoPago.trim()) {
      this.alertService.alertMessage(
        'Datos incompletos',
        'La fecha y el método de pago no pueden quedar vacíos.'
      );
      return;
    }
    if (this.compraEditando.items.length === 0) {
      this.alertService.alertMessage(
        'Compra sin artículos',
        'El registro debe conservar al menos un artículo.'
      );
      return;
    }
    const itemInvalido = this.compraEditando.items.find(
      (it) => !Number.isInteger(Number(it.cantidad)) || Number(it.cantidad) < 1
    );
    if (itemInvalido) {
      this.alertService.alertMessage(
        'Cantidad no válida',
        `La cantidad para "${itemInvalido.nombre}" debe ser un número entero mayor o igual a 1.`
      );
      return;
    }
    this.esteticaService.actualizarCompraHistorial(this.compraEditando);
    this.alertService.alertMessage(
      'Compra actualizada',
      `El registro ${this.compraEditando.folio} se actualizó correctamente.`
    );
    this.compraEditando = null;
  }

  confirmDeleteCompra(compra: RegistroCompra): void {
    this.alertService.alertConfirm(
      'Eliminar compra',
      'Confirmación',
      `¿Está seguro de que desea eliminar el folio ${compra.folio} del historial?`,
      () => this.deleteCompra(compra.id),
      'Cancelar',
      'Eliminar'
    );
  }

  private deleteCompra(id: string): void {
    console.log('La compra a eliminar es: ', id);

    // Buscamos el índice de la compra a eliminar
    const index = this.esteticaService.historialCompras.findIndex(
      (item: RegistroCompra) => item.id === id
    );

    console.log('La compra a eliminar está en el índice: ', index);

    // Verificamos si el índice es válido antes de eliminar la compra
    if (index != -1) {
      // Eliminamos un elemento del array utilizando splice
      this.esteticaService.historialCompras.splice(index, 1);

      this.esteticaService.guardarHistorialLocal(); // Guardamos el historial

      this.cdr.markForCheck();
    }
  }
}
