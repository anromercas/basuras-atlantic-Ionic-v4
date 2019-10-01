import { UiService } from './../../services/ui.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Zona } from 'src/app/interfaces/zona.interface';
import { BasuraNueva } from 'src/app/interfaces/basura-nueva.interface';
import { BasuraService } from '../../services/basura.service';
import { UsuarioService } from '../../services/usuario.service';
import { ZONAS } from 'src/app/data/data.zonas';
import { BASURAS } from 'src/app/data/data.basuras';
import { Basura } from 'src/app/interfaces/basura.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-basura',
  templateUrl: './nueva-basura.page.html',
  styleUrls: ['./nueva-basura.page.scss'],
})
export class NuevaBasuraPage implements OnInit {

  @ViewChild('codigoContenedor', {static: true}) codContenedor;

  myForm: FormGroup;
  zonas: Zona[] = [];
  basuras: BasuraNueva[] = [];
  codigoContenedor: string;

  imgContenedor: string;
  codCont = '';
  numCont = 1;

  imagenPreview: any;
  imagen64: string;

  opcionesSlide = {
    slidesPerView: 3
  };


  constructor(public router: Router,
              public formBuilder: FormBuilder,
              public _basuraProv: BasuraService,
              public _usuarioProv: UsuarioService,
              public uiProv: UiService) {
      this.myForm = this.createMyForm();
      this.zonas = ZONAS.slice(0);
      this.basuras = BASURAS.slice(0);

      // seleccionar la primera opcion por defecto
      this.imgContenedor = this.basuras[0].imgContenedor;

  }

  ngOnInit() {
  }

  ionViewDidLoad() {

    this._basuraProv.listarBasuras()
    .subscribe((basuras: any) => {
    }, (err) => {
      this._usuarioProv.renuevaToken()
                      .subscribe( resp => {
                        if (resp === true) {
                          console.log('Token renovado');
                        } else {
                          console.log('Token no renovado');
                          this.uiProv.alertaInformativa('Sesión Caducada', 'La sesión ha caducado, debe iniciar sesión de nuevo.');
                          this.router.navigate(['/login']);
                          this.cerrar_sesion();
                        }
                      });
    });
  }

  createMyForm() {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      codigoContenedor: [this.codCont.toUpperCase(), Validators.required],
      numeroContenedor: ['', Validators.required],
      zona: ['', Validators.required]
    });
  }

  siglasZona( evento: EventListener ) {

    this.zonas.forEach( zona => {
      if (zona.nombre + ' - ' + zona.area === evento['detail'].value.toString()) {
        if (!this.codCont) {
          this.codCont += zona.siglas;
        } else {
          this.codCont = '';
          this.codCont += zona.siglas;
        }
      }
    });
  }

  siglasBasura( evento: EventListener ) {
    this.basuras.forEach( basura => {
      if (basura.nombre === evento['detail'].value.toString()) {
          this.codCont += basura.siglas;
      }
    });
  }

  seleccionarIcono( basura ) {
    this.basuras.forEach( img => img.seleccionado = false );
    this.imgContenedor = basura.imgContenedor;

    basura.seleccionado = true;
  }


  saveData() {
    const datos = this.myForm.value;
    const numContInt = this.numCont;

    const basura: Basura = {
      nombre: datos.nombre,
      zona: datos.zona,
      numeroContenedor: parseInt(datos.numeroContenedor),
      codigoContenedor: datos.codigoContenedor.toString().toUpperCase(),
      imgContenedor: this.imgContenedor,
    };
    this._basuraProv.crearBasura(basura)
                        .subscribe(resp => {
                          this.uiProv.mostrar_toast('Basura Guardada' + basura.nombre);
                          this.myForm.reset();
                          this.codCont = '';
                          this.numCont = numContInt;
                          this.numCont++;
                        });
  }

  cerrar_sesion() {
   /*  this._usuarioProv.borrarStorage();
    this.navCtrl.setRoot(LoginPage); */
  }

}
