import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponentComponent } from './error-component/error-component.component';
import { HomeComponent } from './home/home.component';
import { InserisciCommessaRisorsaComponent } from './inserisci-commessa-risorsa/inserisci-commessa-risorsa.component';
import { InserisciLivelloComponent } from './inserisci-livello/inserisci-livello.component';
import { InserisciNuovaCommessaComponent } from './inserisci-nuova-commessa/inserisci-nuova-commessa.component';
import { InserisciRisorsaComponent } from './inserisci-risorsa/inserisci-risorsa.component';
import { InserisciRuoloComponent } from './inserisci-ruolo/inserisci-ruolo.component';
import { NuovaPracticeComponent } from './nuova-practice/nuova-practice.component';
//import { PracticeResponsabileComponent } from './practice-responsabile/practice-responsabile.component';
import { PracticeRisorsaComponent } from './practice-risorsa/practice-risorsa.component';
import { GestioneRendicontazioneComponent } from './gestione-rendicontazione/gestione-rendicontazione.component';
import { ConsolidaRendicontazioneComponent } from './consolida-rendicontazione/consolida-rendicontazione.component';
import { InsClienteComponent } from './ins-cliente/ins-cliente.component';
import { InsOdlComponent } from './ins-odl/ins-odl.component';

const routes: Routes = [  
  {path : 'rendicontazione', component : GestioneRendicontazioneComponent},
  {path : 'prospetto-generale' , component : ConsolidaRendicontazioneComponent},
  {path : 'practice', component : NuovaPracticeComponent},
  // {path : 'insprar', component : PracticeRisorsaComponent},
  {path : 'risorse', component : InserisciRisorsaComponent},
  {path : 'commesse', component : InserisciNuovaCommessaComponent},
  {path : 'livelli', component : InserisciLivelloComponent},
  // {path : 'inspr', component : InserisciRuoloComponent},
  //{path : 'inspd', component : PracticeResponsabileComponent},
  {path : 'giornate', component : InserisciCommessaRisorsaComponent},
  {path : 'clienti', component : InsClienteComponent},
  {path : 'odl', component : InsOdlComponent},
  {path : '', component : HomeComponent},
  {path : '**', component : ErrorComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
