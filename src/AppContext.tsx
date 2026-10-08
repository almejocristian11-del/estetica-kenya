import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  telefono: string;
  nacimiento: string;
  password: string;
}

export interface Cita {
  id: string;
  titulo: string;
  fecha: string; // yyyy-mm-dd
  hora: string; // HH:mm
  precio: number;
  notificar: boolean;
}

interface Ctx {
  usuarios: Usuario[];
  sesion: Usuario | null;
  citas: Cita[];
  productoElegido: string | null;
  registrar: (u: Usuario) => string | null;
  entrar: (usuario: string, password: string) => boolean;
  salir: () => void;
  agregarCita: (c: Omit<Cita, 'id'>) => void;
  cancelarCita: (id: string) => void;
  alternarNotificacion: (id: string) => void;
  elegirProducto: (id: string | null) => void;
}

const AppCtx = createContext<Ctx | null>(null);

function leer<T>(clave: string, defecto: T): T {
  try {
    const raw = localStorage.getItem(clave);
    return raw ? (JSON.parse(raw) as T) : defecto;
  } catch {
    return defecto;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => leer('kenya_usuarios', []));
  const [sesion, setSesion] = useState<Usuario | null>(() => leer('kenya_sesion', null));
  const [citas, setCitas] = useState<Cita[]>(() => leer('kenya_citas', []));
  const [productoElegido, elegirProducto] = useState<string | null>(null);

  useEffect(() => localStorage.setItem('kenya_usuarios', JSON.stringify(usuarios)), [usuarios]);
  useEffect(() => localStorage.setItem('kenya_sesion', JSON.stringify(sesion)), [sesion]);
  useEffect(() => localStorage.setItem('kenya_citas', JSON.stringify(citas)), [citas]);

  const registrar = (u: Usuario) => {
    if (usuarios.some((x) => x.usuario.toLowerCase() === u.usuario.toLowerCase())) {
      return 'Ese nombre de usuario ya existe.';
    }
    setUsuarios([...usuarios, u]);
    setSesion(u);
    return null;
  };

  const entrar = (usuario: string, password: string) => {
    const u = usuarios.find(
      (x) => x.usuario.toLowerCase() === usuario.toLowerCase() && x.password === password
    );
    if (!u) return false;
    setSesion(u);
    return true;
  };

  const salir = () => setSesion(null);

  const agregarCita = (c: Omit<Cita, 'id'>) =>
    setCitas((prev) =>
      [...prev, { ...c, id: String(Date.now()) }].sort((a, b) =>
        (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
      )
    );

  const cancelarCita = (id: string) => setCitas((prev) => prev.filter((c) => c.id !== id));

  const alternarNotificacion = (id: string) =>
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, notificar: !c.notificar } : c)));

  return (
    <AppCtx.Provider
      value={{
        usuarios,
        sesion,
        citas,
        productoElegido,
        registrar,
        entrar,
        salir,
        agregarCita,
        cancelarCita,
        alternarNotificacion,
        elegirProducto,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
};
