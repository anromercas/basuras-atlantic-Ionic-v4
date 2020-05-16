import { UiService } from './../../services/ui.service';
import { Component, OnInit } from '@angular/core';
import { Basura } from 'src/app/interfaces/basura.interface';
import { Calificacion } from 'src/app/interfaces/calificacion.interface';
import { MasOpc } from 'src/app/interfaces/masOpc.interface';
import { Residuos } from 'src/app/interfaces/residuos.interface';
import { NavController } from '@ionic/angular';
import { BasuraService } from '../../services/basura.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CALIFICACIONES } from 'src/app/data/data.calificaciones';
import { masOpciones } from 'src/app/data/data.masopciones';
import { RESIDUOS } from 'src/app/data/data.residuos';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';


declare var window;

@Component({
  selector: 'app-califica',
  templateUrl: './califica.page.html',
  styleUrls: ['./califica.page.scss']
})
export class CalificaPage implements OnInit {
  basura: Basura;
  residuo: string;
  calificacion: number = null;
  observaciones = '';
  estado: string;

  // foto principal
  imagenPreview = '';
  imagen64: string;

  // foto detalle
  imagenPreviewDetalle = '';
  imagen64Detalle: string;

  colorFondo = '';
  fechaHoy = Date();
  imagenNueva = false;

  calificaciones: Calificacion[] = [];
  masOpciones: MasOpc[] = [];
  residuos: Residuos[] = [];

  isConnected = false;

  constructor(
    public navCtrl: NavController,
    private router: Router,
    private camera: Camera,
    public basuraService: BasuraService,
    public uiService: UiService,
    public usuarioService: UsuarioService,
    private activeRoute: ActivatedRoute,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService
  ) {
    this.calificaciones = CALIFICACIONES;
    this.masOpciones = masOpciones.slice();
    this.residuos = RESIDUOS.slice();

    this.activeRoute.queryParams.subscribe( params => {
      const data = this.router.getCurrentNavigation().extras.queryParams.basura;
      console.log(data);
      this.basura = data;
    });

    this.calificacion = 5;
    this.estado = '';
    this.residuo = '';

    this.masOpciones.forEach(opc => {
      opc.color = '';
      opc.seleccionado = false;
    });

    this.calificaciones.forEach(calificacion => {
      if (calificacion.puntos === 5) {
        calificacion.seleccionado = true;
        calificacion.color = 'secondary';
      } else {
        calificacion.seleccionado = false;
        calificacion.color = '';
      }
    });

    this.residuos.forEach(residuo => {
      if (residuo.color === 'secondary') {
        residuo.seleccionado = false;
        residuo.color = '';
      }
    });

    console.log(this.basura);
  }

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

    this.mostrarResiduos();

