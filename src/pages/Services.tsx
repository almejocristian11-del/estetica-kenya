import React, { useMemo, useState } from 'react';
import Foto from '../components/Foto';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { } from 'ionicons/icons';
import { CATEGORIAS, PRODUCTOS, formatoPrecio } from '../data';

const Services: React.FC = () => {
  const history = useHistory();
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return PRODUCTOS.filter((p) => !q || p.nombre.toLowerCase().includes(q));
  }, [busqueda]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Servicios y paquetes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="screen">
          <IonSearchbar
            placeholder="Buscar"
            value={busqueda}
            debounce={150}
            onIonInput={(e) => setBusqueda(String(e.detail.value ?? ''))}
            style={{ padding: 0 }}
          />

          {CATEGORIAS.map((cat) => {
            const items = filtrados.filter((p) => p.categoria === cat.id);
            if (!items.length) return null;
            return (
              <section key={cat.id}>
                <div className="section-title">{cat.titulo}:</div>
                <div className="thumb-grid">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="thumb"
                      role="button"
                      onClick={() => history.push(`/app/servicios/${p.id}`)}
                    >
                      <div className="thumb-img"><Foto id={p.id} alt={p.nombre} /></div>
                      <span>{p.nombre}</span>
                      <small>{formatoPrecio(p.precio)}</small>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {!filtrados.length && (
            <p style={{ textAlign: 'center', color: '#8fa1b3', marginTop: 32 }}>
              No encontramos resultados para “{busqueda}”.
            </p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Services;
