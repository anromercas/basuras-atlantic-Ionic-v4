import { UiService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Zona } from 'src/app/interfaces/zona.interface';
import { Basura } from 'src/app/interfaces/basura.interface';
import { UsuarioService } from '../../services/usuario.service';
import { BasuraService } from '../../services/basura.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.page.html',
  styleUrls: ['./zona.page.scss'],
})
export class ZonaPage implements OnInit {

  zona: Zona;
  basuras: Basura[] = [];
  basurasDeZona: Basura[] = [];
  historicoBasuras: Basura[] = [];
  admin = false;
  init = false;
  subs;

  constructor(private usuarioService: UsuarioService,
              private basuraService: BasuraService,
              private uiService: UiService,
              private router: Router,
              private activeRoute: ActivatedRoute) {

              this.subs = this.activeRoute.queryParams.subscribe( params => {
                let data = this.router.getCurrentNavigation().extras.queryParams.zona;
                if ( data !== params ) {
                  this.zona = data;
                  console.log(this.zona);
                }
              });

              if (usuarioService.role === 'SUPER_ADMIN_ROLE') {
                  this.admin = true;
                } else {
                  this.admin = false;
                }
              }

  ngOnInit() {

    this.subs.unsubscribe();
    this.basuraService.listarBasurasDeZona( this.zona.nombre + ' - ' + this.zona.area )
    .subscribe((basuras: any) => {
      this.basuras = basuras.basuras;
      this.init = true;
      console.log('ngOnInit');
      console.log(this.basuras);
      this.mostrarBasuras();
    }/* , (err) => {
      console.log(err);
      this.uiService.alertaInformativa('Sesión Caducada', 'La sesión ha caducado, debe iniciar sesión de nuevo.');
      this.usuarioService.logout();
    } */);
  }

  ionViewWillEnter() {
    this.mostrarBasuras();
    console.log('Mostrando basuras');
  }

  irBasura( basura: Basura ) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        basura
      }
    };
    console.log(navigationExtras);
    this.router.navigate(['/basura'], navigationExtras);
  }

  borrarBasura( id: string ) {
    this.basuraService.borrarBasura(id)
                    .subscribe( res => {
                        console.log(res);
                        this.uiService.alertaConTiempo('Basura Borrada', 'La basura se ha borrado');
                    });
  }

  calificar( basura: Basura ) {
    // this.navCtrl.push( CalificaPage, { 'basura': basura }, {animate: true, animation: 'ios-transition'} );
    const navigationExtras: NavigationExtras = {
      queryParams: {
        basura
      }
    };
    this.router.navigate(['/califica'], navigationExtras);
  }

  // rellenar el array con la zona pulsada para que se puedan listar los contenedores de esa zona
  mostrarBasuras() {

    this.basuras.forEach( basura => {
        this.basuraService.comprobarFechaRealizado(basura._id)
                          .subscribe( (res: any) => {
                          //  console.log(basura);
                            if (res.fechaValida === true) {
                              basura.color = 'medium';
                              basura.habilitado = false;
                            }
                          });
    });
  }

  calificacionRealizada() {
    this.uiService.mostrar_toast('Este contenedor ya se ha calificado en esta semana');
  }

  cerrar_sesion() {
    this.usuarioService.logout();
  }

}
