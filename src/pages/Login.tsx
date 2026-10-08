import React, { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personOutline } from 'ionicons/icons';
import { useApp } from '../AppContext';

const Login: React.FC = () => {
  const history = useHistory();
  const { entrar, sesion } = useApp();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (sesion) history.replace('/app/servicios');
  }, [sesion, history]);

  const continuar = () => {
    if (!usuario.trim() || !password) {
      setError('Escribe tu usuario y contraseña.');
      return;
    }
    if (!entrar(usuario.trim(), password)) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }
    setError('');
    history.replace('/app/servicios');
  };

  return (
    <IonPage>
      <IonContent>
        <div className="screen center" style={{ paddingTop: 48 }}>
          <div className="avatar">
            <IonIcon icon={personOutline} />
          </div>
          <h1 className="brand">Estética Unisex Kenya</h1>

          <div className="divider-title">Iniciar sesión</div>

          <div className="field">
            <IonInput
              placeholder="Usuario"
              value={usuario}
              autocomplete="username"
              onIonInput={(e) => setUsuario(String(e.detail.value ?? ''))}
            />
          </div>
          <div className="field">
            <IonInput
              placeholder="Contraseña"
              type="password"
              value={password}
              autocomplete="current-password"
              onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
              onKeyUp={(e) => e.key === 'Enter' && continuar()}
            >
              <IonInputPasswordToggle slot="end" color="medium" />
            </IonInput>
          </div>

          {error && <p className="error">{error}</p>}

          <IonButton expand="block" style={{ width: '100%' }} onClick={continuar}>
            Continuar
          </IonButton>

          <div className="or">O</div>

          <IonButton
            expand="block"
            fill="outline"
            style={{ width: '100%' }}
            onClick={() => history.push('/registro')}
          >
            Regístrate
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;