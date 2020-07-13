import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { ZONAS } from 'src/app/data/data.zonas';
import { Router, NavigationExtras } from '@angular/router';
import { Zona } from 'src/app/interfaces/zona.interface';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  zonas: Zona[] = [];
  orientation: string;
  admin = false;

  constructor(private router: Router,
              public navCtrl: NavController,
              public usuarioService: UsuarioService
  ) {
    this.zonas = ZONAS.slice(0);
    // console.log(this.zonas);
  }

  ngOnInit() {
  //  this.usuarioService.loginOtp('david@mail.com', '1234', '623972');
  }

  ionViewDidEnter() {
    console.log(this.usuarioService.role);
    if (this.usuarioService.role === 'SUPER_ADMIN_ROLE') {
      this.admin = true;
    } else {
      this.admin = false;
    }
  }
  irZona( zona: Zona ) {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        zona
      }
    };

    this.router.navigate(['/zona'], navigationExtras);
  }

  cerrar_sesion() {
    this.usuarioService.logout();
  }

  nueva_basura() {
    this.router.navigate(['/nueva-basura']);
  }
}
