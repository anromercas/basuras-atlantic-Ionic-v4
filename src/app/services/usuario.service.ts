import { UiService } from './ui.service';
import { Injectable } from "@angular/core";
import { Usuario } from "../interfaces/usuario.interface";
import { Platform, ToastController, NavController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { map } from "rxjs/operators";

const URL = environment.url;

@Injectable({
  providedIn: "root"
})
export class UsuarioService {
  clave: string;
  usuario: Usuario;
  token: string = null;
  role: string;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private storage: Storage,
    private navCtrl: NavController,
    private uiService: UiService
  ) {}

  // =============================================================
  // Codigo provisional para probar el x-otp de la API de basuras
  // =============================================================

  loginOtp(email: string, password: string, xotp: string) {
    const usr = { email, password };

    const headers = new HttpHeaders({
      "x-otp": xotp
    });

    return this.http.post(`${URL}/login`, usr, { headers }).subscribe(data => {
      console.log(data);
    });
  }

  login(email: string, password: string) {
    const url = URL + "/loginApp";
    const usr = {
      email,
      password
    };

    return new Promise(resolve => {
      this.http.post(url, usr).subscribe(
        (resp: any) => {
          if (resp["ok"]) {
            console.log(resp.usuario);
            this.usuario = resp.usuario;
            this.role = resp.usuario.role;
            this.token = resp.token;
            this.guardarStorage();
            resolve(true);
          }
        },
        (error: any) => {
          this.token = null;
          this.role = null;
          this.borrarStorage();
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
    /* if (this.platform.is('cordova')) {
                  this.storage.remove('usuario');
                  this.storage.remove('token');
                } else {
                  localStorage.removeItem('usuario');
                  localStorage.removeItem('token');
                } */
  }

  guardarStorage() {
    this.storage.set('usuario', this.usuario);
    this.storage.set('token', this.token);
    /*  if (this.platform.is('cordova')) {
                  this.storage.set('usuario', this.usuario);
                  this.storage.set('token', this.token);
                } else {
                  localStorage.setItem('usuario', JSON.stringify (this.usuario));
                  localStorage.setItem('token', this.token);
                } */
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
