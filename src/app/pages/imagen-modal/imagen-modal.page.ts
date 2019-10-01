import { Component, OnInit, Input } from '@angular/core';
import { Basura } from 'src/app/interfaces/basura.interface';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-imagen-modal',
  templateUrl: './imagen-modal.page.html',
  styleUrls: ['./imagen-modal.page.scss']
})
export class ImagenModalPage implements OnInit {

  @Input() basura: Basura;
  tipo: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.basura);
    if (this.basura.img.includes('assets')) {
      this.tipo = 'imgLocal';
    } else {
      this.tipo = 'basuras';
    }

    console.log(this.tipo);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
