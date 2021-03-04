import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    MatDialogModule
  ],
  exports: [
    MatGridListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    MatDialogModule
  ]
})
export class AngularMaterialModule { }
