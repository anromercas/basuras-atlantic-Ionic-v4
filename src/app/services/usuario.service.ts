import { UiService } from './ui.service';
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { Platform, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { NavigationExtras } from '@angular/router';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  clave: string;
  usuario: Usuario;
  token: string = null;
  role: string;

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController,
    private uiService: UiService
  ) {}

  login(email: string, password: string) {
    const url = URL + '/loginApp';
    const usr = {
      email,
      password
    };

    return new Promise(resolve => {
      this.http.post(url, usr).subscribe(
        (resp: any) => {
          if (resp['ok']) {
            console.log(resp.usuario);
            this.usuario = resp.usuario;
            this.role = resp.usuario.role;
            this.token = resp.token;
            this.guardarStorage();
            resolve(true);
          } else if( resp['ok'] === false) {
          //  console.log(resp['err'].message);
            // redirijo a la pagina de cambiar contraseña
            this.uiService.mostrar_toast('La contraseña ha caducado o es su primer acceso');
            let navigationExtras: NavigationExtras = {
              queryParams: {
                id: resp['id']
              }
            };
            this.navCtrl.navigateForward(['/cambia-pass'], navigationExtras);
            resolve('nueva-contraseña');
          }
        },
        (error: any) => {
          this.token = null;
          this.role = null;
          this.borrarStorage();
          if( error.error.err.message ) {
            this.uiService.mostrar_toast(error.error.err.message);
          } else {
            this.uiService.mostrar_toast('Compruebe su conexión a internet');
          }
          resolve(false);
        }
      );
    });
  }

  cambiaContraseña( idUsr: string,  passAnt: string, password: string ) {

    const url = URL + '/usuario/cambiar-passwd/' + idUsr;

    let pass = { passAnt, password };
    console.log(pass);
    return new Promise(resolve => {
      this.http.put(url, pass )
                .subscribe( (resp: any) => {
                  console.log(resp['error'].message);
                  if( resp['ok']) {
                    this.uiService.mostrar_toast('¡Contraseña cambiada con éxito! esta contraseña caducará a los 6 meses');
                    // this.navCtrl.navigateRoot('/login');
                    resolve(true);
                  }
                },
                (error: any) => {
                  console.log(error.error.message);
                  this.uiService.mostrar_toast(error.error.message);
                  resolve(false);
                }
                );
    });
  }

  renuevaToken() {
    const url = URL + '/login/renuevatoken';

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.token = resp.token;
        this.guardarStorage();
        return true;
      })
    );
  }

  borrarStorage() {
    this.storage.remove('usuario');
    this.storage.remove('token');
  }

  guardarStorage() {
    this.storage.set('usuario', this.usuario);
    this.storage.set('token', this.token);
  }

  async cargarStorage() {
    this.token = await this.storage.get('token') || null;
  }

  async validaToken(): Promise<boolean> {

    await this.cargarStorage();

    if ( !this.token ) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>( resolve => {

      const headers = new HttpHeaders({
        'token': this.token
      });

      this.http.get(`${ URL }/usuario-token/`, { headers })
          .subscribe( resp => {
            if ( resp['ok'] ) {
              this.usuario = resp['usuario'];
              resolve(true);
            } else {
              this.navCtrl.navigateRoot('/login');
              resolve(false);
            }
          }, err => {
            this.navCtrl.navigateRoot('/login');
            this.uiService.mostrar_toast('La sesión ha caducado')
          }
          );
    });
  }

  logout() {
    this.borrarStorage();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }
}
