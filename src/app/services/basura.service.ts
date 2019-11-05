import { Injectable } from '@angular/core';
import { Basura } from '../interfaces/basura.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { UsuarioService } from './usuario.service';
import { environment } from 'src/environments/environment';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';

const URL = environment.url;


@Injectable({
  providedIn: 'root'
})
export class BasuraService {

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService,
              private toastCtrl: ToastController,
              private fileTransfer: FileTransfer
              ) {}

  // Crea una basura
  crearBasura( basura: Basura ) {

    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basura';
    return this.http.post( url, basura, {headers} ) 
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        return resp;
                      })
                    );
  }

  // comprueba si la calificacion de la basura se ha realizado en la misma semana que estamos a dia de hoy o no.
  comprobarFechaRealizado( id: string ) {
    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basura/comprobar-fecha-realizado/' + id;
    return this.http.get(url, {headers});

    /* return this.http.get(url, {headers})
                    .pipe(
                      map( (resp: any) => {
                        console.log(resp);
                        return resp;
                      })
                    ); */
  }

  subirImagen(img: string, tipo: string = 'basuras', id: string) {

    const options: FileUploadOptions = {
      fileKey: 'img',
      httpMethod: 'put',
      mimeType: 'image/jpeg',
      headers: {
        'token': this.usuarioService.token
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.upload( img, `${URL}/upload/${tipo}/${id}`, options )
                .then( data => {
                  console.log(data);
                }).catch( err => {
                  console.log('Error en carga', err);
                });

  }

  // Devuelve una basura por su id
  obtenerBasura( id: string ) {

    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basura/' + id;
    return this.http.get( url, {headers});
  }

  // Actualiza una Basura
  actualizarBasura( id: string, basura: Basura ) {

    console.log('Actualiza basura provider ', basura);

    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basura/' + id;
    return this.http.put( url, basura, {headers} );
  }

  // Lista todas las Basuras de una zona
  listarBasuras() {

    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basura';
    return this.http.get( url, {headers} );
  }
  // Lista todas las Basuras de una zona
  listarBasurasDeZona( zona: string ) {

    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basuraPorZona?zona=' + zona;
    return this.http.get( url, {headers} );
  }

  // Borra una basura
  borrarBasura(id: string) {
    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/basura/' + id;
    return this.http.delete( url, {headers})
                    .pipe(
                      map( (resp: any) => {
                          return resp;
                      })
                    );
  }

  // Crea un registro de historico de una basura
  crearHistorico( basura: Basura ) {
    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/historico'; 
    return this.http.post( url, basura, {headers})
                    .pipe(
                      map( (resp: any) =>{
                          console.log(resp);
                          return resp;
                      })
                    );
  }

  // Devuelve todos los registros de una basura por su codigo de contenedor único
  obtenerHistoricoBasura(codigoContenedor: string, desde: number, limite: number) {

    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });
    const url = URL + '/historico/' + codigoContenedor + '?desde=' + desde + '&limite=' + limite;
    return this.http.get( url, {headers})
                    .pipe(
                      map( (resp: any) => {
                          return resp;
                      })
                    );
  }

  async mostrar_toast( mensaje: string ) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

}
