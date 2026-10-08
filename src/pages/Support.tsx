import React from 'react';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { logoWhatsapp, mailOutline } from 'ionicons/icons';
import { PREGUNTAS_FRECUENTES, SOPORTE } from '../data';

const Support: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/app/perfil" text="" />
        </IonButtons>
        <IonTitle>Soporte</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div className="screen">
        <IonAccordionGroup>
          {PREGUNTAS_FRECUENTES.map((f) => (
            <IonAccordion key={f.q} value={f.q}>
              <IonItem slot="header">
                <IonLabel>{f.q}</IonLabel>
              </IonItem>
              <div className="ion-padding" slot="content">
                {f.a}
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>

        <div className="center" style={{ marginTop: 28 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>¿Necesitas más ayuda?</p>
          <p style={{ margin: '0 0 16px', fontWeight: 700 }}>¡Contáctanos!</p>

          <IonButton
            fill="outline"
            style={{ width: '100%' }}
            href={`https://wa.me/${SOPORTE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IonIcon slot="start" icon={logoWhatsapp} />
            Enviar mensaje por WhatsApp
          </IonButton>
          <IonButton fill="outline" style={{ width: '100%' }} href={`mailto:${SOPORTE.correo}`}>
            <IonIcon slot="start" icon={mailOutline} />
            Enviar mensaje por correo
          </IonButton>
        </div>
      </div>
    </IonContent>
  </IonPage>
);

export default Support;
