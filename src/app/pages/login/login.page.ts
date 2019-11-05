import { UiService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';




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

  constructor(public navCtrl: NavController,
              public usuarioService: UsuarioService,
              public uiService: UiService  ) { }

  ngOnInit() {
  }

  async login( fLogin: NgForm ) {

    if ( fLogin.invalid ) {
      console.log('formulario invalido');
      return;
    }
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
