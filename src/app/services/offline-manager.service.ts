import { UiService } from './ui.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { UsuarioService } from './usuario.service';
import { environment } from 'src/environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';


const URL = environment.url;


const STORAGE_REQ_KEY = 'storedreq';
// const STORAGE_IMG_KEY = 'storedimg';

interface StoredRequest {
  url: string;
  type: string;
  data: any;
  img?: string;
  tipoImg?: string;
  idBasura?: string;
  time: number;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  constructor(private storage: Storage,
              private http: HttpClient,
              private uiService: UiService,
              private usuarioService: UsuarioService,
              private fileTransfer: FileTransfer, ) { }

  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap((storeOperations: any) => {
        let storeObj = JSON.parse(storeOperations);
        if (storeObj && storeObj.length > 0) {
          return this.sendRequests(storeObj).pipe(
            finalize(() => {
              this.uiService.mostrar_toast_up('Conexión restablecida, Calificación subida');
              this.storage.remove(STORAGE_REQ_KEY);
            }),
          );
        } else {
          console.log('No hay nada que sincronizar');
          return of(false);
        }
      })
    )
  }

/*   checkForImgs(): Observable<any> {
    return from(this.storage.get(STORAGE_IMG_KEY)).pipe(
      switchMap((storeOperations: any) => {
        let storeObj = JSON.parse(storeOperations);
        if (storeObj && storeObj.length > 0) {
          return this.sendRequests(storeObj).pipe(
            finalize(() => {
              this.uiService.mostrar_toast_up('Conexión restablecida, Imagen subida');
              this.storage.remove(STORAGE_IMG_KEY);
            })
          );
        } else {
          console.log('No hay img que sincronizar');
          return of(false);
        }
      })
    )
  } */

  storeImg( url, type, data, img, tipoImg, idBasura) {
    this.uiService.mostrar_toast_up('Imagen guardada en local, no hay conexión a internet');
    const action: StoredRequest = {
      url,
      type,
      data,
      img,
      tipoImg,
      idBasura,
      time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    return this.storage.get(STORAGE_REQ_KEY).then( storedImgOperations => {
      let storedObj = JSON.parse(storedImgOperations);

      console.log(storedObj);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }

      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }

  storeRequest(url, type, data) {
    this.uiService.mostrar_toast_up('Calificación guardada en local, no hay conexión a internet');

    const action: StoredRequest = {
      url,
      type,
      data,
      time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      console.log(storedObj);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }

      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }

  sendRequests(operations: StoredRequest[]) {
    let obs = [];
    const headers = new HttpHeaders({
      'token': this.usuarioService.token
    });


    for (let op of operations) {
      console.log('Longitud operaciones' + operations.length);
      console.log('Make one request: ', op);

      if ( op.img ) {

        const options: FileUploadOptions = {
          fileKey: 'img',
          httpMethod: 'put',
          mimeType: 'image/jpeg',
          headers: {
            'token': this.usuarioService.token
          }
        };
        const fileTransfer: FileTransferObject = this.fileTransfer.create();
        const url = `${URL}/upload/${op.tipoImg}/${op.idBasura}`;

        fileTransfer.upload( op.img, url, options ).then( res => {
          console.log(res);
        });


         /* let options = {
          // body: { img: op.img },
          img: op.img,
          headers: op.data,

        };
        const oneObs = this.http.request(op.type, op.url, options).subscribe( (data: any) => {
          console.log('offline Manager', data);
          const url = `${URL}/upload/${op.tipoImg}/${op.idBasura}`;
          this.http.request('PUT', url, options).subscribe( resp => {
            console.log('Imagen guardada en offline Manager ', resp);
          });
        });
        obs.push(oneObs);*/

      } else {
        let options = {
          body: op.data,
          headers
        };

        const oneObs = this.http.request(op.type, op.url, options).subscribe( (data: any) => {
          console.log('offline Manager', data);
          const url = URL + '/historico';
          const options = {
            body: data.basura,
            headers
          };
          this.http.request('POST', url, options).subscribe( resp => {
            console.log('Historico guardado en offline Manager ', resp);
          });
        });
        obs.push(oneObs);
      }

    }

    // Send out all local events and return once they are finished
    return forkJoin(obs);
  }


}
