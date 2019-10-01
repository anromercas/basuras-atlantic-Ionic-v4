import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalificaPage } from './califica.page';
import { PipesModule } from '../../pipes/pipes.module';


const routes: Routes = [
  {
    path: '',
    component: CalificaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CalificaPage]
})
export class CalificaPageModule {}
