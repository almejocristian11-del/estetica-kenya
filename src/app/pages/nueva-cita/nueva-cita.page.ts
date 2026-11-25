import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
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
  timeOutline,
} from 'ionicons/icons';
import {
  EsteticaService,
  ItemCatalogo,
  ItemHistorialDetalle,
} from '../../services/estetica.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-nueva-cita',
  templateUrl: './nueva-cita.page.html',
  styleUrls: ['./nueva-cita.page.scss'],
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
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonCheckbox,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class NuevaCitaPage implements OnInit {
  private alertService: Alert = inject(Alert);
  public esteticaService = inject(EsteticaService);
  private router = inject(Router);

  serviciosLista: ItemCatalogo[] = [];
  paquetesLista: ItemCatalogo[] = [];
  productosLista: ItemCatalogo[] = [];

  fechaMinimaHoy = '';
  fechaSeleccionada = '';
  horaSeleccionada = '10:00';
  notificarHoraAntes = true;

  mostrarCalendario = false;
  mostrarRelojExacto = false;

  diasRapidos: {
    fechaIso: string;
    diaSemana: string;
    numeroDia: string;
    mesCorto: string;
  }[] = [];

  readonly horariosDisponibles: { hora24: string; etiqueta: string }[] = [
    { hora24: '08:00', etiqueta: '08:00 am' },
    { hora24: '09:00', etiqueta: '09:00 am' },
    { hora24: '10:00', etiqueta: '10:00 am' },
    { hora24: '11:00', etiqueta: '11:00 am' },
    { hora24: '12:00', etiqueta: '12:00 pm' },
    { hora24: '13:00', etiqueta: '01:00 pm' },
    { hora24: '14:00', etiqueta: '02:00 pm' },
    { hora24: '15:00', etiqueta: '03:00 pm' },
    { hora24: '16:00', etiqueta: '04:00 pm' },
    { hora24: '17:00', etiqueta: '05:00 pm' },
    { hora24: '18:00', etiqueta: '06:00 pm' },
  ];

  constructor() {
    addIcons({
      compassOutline,
      calendarOutline,
      personOutline,
      timeOutline,
      cardOutline,
    });
  }

  ngOnInit(): void {
    this.serviciosLista = this.esteticaService.obtenerServicios();
    this.paquetesLista = this.esteticaService.obtenerPaquetes();
    this.productosLista = this.esteticaService.obtenerProductos();

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    this.fechaMinimaHoy = `${yyyy}-${mm}-${dd}`;
    this.fechaSeleccionada = `${yyyy}-${mm}-${dd}`;
    this.horaSeleccionada = '10:00';

    this.generarDiasRapidos(hoy);
  }

  private generarDiasRapidos(base: Date): void {
    const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const nombresMes = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
    ];
    this.diasRapidos = [];

    for (let i = 0; i < 10; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      this.diasRapidos.push({
        fechaIso: `${yyyy}-${mm}-${dd}`,
        diaSemana: i === 0 ? 'Hoy' : nombresDias[d.getDay()],
        numeroDia: dd,
        mesCorto: nombresMes[d.getMonth()],
      });
    }
  }

  seleccionarDiaRapido(fechaIso: string): void {
    this.fechaSeleccionada = fechaIso;
    this.mostrarCalendario = false;
  }

  alCambiarFechaCalendario(): void {
    this.mostrarCalendario = false;
  }

  seleccionarHorarioChip(hora24: string): void {
    if (this.estaOcupadoHorario(hora24)) return;
    this.horaSeleccionada = hora24;
    this.mostrarRelojExacto = false;
  }

  estaOcupadoHorario(hora24: string): boolean {
    return this.esteticaService.existeCitaEnFechaHora(
      this.fechaIsoExtraida,
      hora24
    );
  }

  get fechaLegible(): string {
    const iso = this.fechaIsoExtraida;
    const partes = iso.split('-').map(Number);
    if (partes.length !== 3) return iso;
    const d = new Date(partes[0], partes[1] - 1, partes[2]);
    const dias = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles',
      'Jueves', 'Viernes', 'Sábado',
    ];
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];
    return `${dias[d.getDay()]} ${partes[2]} de ${meses[d.getMonth()]} de ${partes[0]}`;
  }

  get itemsSeleccionadosDetalle(): ItemHistorialDetalle[] {
    const ids = [
      ...this.esteticaService.serviciosSeleccionadosCita,
      ...this.esteticaService.paquetesSeleccionadosCita,
      ...this.esteticaService.productosSeleccionadosCita,
    ];
    return ids
      .map((id) => this.esteticaService.itemsCatalogo.find((i) => i.id === id))
      .filter((i): i is ItemCatalogo => !!i)
      .map((item) => ({
        id: item.id,
        nombre: item.nombre,
        tipo: item.tipo,
        cantidad: 1,
        precioUnitario: item.precio,
        importe: item.precio,
      }));
  }

  get totalCita(): number {
    return Number(
      this.itemsSeleccionadosDetalle
        .reduce((acc, it) => acc + it.importe, 0)
        .toFixed(2)
    );
  }

  get subtotalCita(): number {
    return Number((this.totalCita / 1.16).toFixed(2));
  }

  get ivaCita(): number {
    return Number((this.totalCita - this.subtotalCita).toFixed(2));
  }

  get fechaIsoExtraida(): string {
    if (!this.fechaSeleccionada) return this.fechaMinimaHoy;
    return this.fechaSeleccionada.slice(0, 10);
  }

  get hora24Extraida(): string {
    if (!this.horaSeleccionada) return '10:00';
    const match = this.horaSeleccionada.match(/T(\d{2}):(\d{2})/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }
    if (/^\d{2}:\d{2}/.test(this.horaSeleccionada)) {
      return this.horaSeleccionada.slice(0, 5);
    }
    return '10:00';
  }

  get hora12Legible(): string {
    const [hhStr, mmStr] = this.hora24Extraida.split(':');
    const hh = Number(hhStr);
    const sufijo = hh >= 12 ? 'pm' : 'am';
    const hh12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${String(hh12).padStart(2, '0')}:${mmStr} ${sufijo}`;
  }

  get tieneServicioOPaqueteSeleccionado(): boolean {
    return (
      this.esteticaService.serviciosSeleccionadosCita.length > 0 ||
      this.esteticaService.paquetesSeleccionadosCita.length > 0
    );
  }

  get soloTieneProductosSeleccionados(): boolean {
    return (
      !this.tieneServicioOPaqueteSeleccionado &&
      this.esteticaService.productosSeleccionadosCita.length > 0
    );
  }

  quitarItemDeCita(id: string): void {
    this.esteticaService.serviciosSeleccionadosCita =
      this.esteticaService.serviciosSeleccionadosCita.filter((i) => i !== id);
    this.esteticaService.paquetesSeleccionadosCita =
      this.esteticaService.paquetesSeleccionadosCita.filter((i) => i !== id);
    this.esteticaService.productosSeleccionadosCita =
      this.esteticaService.productosSeleccionadosCita.filter((i) => i !== id);
  }

  procederAlPagoDeCita(): void {
    const totalSeleccionados =
      this.esteticaService.serviciosSeleccionadosCita.length +
      this.esteticaService.paquetesSeleccionadosCita.length +
      this.esteticaService.productosSeleccionadosCita.length;

    // Validación 1: No hay nada seleccionado
    if (totalSeleccionados === 0) {
      this.alertService.alertMessage(
        'Cita sin servicios',
        'Debes seleccionar al menos un servicio o paquete para poder agendar una cita.'
      );
      return;
    }

    // Validación 2: Solo seleccionó productos sin ningún servicio ni paquete
    if (this.soloTieneProductosSeleccionados) {
      this.alertService.alertMessage(
        'Falta elegir un servicio o paquete',
        'No puedes agendar una cita únicamente con productos. Agrega al menos un servicio o paquete a tu cita, o compra los productos desde el carrito de compras.'
      );
      return;
    }

    const fechaIso = this.fechaIsoExtraida;
    if (fechaIso < this.fechaMinimaHoy) {
      this.alertService.alertMessage(
        'Fecha no válida',
        'No puedes seleccionar una fecha anterior al día de hoy.'
      );
      return;
    }

    const hora24 = this.hora24Extraida;
    const [hh, mm] = hora24.split(':').map(Number);
    const minutosDesdeMedianoche = hh * 60 + mm;
    const min8am = 8 * 60;
    const max6pm = 18 * 60;

    if (minutosDesdeMedianoche < min8am || minutosDesdeMedianoche > max6pm) {
      this.alertService.alertMessage(
        'Horario fuera de servicio',
        'Solamente se pueden agendar citas entre las 08:00 am y las 06:00 pm.'
      );
      return;
    }

    if (this.esteticaService.existeCitaEnFechaHora(fechaIso, hora24)) {
      this.alertService.alertMessage(
        'Horario ocupado',
        `Ya existe una cita agendada para el día ${fechaIso} a las ${this.hora12Legible}. Por favor selecciona otra hora o fecha.`
      );
      return;
    }

    const nombres = this.itemsSeleccionadosDetalle.map((i) => i.nombre);
    const tituloResumen =
      nombres.length === 1
        ? nombres[0]
        : `${nombres[0]} (+${nombres.length - 1} más)`;

    this.esteticaService.prepararCitaParaPago({
      titulo: tituloResumen,
      fechaIso,
      hora24,
      fechaHora: `${fechaIso} | ${this.hora12Legible}`,
      notificar: this.notificarHoraAntes,
      items: this.itemsSeleccionadosDetalle,
      subtotal: this.subtotalCita,
      iva: this.ivaCita,
      total: this.totalCita,
    });

    this.router.navigate(['/metodos-pago']);
  }
}
