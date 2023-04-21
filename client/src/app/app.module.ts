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
import { InserisciRisorsaComponent } from './inserisci-risorsa/inserisci-risorsa.component';
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
import { InserisciRuoloComponent } from './inserisci-ruolo/inserisci-ruolo.component';
import { InserisciLivelloComponent } from './inserisci-livello/inserisci-livello.component';
import { InserisciNuovaCommessaComponent } from './inserisci-nuova-commessa/inserisci-nuova-commessa.component';
import { InserisciCommessaRisorsaComponent } from './inserisci-commessa-risorsa/inserisci-commessa-risorsa.component';
import { NuovaPracticeComponent } from './nuova-practice/nuova-practice.component';
import { PracticeRisorsaComponent } from './practice-risorsa/practice-risorsa.component';
import { PracticeResponsabileComponent } from './practice-responsabile/practice-responsabile.component';
import { GestioneRendicontazioneComponent } from './gestione-rendicontazione/gestione-rendicontazione.component';
import { ConsolidaRendicontazioneComponent } from './consolida-rendicontazione/consolida-rendicontazione.component'

//const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponentComponent,
    InserisciRisorsaComponent,
    InserisciRuoloComponent,
    InserisciLivelloComponent,
    InserisciNuovaCommessaComponent,
    InserisciCommessaRisorsaComponent,
    NuovaPracticeComponent,
    PracticeRisorsaComponent,
    PracticeResponsabileComponent,
    GestioneRendicontazioneComponent,
    ConsolidaRendicontazioneComponent,
    
    
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
