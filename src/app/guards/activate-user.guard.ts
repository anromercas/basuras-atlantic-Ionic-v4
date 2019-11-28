import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateUserGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService ) {

  }

  canActivate() {
    return this.usuarioService.validaToken();

  }
}