    this.basuraService.listarBasuras().subscribe(
      (basuras: any) => {},
      err => {
        this.usuarioService.renuevaToken().subscribe(resp => {
          if (resp === true) {
            console.log('Token renovado');
          } else {
            console.log('Token no renovado');
            this.uiService.alertaInformativa(
              'Sesión Caducada',
              'La sesión ha caducado, debe iniciar sesión de nuevo.'
            );
            this.cerrar_sesion();
          }
        });
      }
    );
  }

  camara(tipo: string) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then(
      imageData => {
        if (tipo === 'img') {
          //  this.imagenPreview = 'data:image/jpg;base64,' + imageData;
          const img = window.Ionic.WebView.convertFileSrc(imageData);
          this.imagen64 = imageData;
          if ( this.isConnected === false ) {
            this.basuraService.imgStorage(this.imagen64, 'basuras', this.basura._id);
            this.imagenPreview = img;
            this.imagenNueva = true;
          } else {

            this.basuraService.subirImagen(
              this.imagen64,
              'basuras',
              this.basura._id
            ).then( data => {
              this.imagenPreview = img;
              this.imagenNueva = true;
              this.uiService.mostrar_toast('Imagen subida');
            }).catch( err => {
              console.log('Error en carga', err);
            //  this.uiService.alertaInformativa('Imagen no subida', 'compruebe su conexión a internet e intentelo de nuevo');
              this.basuraService.imgStorage(this.imagen64, 'basuras', this.basura._id);
              this.imagenPreview = img;
              this.imagenNueva = true;
            });
          }
        } else {
          const img = window.Ionic.WebView.convertFileSrc(imageData);
          this.imagen64Detalle = imageData;

          if ( this.isConnected === false ) {
            this.basuraService.imgStorage(this.imagen64Detalle, 'imgdetalle', this.basura._id);
          } else {

            this.basuraService.subirImagen(
              this.imagen64Detalle,
              'imgdetalle',
              this.basura._id
              ).then( data => {
                this.imagenPreviewDetalle = img;
                this.uiService.mostrar_toast('Imagen subida');
            }).catch( err => {
              console.log('Error en carga', err);
              this.uiService.alertaInformativa('Imagen no subida', 'compruebe su conexión a internet e intentelo de nuevo');
            });
          }
        }
      },
      err => {
        console.log('ERROR EN CAMARA', JSON.stringify(err));
      }
    );
  }

  obtenerDatosBasura() {
    const basuraProv: Basura = {
      nombre: this.basura.nombre,
      zona: this.basura.zona,
      numeroContenedor: this.basura.numeroContenedor,
      codigoContenedor: this.basura.codigoContenedor.toUpperCase(),
      calificacion: this.calificacion,
      observaciones: this.observaciones,
      fecha: new Date().toISOString(),
      residuo: this.residuo,
      imgContenedor: this.basura.imgContenedor,
      estado: this.estado,
    };

    console.log('BasuraProv ' + basuraProv);
    return basuraProv;
  }

  guardar() {
    if (this.calificacion < 5 && !this.residuo) {
      console.log('Hay que seleccionar residuos');
      this.uiService.alertaInformativa(
        'Error',
        'Debe seleccionar los resíduos que no deberían de estar en este contenedor'
      );
      return;
    } else if (this.estado === '') {
      console.log('el estado es obligatorio');
      this.uiService.alertaInformativa(
        'Error',
        'El estado del contenedor es obligatorio'
      );
      return;
    } else {
      this.residuos.forEach(residuo => {
        if (residuo.seleccionado) {
          residuo.seleccionado = false;
        }
      });
    }
    const basuraProv: Basura = {
      nombre: this.basura.nombre,
      zona: this.basura.zona,
      numeroContenedor: this.basura.numeroContenedor,
      codigoContenedor: this.basura.codigoContenedor.toUpperCase(),
      calificacion: this.calificacion,
      observaciones: this.observaciones,
      fecha: new Date().toISOString(),
      residuo: this.residuo,
      imgContenedor: this.basura.imgContenedor,
      estado: this.estado,
      usuario: this.usuarioService.usuario
    };
    if ( this.isConnected === false ){
    //  this.uiService.mostrar_toast_center('La calificación no ha sido guardada, compruebe su conexión a internet');
      this.basuraService.actualizarBasura(this.basura._id, basuraProv, false);
    } else {

      // Actualiza la basura
      this.basuraService
        .actualizarBasura(this.basura._id, basuraProv, true)
        .subscribe((res: any) => {
          console.log('Basura añadida', res.basura);
          this.basura = res.basura;
          if (this.isConnected === false ) {
            this.basuraService.crearHistorico(res.basura, false);
          } else {

            this.basuraService
              .crearHistorico(res.basura, true)
              // Crea un registro en historico
              .subscribe(res => console.log('Historico añadido', res));

            this.uiService.alertaConTiempo(
              'Guardado!',
              'La calificación se ha guardado con éxito!',
              1500
            );
          }

        });
      }
    this.reiniciar();
    this.navCtrl.pop();
  }

  calificar(calificacion: Calificacion) {
    this.calificaciones.forEach( calificacion => {
      if (calificacion.seleccionado && calificacion.color === 'secondary') {
        calificacion.seleccionado = false;
        calificacion.color = '';
      }
    });

    calificacion.color = 'secondary';
    calificacion.seleccionado = true;

    if (calificacion.puntos < 5) {
      this.uiService.alertaConTiempo(
        'Hay más opciones',
        'La calificación es menor a 5, debe seleccionar un Resíduo',
        2500
      );
      this.calificacion = calificacion.puntos;
    } else {
      this.calificacion = calificacion.puntos;
    }
  }

  cambiarEstado(opcion: MasOpc) {
    if (opcion.seleccionado) {
      this.estado += opcion.nombre + ',';
      opcion.color = 'secondary';
      if(opcion.nombre === 'Bueno') {
        this.masOpciones.forEach( opc => {
          if ( opc.nombre !== 'Bueno' ) {
            opc.deshabilitado = true;
            opc.seleccionado = false;
            opc.color =  '';
            this.estado = '';
            this.estado += opcion.nombre + ',';
          }
        });
      }
    } else {
      this.estado = this.estado.replace(opcion.nombre + ',', '');
      opcion.color = '';
      if(opcion.nombre === 'Bueno') {
        this.masOpciones.forEach( opc => {
          if( opc.nombre !== 'Bueno' ) {
            opc.deshabilitado = false;
          }
        });
      }
    }
  }

  reiniciar() {
    this.observaciones = '';

    this.calificacion = 5;
    this.calificaciones.forEach(calificacion => {
      if (calificacion.puntos === 5) {
        calificacion.seleccionado = true;
        calificacion.color = 'secondary';
      } else {
        calificacion.seleccionado = false;
        calificacion.color = '';
      }
    });

    this.masOpciones.forEach(opc => {
      opc.color = '';
      opc.seleccionado = false;
      opc.deshabilitado = false;
    });
    this.estado = '';

    this.residuos.forEach(residuo => {
      if (residuo.seleccionado) {
        residuo.seleccionado = false;
        residuo.color = '';
      }
    });
    this.residuo = '';
  }

  seleccionar(residuo: Residuos) {
    if (residuo.seleccionado) {
      residuo.seleccionado = false;
      residuo.color = '';
      this.residuo = this.residuo.replace(residuo.nombre + ',', '');
      // return;
    } else {
      residuo.seleccionado = true;
      residuo.color = 'secondary';
      this.residuo += residuo.nombre + ',';
    }
  }

  // elimina del array de los residuos el que si deberían estar es el contenedor elegido
  // Si el contenedor es de EPIs el resíduo EPIs no aparece en la lista
  mostrarResiduos() {
    this.residuos.forEach((residuo: any, index) => {
      const nombreBasura = this.basura.nombre;
      if (nombreBasura.includes(residuo.nombre)) {
        this.residuos.splice(index, 1);
      }
    });
  }

  cerrar_sesion() {
    this.usuarioService.borrarStorage();
    this.router.navigate(['/login']);
  }
}
