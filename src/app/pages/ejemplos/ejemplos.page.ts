import { Component, OnInit } from '@angular/core';
import { Basura } from 'src/app/interfaces/basura.interface';
import { EJEMPLOS } from 'src/app/data/data.ejemplos';
import { ModalController } from '@ionic/angular';
import { BasuraService } from '../../services/basura.service';
import { Router } from '@angular/router';
import { ImagenModalPage } from '../imagen-modal/imagen-modal.page';

@Component({
  selector: "app-ejemplos",
  templateUrl: "./ejemplos.page.html",
  styleUrls: ["./ejemplos.page.scss"]
})
export class EjemplosPage implements OnInit {
  basuras: Basura[] = [];
  basurasDeEjemplo: Basura[] = [];
  basurasDeEjemplo2: Basura[] = [];
  basurasDeEjemplo3: Basura[] = [];

  constructor(
    public navCtrl: Router,
    public modalCtrl: ModalController
  ) {
    this.basuras = EJEMPLOS;
    this.mostrarBasuras();
  }

  ngOnInit() {}

  async verImg(basura: Basura) {
    const modal = await this.modalCtrl.create({
      component: ImagenModalPage,
      componentProps: {
        basura
      }
    });
    return await modal.present();
  }

  mostrarBasuras() {
    let cont = 0;
    this.basuras.forEach(basura => {
      if (basura.img) {
        if (cont < 3) {
          this.basurasDeEjemplo.push(basura);
        } else if (cont > 2 && cont < 6) {
          this.basurasDeEjemplo2.push(basura);
        } else if (cont > 5 && cont < 9) {
          this.basurasDeEjemplo3.push(basura);
        }
        cont++;
      }
    });
  }
}
