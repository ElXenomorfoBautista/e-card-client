import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { CardViewerComponent } from './components/card-viewer/card-viewer';
import { ECardRoutingModule } from './e-card-routing-module';
import { CardService } from './services/card';
import { SelectModule } from 'primeng/select';


@NgModule({
  declarations: [
        CardViewerComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ECardRoutingModule,
    // PrimeNG
    CardModule,
    ButtonModule,
    DividerModule,
    SkeletonModule,
    ChipModule,
    AvatarModule,
    TooltipModule,
    SelectModule
  ],
  providers: [
    CardService
  ]
})
export class ECardModule { }