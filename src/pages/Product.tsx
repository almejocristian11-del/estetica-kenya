import React from 'react';
import Foto from '../components/Foto';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import { } from 'ionicons/icons';
import { PRODUCTOS, formatoPrecio } from '../data';
import { useApp } from '../AppContext';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { elegirProducto } = useApp();
  const producto = PRODUCTOS.find((p) => p.id === id);

  const anadir = () => {
    if (!producto) return;
    elegirProducto(producto.id);
    history.push('/app/cita');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/servicios" text="" />
          </IonButtons>
          <IonTitle>SOBRE EL PRODUCTO...</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="screen">
          {producto ? (
            <>
              <div className="product-image">
                <Foto id={producto.id} alt={producto.nombre} tamano={80} />.
              </div>
              <div className="product-name">{producto.nombre}</div>
              <div className="product-desc">
                {producto.descripcion}
                <div style={{ marginTop: 8, color: '#d4a96a', fontWeight: 700 }}>
                  {formatoPrecio(producto.precio)}
                </div>
              </div>
              <div className="center">
                <IonButton onClick={anadir}>Añadir a cita</IonButton>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center' }}>No encontramos este servicio.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Product;
