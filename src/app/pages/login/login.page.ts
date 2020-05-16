import { UiService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { NetworkService } from 'src/app/services/network.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginUser = {
    email: '',
    password: ''
  };

  intentos = 0;
  isConnected = false;

  constructor(public navCtrl: NavController,
              public usuarioService: UsuarioService,
              public uiService: UiService,
              private networkService: NetworkService  ) { }

  ngOnInit() {
    this.networkService.getNetworkStatus().subscribe( (connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        console.log('Por favor enciende tu conexión a Internet');
        console.log(this.isConnected);
      //  this.uiService.mostrar_toast_up('Comprueba tu conexión a internet antes de iniciar sesión');
      } else {
        console.log(this.isConnected);
      //  this.uiService.mostrar_toast_up('conexión a internet correcta');
      }
    });
  }

  async login( fLogin: NgForm ) {

    if ( fLogin.invalid ) {
      console.log('formulario invalido');
      return;
    }

    if( this.isConnected === false ) {
      this.uiService.mostrar_toast_center('No ha podido iniciar sesión, compruebe su conexión a internet');
    }

    console.log(this.loginUser);
    const valido = await this.usuarioService.login( this.loginUser.email, this.loginUser.password );

    console.log(valido);

    if ( valido === 'nueva-contraseña') {
      console.log('cambio de pass');
      this.loginUser.password = '';

    } else if (valido) {
      console.log(this.intentos);
      // navegar al HomePage
      this.navCtrl.navigateRoot('home', { animated: true } );
    }

  }

}
