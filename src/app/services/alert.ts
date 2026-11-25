import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class Alert {

  private alertController: AlertController = inject(AlertController);

  async alertMessage(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async alertConfirm(
    header: string,
    subHeader: string,
    message: string,
    funtionOK: Function,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Aceptar'
  ) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            funtionOK();
          },
        },
      ],
    });

    await alert.present();
  }
}
