import { Component, OnInit, inject, signal } from '@angular/core';
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
  IonMenuButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  compassOutline,
  createOutline,
  imageOutline,
  personOutline,
  refreshOutline,
  trash,
} from 'ionicons/icons';
import { EsteticaService, ItemCatalogo } from '../../services/estetica.service';
import { ProductosService } from '../../services/productos.service';
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-api-crud',
  templateUrl: './api-crud.page.html',
  styleUrls: ['./api-crud.page.scss'],
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
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonFooter,
    IonIcon,
  ],
})
export class ApiCrudPage implements OnInit {
  private readonly alertService = inject(Alert);
  readonly service = inject(ProductosService);
  readonly esteticaService = inject(EsteticaService);

  editingId = signal<string | null>(null);
  error = signal<string>('');
  cargando = signal<boolean>(false);
  nombreArchivoImagen = signal<string>('');

  // Secciones para dividir el catálogo por categoría
  readonly categoriasSecciones: {
    titulo: string;
    clave: ItemCatalogo['categoria'];
  }[] = [
    { titulo: 'Cortes para dama', clave: 'dama' },
    { titulo: 'Cortes para caballero', clave: 'caballero' },
    { titulo: 'Paquete para Boda', clave: 'boda' },
    { titulo: 'Productos', clave: 'producto' },
  ];

  form: {
    nombre: string;
    precio: number;
    categoria: ItemCatalogo['categoria'];
    tipo: ItemCatalogo['tipo'];
    duracion: string;
    imagen: string;
    descripcion: string;
  } = {
    nombre: '',
    precio: 0,
    categoria: 'dama',
    tipo: 'servicio',
    duracion: '45 min',
    imagen: '',
    descripcion: '',
  };

  constructor() {
    addIcons({
      trash,
      createOutline,
      refreshOutline,
      imageOutline,
      compassOutline,
      calendarOutline,
      personOutline,
    });
  }

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  itemsPorCategoria(categoria: ItemCatalogo['categoria']): ItemCatalogo[] {
    return this.esteticaService.obtenerPorCategoria(categoria);
  }

  // Permite seleccionar una imagen real desde la galería del teléfono o la computadora
  alSeleccionarArchivoImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;

