import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EjemplosPage } from './ejemplos.page';
import { ImagenModalPage } from '../imagen-modal/imagen-modal.page';
import { ImagenModalPageModule } from '../imagen-modal/imagen-modal.module';

const routes: Routes = [
  {
    path: '',
    component: EjemplosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImagenModalPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EjemplosPage],
  entryComponents: [
    ImagenModalPage
  ]
})
export class EjemplosPageModule {}
