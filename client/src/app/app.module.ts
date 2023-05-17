import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { Routes } from '@angular/router';
import { ErrorComponentComponent } from './error-component/error-component.component';
import { RisorseComponent } from './risorse/risorse.component';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {ReactiveFormsModule} from '@angular/forms'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {MatButtonModule} from '@angular/material/button'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatChipsModule} from '@angular/material/chips'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatNativeDateModule} from '@angular/material/core';
// import { RuoliComponent } from './ruoli/ruoli.component';
import { LivelliComponent } from './livelli/livelli.component';
import { CommesseComponent } from './commesse/commesse.component';
import { CommesseRisorseComponent } from './commesse-risorse/commesse-risorse.component';
import { PracticeComponent } from './practice/practice.component';
// import { PracticeRisorsaComponent } from './__practice-risorsa/practice-risorsa.component';
// import { PracticeResponsabileComponent } from './practice-responsabile/practice-responsabile.component';
import { RendicontazioneComponent } from './rendicontazione/rendicontazione.component';
import { ProspettoGeneraleComponent } from './prospetto-generale/prospetto-generale.component';
import { ClientiComponent } from './clienti/clienti.component';
import { OdlComponent } from './odl/odl.component';
import { ProspettoMeseComponent } from './prospetto-mese/prospetto-mese.component'

//const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponentComponent,
    RisorseComponent,
    // RuoliComponent,
    LivelliComponent,
    CommesseComponent,
    CommesseRisorseComponent,
    PracticeComponent,
    // PracticeRisorsaComponent,
    // PracticeResponsabileComponent,
    RendicontazioneComponent,
    ProspettoGeneraleComponent,
    ClientiComponent,
    OdlComponent,
    ProspettoMeseComponent,
    
    
  ],
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    BrowserModule,
    MatNativeDateModule,
    AppRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    HttpClientModule,
   // SocketIoModule.forRoot(config),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
