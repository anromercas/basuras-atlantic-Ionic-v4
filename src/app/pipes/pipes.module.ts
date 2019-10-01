import { NgModule } from '@angular/core';
import { ImagenDetallePipe } from './imagen-detalle.pipe';



@NgModule({
  declarations: [ImagenDetallePipe],
  imports: [],
  exports: [
    ImagenDetallePipe
  ]
})
export class PipesModule { }
