import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ColorPickerModule } from 'primeng/colorpicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';

// Routing
import { RouterModule, Routes } from '@angular/router';
import { MessageService } from 'primeng/api';

// Components & Services
import { CardCreatorComponent } from './card-creator';
import { CardCreatorService } from '../../services/card-creator';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  {
    path: 'create',
    component: CardCreatorComponent
  },
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    CardCreatorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    
    // PrimeNG
    StepsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    TextareaModule, 
    SelectModule,
    ColorPickerModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [
    CardCreatorService,
    MessageService
  ]
})
export class CardCreatorModule { }