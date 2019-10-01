import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BasuraPage } from './basura.page';
import { PipesModule } from '../../pipes/pipes.module';
import { ImagenModalPage } from '../imagen-modal/imagen-modal.page';
import { ImagenModalPageModule } from '../imagen-modal/imagen-modal.module';

const routes: Routes = [
  {
    path: '',
    component: BasuraPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    ImagenModalPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BasuraPage],
  entryComponents: [
    ImagenModalPage
  ]
})
export class BasuraPageModule {}
