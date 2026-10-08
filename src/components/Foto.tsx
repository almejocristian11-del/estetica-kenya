import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';

const Foto: React.FC<{ id: string; alt: string; tamano?: number }> = ({ id, alt, tamano = 30 }) => {
  const [falla, setFalla] = useState(false);
  if (falla) return <IonIcon icon={imageOutline} style={{ fontSize: tamano }} />;
  return (
    <img
      src={`/img/${id}.jpg`}
      alt={alt}
      onError={() => setFalla(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
    />
  );
};

export default Foto;