import React from 'react';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { formatoCita, formatoPrecio } from '../data';
import { useApp } from '../AppContext';

const CalendarPage: React.FC = () => {
  const history = useHistory();
  const [alerta] = useIonAlert();
  const { citas, cancelarCita, alternarNotificacion } = useApp();

  const confirmarCancelar = (id: string) =>
    alerta({
      header: 'Cancelar cita',
      message: '¿Seguro que quieres cancelar esta cita?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí, cancelar', role: 'destructive', handler: () => cancelarCita(id) },
      ],
    });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calendario de citas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="screen">
          {citas.map((c) => (
            <div className="appt-card" key={c.id}>
              <h3>{c.titulo}</h3>
              <div className="when">{formatoCita(c.fecha, c.hora)}</div>
              <div className="price">{formatoPrecio(c.precio)}</div>
              <div className="appt-actions">
                <IonButton size="small" fill="outline" color="medium" onClick={() => confirmarCancelar(c.id)}>
                  Cancelar
                </IonButton>
                <label>
                  Notificar 1 día antes
                  <IonCheckbox
                    checked={c.notificar}
                    onIonChange={() => alternarNotificacion(c.id)}
                    aria-label="Notificar 1 día antes"
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="empty-card">
            <div>{citas.length ? '¿Necesitas otra cita?' : 'No tienes más citas...'}</div>
            {!citas.length && <div>¿Necesitas una?</div>}
            <IonButton fill="clear" onClick={() => history.push('/app/cita')}>
              <em>Crear cita</em>
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CalendarPage;
