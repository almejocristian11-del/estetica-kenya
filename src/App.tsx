import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cutOutline, addCircleOutline, calendarOutline, personOutline } from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme.css';

import { AppProvider, useApp } from './AppContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Product from './pages/Product';
import NewAppointment from './pages/NewAppointment';
import CalendarPage from './pages/CalendarPage';
import Profile from './pages/Profile';
import Support from './pages/Support';

setupIonicReact({ mode: 'md' });

const Tabs: React.FC = () => {
  const { sesion } = useApp();
  if (!sesion) return <Redirect to="/login" />;

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/servicios" component={Services} />
        <Route exact path="/app/servicios/:id" component={Product} />
        <Route exact path="/app/cita" component={NewAppointment} />
        <Route exact path="/app/calendario" component={CalendarPage} />
        <Route exact path="/app/perfil" component={Profile} />
        <Route exact path="/app/soporte" component={Support} />
        <Route exact path="/app">
          <Redirect to="/app/servicios" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="servicios" href="/app/servicios">
          <IonIcon icon={cutOutline} />
          <IonLabel>Servicios</IonLabel>
        </IonTabButton>
        <IonTabButton tab="cita" href="/app/cita">
          <IonIcon icon={addCircleOutline} />
          <IonLabel>Nueva cita</IonLabel>
        </IonTabButton>
        <IonTabButton tab="calendario" href="/app/calendario">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Citas</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/app/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const Root: React.FC = () => {
  const { sesion } = useApp();
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/registro" component={Register} />
        <Route path="/app" component={Tabs} />
        <Route exact path="/">
          <Redirect to={sesion ? '/app/servicios' : '/login'} />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AppProvider>
      <Root />
    </AppProvider>
  </IonApp>
);

export default App;
