import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponentComponent } from './error-component/error-component.component';
import { HomeComponent } from './home/home.component';
import { CommesseRisorseComponent } from './commesse-risorse/commesse-risorse.component';
import { LivelliComponent } from './livelli/livelli.component';
import { CommesseComponent } from './commesse/commesse.component';
import { RisorseComponent } from './risorse/risorse.component';
// import { RuoliComponent } from './ruoli/ruoli.component';
import { PracticeComponent } from './practice/practice.component';
//import { PracticeResponsabileComponent } from './practice-responsabile/practice-responsabile.component';
// import { PracticeRisorsaComponent } from './__practice-risorsa/practice-risorsa.component';
import { GestioneRendicontazioneComponent } from './gestione-rendicontazione/gestione-rendicontazione.component';
import { ProspettoGeneraleComponent } from './prospetto-generale/prospetto-generale.component';
import { ClientiComponent } from './clienti/clienti.component';
import { OdlComponent } from './odl/odl.component';

const routes: Routes = [  
  {path : 'rendicontazione', component : GestioneRendicontazioneComponent},
  {path : 'prospetto-generale' , component : ProspettoGeneraleComponent},
  {path : 'practice', component : PracticeComponent},
  // {path : 'insprar', component : PracticeRisorsaComponent},
  {path : 'risorse', component : RisorseComponent},
  {path : 'commesse', component : CommesseComponent},
  {path : 'livelli', component : LivelliComponent},
  // {path : 'inspr', component : InserisciRuoloComponent},
  //{path : 'inspd', component : PracticeResponsabileComponent},
  {path : 'giornate', component : CommesseRisorseComponent},
  {path : 'clienti', component : ClientiComponent},
  {path : 'odl', component : OdlComponent},
  {path : '', component : HomeComponent},
  {path : '**', component : ErrorComponentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
