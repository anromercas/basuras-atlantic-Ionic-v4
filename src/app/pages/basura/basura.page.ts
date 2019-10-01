import { UiService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Basura } from 'src/app/interfaces/basura.interface';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { BasuraService } from '../../services/basura.service';
import { ModalController } from '@ionic/angular';
import { ImagenModalPage } from '../imagen-modal/imagen-modal.page';

@Component({
  selector: 'app-basura',
  templateUrl: './basura.page.html',
  styleUrls: ['./basura.page.scss']
})
export class BasuraPage implements OnInit {
  basura: Basura;
  basuras: Basura[] = [];

  desde = 0;
  limite = 5;

  subs;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _basuraProv: BasuraService,
    private modalCtrl: ModalController,
  ) {

    this.subs = this.activeRoute.queryParams.subscribe( params => {
      const data = this.router.getCurrentNavigation().extras.queryParams.basura;
      console.log(data);
      this.basura = data;
    });

  }

  ngOnInit() {
    this.subs.unsubscribe();
    this.siguientes();
  }

  ionViewDidLoad() {
    this._basuraProv.obtenerBasura(this.basura._id).subscribe((res: any) => {
      this.basura = res.basura;
    });
  }

  verEjemplos() {
    this.router.navigate(['/ejemplos']);
  }

  calificar() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        basura: this.basura
      }
    };
    this.router.navigate(['/califica'], navigationExtras);
  }

  async verImg(basura: Basura) {
    const modal = await this.modalCtrl.create({
      component: ImagenModalPage,
      componentProps: {
        basura
      }
    });
    return await modal.present();
  }

  siguientes(event?) {
    this._basuraProv
      .obtenerHistoricoBasura(
        this.basura.codigoContenedor,
        this.desde,
        this.limite
      )
      .subscribe((resp: any) => {
        console.log(resp);
        this.basuras.push(...resp.historicos);
        this.desde += this.limite;
        if (event) {
          event.complete();
          if (resp.historicos.length === 0) {
            event.state = 'disabled';
          }
        }
      });
  }
}
