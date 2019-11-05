import { Usuario } from './usuario.interface';

export interface Basura {
    nombre: string;
    zona: string;
    numeroContenedor?: number;
    codigoContenedor?: string;
    calificacion?: number;
    observaciones?: string;
    fecha?: string;
    img?: string;
    residuo?: string;
    imgContenedor?: string;
    imgDetalle?: string;
    estado?: string;
    _id?: string;
    usuario?: Usuario;
    color?: string;
    habilitado?: boolean;
}