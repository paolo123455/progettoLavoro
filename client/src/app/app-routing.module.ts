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
import { PracticeResponsabileComponent } from './practice-responsabile/practice-responsabile.component';
import { PracticeRisorsaComponent } from './practice-risorsa/practice-risorsa.component';

const routes: Routes = [ 
  {path : 'practice', component : NuovaPracticeComponent},
  {path : 'insprar', component : PracticeRisorsaComponent},
  {path : '', component : HomeComponent},
  {path : 'insp', component : InserisciRisorsaComponent},
  {path : 'insc', component : InserisciNuovaCommessaComponent},
  {path : 'inspl', component : InserisciLivelloComponent},
  {path : 'inspr', component : InserisciRuoloComponent},
  {path : 'inspd', component : PracticeResponsabileComponent},
  {path : 'inscr', component : InserisciCommessaRisorsaComponent},
{path : '**', component : ErrorComponentComponent}];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
