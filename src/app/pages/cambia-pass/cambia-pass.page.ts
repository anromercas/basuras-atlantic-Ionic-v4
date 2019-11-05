import { UiService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cambia-pass',
  templateUrl: './cambia-pass.page.html',
  styleUrls: ['./cambia-pass.page.scss'],
})
export class CambiaPassPage implements OnInit {

  subs;
  id: string;

  passUser = {
    anterior: '',
    nuevo: '',
    nuevo2: ''
  };

  constructor(  private usuarioService: UsuarioService,
                private activeRoute: ActivatedRoute,
                private router: Router,
                private uiService: UiService ) {

    this.subs = this.activeRoute.queryParams.subscribe( params => {
      const data = this.router.getCurrentNavigation().extras.queryParams.id;
      this.id = data;
      console.log(data);
    });
   }

  ngOnInit() {
    this.subs.unsubscribe();
  }

  cambiaPass( form: NgForm ) {

    if ( form.invalid ) {
      this.uiService.mostrar_toast('Campos incompletos');
      return;
    }

    if ( this.passUser.nuevo !== this.passUser.nuevo2 ) {
      this.uiService.mostrar_toast('El campo contraseña y repetir contraseña no son iguales');
      return;
    }

    console.log(this.passUser);

    const cambio = this.usuarioService.cambiaContraseña(this.id, this.passUser.anterior, this.passUser.nuevo);

    if ( cambio ) {
      this.router.navigate(['login']);
    }

  }

}