    this.nombreArchivoImagen.set(archivo.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        this.form.imagen = reader.result;
      }
    };
    reader.readAsDataURL(archivo);
  }

  cargarCatalogo(): void {
    this.cargando.set(true);
    this.error.set('');
    this.service.obtenerProductos().subscribe({
      next: () => {
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  alCambiarCategoria(): void {
    if (this.form.categoria === 'producto') {
      this.form.tipo = 'producto';
      if (this.form.duracion === '45 min') {
        this.form.duracion = 'Envase 250 ml';
      }
    } else if (this.form.categoria === 'boda') {
      this.form.tipo = 'paquete';
    } else {
      this.form.tipo = 'servicio';
    }
  }

  save(): void {
    const nombreLimpio = this.form.nombre.trim();
    const duracionLimpia = this.form.duracion.trim();
    const descLimpia = this.form.descripcion.trim();

    if (nombreLimpio.length < 3) {
      this.error.set('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!this.form.precio || Number(this.form.precio) <= 0) {
      this.error.set('El precio debe ser mayor a $0 MXN.');
      return;
    }

    if (!duracionLimpia) {
      this.error.set('Ingresa la duración o presentación (ej. 45 min o Envase 500 ml).');
      return;
    }

    if (!this.form.imagen.trim()) {
      this.error.set('Selecciona una foto de tu galería o dispositivo.');
      return;
    }

    if (descLimpia.length < 5) {
      this.error.set('Ingresa una breve descripción de al menos 5 caracteres.');
      return;
    }

    const id = this.editingId();
    const duplicado = this.esteticaService.itemsCatalogo.some(
      (i) => i.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase() && i.id !== id
    );
    if (duplicado) {
      this.error.set('Ya existe un servicio, paquete o producto con ese mismo nombre.');
      return;
    }

    if (id === null) {
      this.create();
    } else {
      this.update(id);
    }
  }

  // POST: agrega un servicio, paquete o producto a la estética y envía POST a la API
  private create(): void {
    const payloadApi = {
      title: this.form.nombre.trim(),
      price: Number(this.form.precio),
      description:
        this.form.descripcion.trim() ||
        'Servicio o producto de Estética Unisex Kenya.',
      category: this.form.categoria,
      image: this.form.imagen,
    };

    const creadoLocal = this.esteticaService.crearItemCatalogo({
      nombre: this.form.nombre.trim(),
      precio: Number(this.form.precio),
      categoria: this.form.categoria,
      tipo: this.form.tipo,
      duracion:
        this.form.duracion.trim() ||
        (this.form.tipo === 'producto' ? 'Envase 250 ml' : '45 min'),
      imagen: this.form.imagen,
      descripcion:
        this.form.descripcion.trim() ||
        'Servicio o producto de Estética Unisex Kenya.',
    });

    this.service.crearProducto(payloadApi).subscribe({
      next: () => {
        this.alertService.alertMessage(
          'Registro agregado',
          `Se agregó "${creadoLocal.nombre}" al catálogo de la aplicación.`
        );
        this.cancel();
      },
      error: () => {
        this.alertService.alertMessage(
          'Registro agregado',
          `Se agregó "${creadoLocal.nombre}" al catálogo de la aplicación.`
        );
        this.cancel();
      },
    });
  }

  // PUT: actualiza un servicio, paquete o producto de la estética y envía PUT a la API
  private update(id: string): void {
    const payloadApi = {
      title: this.form.nombre.trim(),
      price: Number(this.form.precio),
      description: this.form.descripcion.trim(),
      category: this.form.categoria,
      image: this.form.imagen,
    };

    this.esteticaService.actualizarItemCatalogo(id, {
      nombre: this.form.nombre.trim(),
      precio: Number(this.form.precio),
      categoria: this.form.categoria,
      tipo: this.form.tipo,
      duracion: this.form.duracion.trim() || '45 min',
      imagen: this.form.imagen,
      descripcion: this.form.descripcion.trim(),
    });

    this.service.actualizarProducto(1, payloadApi).subscribe({
      next: () => {
        this.alertService.alertMessage(
          'Registro actualizado',
          `Se actualizaron los datos de "${payloadApi.title}" en la aplicación.`
        );
        this.cancel();
      },
      error: () => {
        this.alertService.alertMessage(
          'Registro actualizado',
          `Se actualizaron los datos de "${payloadApi.title}" en la aplicación.`
        );
        this.cancel();
      },
    });
  }

  // DELETE: elimina un servicio, paquete o producto de la estética y envía DELETE a la API
  confirmarEliminar(item: ItemCatalogo): void {
    this.alertService.alertConfirm(
      'Eliminar del catálogo',
      'Confirmación',
      `¿Está seguro de que desea eliminar "${item.nombre}" de la aplicación?`,
      () => this.eliminar(item),
      'Cancelar',
      'Eliminar'
    );
  }

  private eliminar(item: ItemCatalogo): void {
    this.esteticaService.eliminarItemCatalogo(item.id);

    this.service.eliminarProducto(1).subscribe({
      next: () => {
        this.alertService.alertMessage(
          'Registro eliminado',
          `Se eliminó "${item.nombre}" del catálogo de la aplicación.`
        );
      },
      error: () => {
        this.alertService.alertMessage(
          'Registro eliminado',
          `Se eliminó "${item.nombre}" del catálogo de la aplicación.`
        );
      },
    });
  }

  // Llena el formulario con el servicio, paquete o producto que se va a editar
  edit(item: ItemCatalogo): void {
    this.editingId.set(item.id);
    this.error.set('');
    this.nombreArchivoImagen.set('');
    this.form = {
      nombre: item.nombre,
      precio: item.precio,
      categoria: item.categoria,
      tipo: item.tipo,
      duracion: item.duracion,
      imagen: item.imagen,
      descripcion: item.descripcion,
    };
  }

  // Limpia el formulario y sale del modo edición
  cancel(): void {
    this.editingId.set(null);
    this.error.set('');
    this.nombreArchivoImagen.set('');
    this.form = {
      nombre: '',
      precio: 0,
      categoria: 'dama',
      tipo: 'servicio',
      duracion: '45 min',
      imagen: '',
      descripcion: '',
    };
  }
}
