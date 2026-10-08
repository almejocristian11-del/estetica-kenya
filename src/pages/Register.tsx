import React, { useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MESES } from '../data';
import { useApp } from '../AppContext';

const anioActual = new Date().getFullYear();
const ANIOS = Array.from({ length: 100 }, (_, i) => anioActual - i);
const DIAS = Array.from({ length: 31 }, (_, i) => i + 1);

const Register: React.FC = () => {
  const history = useHistory();
  const { registrar } = useApp();
  const [mes, setMes] = useState<number | undefined>();
  const [dia, setDia] = useState<number | undefined>();
  const [anio, setAnio] = useState<number | undefined>();
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');

  const enviar = () => {
    if (!mes || !dia || !anio) return setError('Selecciona tu fecha de nacimiento.');
    if (!/^\S+@\S+\.\S+$/.test(correo)) return setError('Escribe un correo electrónico válido.');
    if (telefono.replace(/\D/g, '').length < 10) return setError('El teléfono debe tener 10 dígitos.');
    if (usuario.trim().length < 3) return setError('El usuario debe tener al menos 3 caracteres.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    if (password !== confirmar) return setError('Las contraseñas no coinciden.');

    const fallo = registrar({
      nombre: usuario.trim(),
      usuario: usuario.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      nacimiento: `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
      password,
    });
    if (fallo) return setError(fallo);
    setError('');
    history.replace('/app/servicios');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" text="" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="screen">
          <div className="divider-title" style={{ fontSize: 20, fontWeight: 700 }}>
            Registrarse
          </div>

          <span className="field-label" style={{ textAlign: 'center' }}>
            ¿Cuál es tu fecha de nacimiento?
          </span>
          <div className="date-row">
            <IonSelect placeholder="Mes" aria-label="Mes" value={mes} onIonChange={(e) => setMes(e.detail.value)}>
              {MESES.map((m, i) => (
                <IonSelectOption key={m} value={i + 1}>
                  {m}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect placeholder="Día" aria-label="Día" value={dia} onIonChange={(e) => setDia(e.detail.value)}>
              {DIAS.map((d) => (
                <IonSelectOption key={d} value={d}>
                  {d}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect placeholder="Año" aria-label="Año" value={anio} onIonChange={(e) => setAnio(e.detail.value)}>
              {ANIOS.map((a) => (
                <IonSelectOption key={a} value={a}>
                  {a}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <div className="field">
            <label className="field-label">Correo electrónico</label>
            <IonInput
              type="email"
              placeholder="Dirección de correo electrónico"
              value={correo}
              onIonInput={(e) => setCorreo(String(e.detail.value ?? ''))}
            />
          </div>
          <div className="field">
            <label className="field-label">Número de teléfono</label>
            <IonInput
              type="tel"
              placeholder="Número de teléfono"
              value={telefono}
              onIonInput={(e) => setTelefono(String(e.detail.value ?? ''))}
            />
          </div>
          <div className="field">
            <label className="field-label">Usuario</label>
            <IonInput
              placeholder="Nombre de usuario"
              value={usuario}
              onIonInput={(e) => setUsuario(String(e.detail.value ?? ''))}
            />
          </div>
          <div className="field">
            <IonInput
              type="password"
              placeholder="Contraseña"
              value={password}
              onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
            />
          </div>
          <div className="field">
            <IonInput
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmar}
              onIonInput={(e) => setConfirmar(String(e.detail.value ?? ''))}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <IonButton expand="block" onClick={enviar}>
            Registrarse
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
