import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { PRODUCTOS, formatoPrecio } from '../data';
import { useApp } from '../AppContext';

const servicios = PRODUCTOS.filter((p) => p.tipo === 'servicio');
const paquetes = PRODUCTOS.filter((p) => p.tipo === 'paquete');

const NewAppointment: React.FC = () => {
  const history = useHistory();
  const [toast] = useIonToast();
  const { agregarCita, productoElegido, elegirProducto } = useApp();

  const [servicioId, setServicioId] = useState<string | undefined>();
  const [paqueteId, setPaqueteId] = useState<string | undefined>();
  const [extraId, setExtraId] = useState<string | undefined>();
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');

  // Si el usuario pulsó "Añadir a cita" desde un producto, se preselecciona.
  useEffect(() => {
    if (!productoElegido) return;
    const p = PRODUCTOS.find((x) => x.id === productoElegido);
    if (p) {
      if (p.tipo === 'servicio') setServicioId(p.id);
      else setPaqueteId(p.id);
    }
    elegirProducto(null);
  }, [productoElegido, elegirProducto]);

  const hoy = new Date().toISOString().slice(0, 10);

  const seleccion = [servicioId, paqueteId, extraId]
    .map((id) => PRODUCTOS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const total = seleccion.reduce((s, p) => s + p.precio, 0);

  const confirmar = async () => {
    if (!seleccion.length) return setError('Selecciona al menos un servicio o paquete.');
    if (!fecha) return setError('Establece la fecha de tu cita.');
    if (fecha < hoy) return setError('La fecha no puede ser anterior a hoy.');
    if (!hora) return setError('Establece la hora de tu cita.');

    agregarCita({
      titulo: seleccion.map((p) => p.nombre).join(' + '),
      fecha,
      hora,
      precio: total,
      notificar: true,
    });
    setError('');
    setServicioId(undefined);
    setPaqueteId(undefined);
    setExtraId(undefined);
    setFecha('');
    setHora('');
    await toast({ message: 'Cita creada', duration: 1800, color: 'success' });
    history.push('/app/calendario');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nueva cita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="screen">
          <label className="field-label">Seleccionar servicio o paquete</label>
          <div className="field">
            <IonSelect
              placeholder="Servicios"
              value={servicioId}
              onIonChange={(e) => setServicioId(e.detail.value)}
            >
              {servicios.map((p) => (
                <IonSelectOption key={p.id} value={p.id}>
                  {p.nombre} · {formatoPrecio(p.precio)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
          <div className="field">
            <IonSelect
              placeholder="Paquetes"
              value={paqueteId}
              onIonChange={(e) => setPaqueteId(e.detail.value)}
            >
              {paquetes.map((p) => (
                <IonSelectOption key={p.id} value={p.id}>
                  {p.nombre} · {formatoPrecio(p.precio)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <label className="field-label">¿Deseas agregar un producto?</label>
          <div className="field">
            <IonSelect
              placeholder="Agregar producto..."
              value={extraId}
              onIonChange={(e) => setExtraId(e.detail.value)}
            >
              {PRODUCTOS.map((p) => (
                <IonSelectOption key={p.id} value={p.id}>
                  {p.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <label className="field-label">Establecer fecha</label>
          <div className="field">
            <IonInput
              type="date"
              min={hoy}
              value={fecha}
              onIonInput={(e) => setFecha(String(e.detail.value ?? ''))}
            />
          </div>

          <label className="field-label">Establecer hora</label>
          <div className="field">
            <IonInput
              type="time"
              value={hora}
              onIonInput={(e) => setHora(String(e.detail.value ?? ''))}
            />
          </div>

          {seleccion.length > 0 && (
            <div className="info-row" style={{ marginTop: 8 }}>
              <b>Total estimado</b>
              <span style={{ color: '#d4a96a', fontWeight: 700 }}>{formatoPrecio(total)}</span>
            </div>
          )}

          {error && <p className="error">{error}</p>}

          <div className="center">
            <IonButton onClick={confirmar}>Confirmar</IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NewAppointment;
