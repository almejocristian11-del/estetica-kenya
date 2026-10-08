import React from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personOutline } from 'ionicons/icons';
import { useApp } from '../AppContext';

const Profile: React.FC = () => {
  const history = useHistory();
  const { sesion, salir } = useApp();

  const cerrarSesion = () => {
    salir();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="screen center">
          <div className="avatar">
            <IonIcon icon={personOutline} />
          </div>
          <h2 style={{ margin: 0, fontSize: 20 }}>{sesion?.nombre}</h2>
          <div style={{ color: '#8fa1b3', marginBottom: 12 }}>@{sesion?.usuario}</div>

          <div className="divider-title">Información de perfil</div>

          <div className="info-row">
            <b>Correo electrónico:</b>
            <span>{sesion?.correo}</span>
          </div>
          <div className="info-row">
            <b>Número de teléfono:</b>
            <span>{sesion?.telefono}</span>
          </div>

          <p style={{ marginTop: 24, fontWeight: 600 }}>¿Necesitas ayuda en algo más?</p>
          <IonButton fill="outline" onClick={() => history.push('/app/soporte')}>
            Soporte
          </IonButton>
          <IonButton fill="clear" color="medium" onClick={cerrarSesion}>
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
