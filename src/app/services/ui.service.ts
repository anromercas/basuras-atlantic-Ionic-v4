import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async alertaInformativa(titulo: string, subtitulo: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertaConTiempo(titulo: string, subtitulo: string, tiempo: number = 2000) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo
      //  buttons: ['OK']
    });
    await alert.present();
    setTimeout(() => {
      alert.dismiss();
    }, tiempo);
  }

  async mostrar_toast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  async mostrar_toast_up(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  async mostrar_toast_center(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }
}
