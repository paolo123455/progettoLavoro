import { Component, OnInit } from '@angular/core';
import { InsPService } from 'src/services/ins-p.service';
import { AgGridAngular } from 'ag-grid-angular'
import { ViewChild } from '@angular/core';
import { FormBuilder, FormArray,FormControl,FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { CellClickedEvent, CellEditingStartedEvent, CellValueChangedEvent, ColDef, ColGroupDef, GetRowIdFunc, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import Swal from 'sweetalert2';

@Component({
selector: 'app-cost-model',
templateUrl: './cost-model.component.html',
styleUrls: ['./cost-model.component.css']
})
export class CostModelComponent {
constructor(
private http: HttpClient, 
private fb:FormBuilder,
private insP : InsPService)
{ }


// istanzio le variabili utili alla gestione dei form comprese le select 
// la presenza di liste come risorse2 sono essenziali alla gestione delle form select 
// poichè le varie form select possono fitrarsi tra loro e serve un backup dei dati totali 
// per esempio se selezione odl ANAC la lista risorse conterrà solo le risorse associate a quell'odl.

form!: FormGroup; 
myMap = new Map<string, string>();
risorse: any[] = []
risorse2: any[] = []
commesse: any[] = []
commesse2: any[] = []
odls: any[] = []
odl2: any[] = []
practice: any[] = [] 
practice2: any[] = [] 
mesi : string[] = [ "Gennaio", "Febbraio", "Marzo" , "Aprile" , "Maggio" , "Giugno" , "Luglio" , "Agosto", "Settembre" , "Ottobre", "Novembre" , "Dicembre"]

datiOdlTotali : any = []
datiOdlFiltrati : any = []

// For accessing the Grid's API
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;

// Inizializzazione ColDef (ag-grid api)
public columnDefs : ColGroupDef[] = [];

// attributi di default del colDef per utilizzare le api ag-grid
public defaultColDef: ColDef = {
sortable: true,
filter: true,
};
public rowData!: any[];

ngOnInit(): void {

this.selectTabella()



this.rowData = [{"descrizione_costo" : "prova" ,   "totale_2024" : "30" , "totale_2023" : "30", 
        "gennaio_2023" : "10" , "febbraio_2023" : "20" ,   "gennaio_2024" : "10" , "febbraio_2024" : "20"}]

}


selectDatiOdl  = ()  => {
var query = `select * from cost_model.cost_model cm  
      inner join cost_model.clienti c  on cm.id_cliente  = c.id  
      inner join cost_model.commesse c2  on c2.id = cm.id_commessa  
      inner join cost_model.practice p  on p.id = cm.id_practice 
      inner join cost_model.dettaglio_cost_model dcm  on dcm.id_cost_model = cm.id
      inner join cost_model.tipi_costi tc  on tc.id  = dcm.id_tipo_costo 
      and tc.id_gruppo_costo = 1`

this.insP
.select(query)
.subscribe(response =>{
  console.log(response)
  this.datiOdlTotali = response


})




}

selectTabella  = ()  => {

var query = `select distinct anno,mese from cost_model.dettaglio_cost_model dcm2 order by anno `

this.insP
.select(query)
.subscribe(response =>{

var baseQuery = `select tc.descrizione as Descrizione_costo`
var fromQuery = ` 
            from cost_model.cost_model cm  
            inner join cost_model.clienti c  on cm.id_cliente  = c.id  
            inner join cost_model.commesse c2  on c2.id = cm.id_commessa  
            inner join cost_model.practice p  on p.id = cm.id_practice 
            inner join cost_model.dettaglio_cost_model dcm  on dcm.id_cost_model = cm.id
            inner join cost_model.tipi_costi tc  on tc.id  = dcm.id_tipo_costo 
            and tc.id_gruppo_costo = 1
            where c2.id  = 2
            group by tc.descrizione
            
            `

var constructionQuery = ``
var risposta = JSON.parse(JSON.stringify(response)) 
var rispostaRows = risposta.rows
console.log(risposta)

if (risposta.rowCount > 0 )
{
var jsonTracciaTotaliAnni : any = {}
for (let element of rispostaRows)
{  

var mese = this.mesi[element.mese -1]
var anno = element.anno


constructionQuery += ', COALESCE(Min(Case When mese = ' +element.mese+' AND anno = ' +element.anno +' Then budget::FLOAT End)  , 0 ) as "'+anno+"_"+mese+'_budget" , '
constructionQuery += 'COALESCE(Min(Case When mese = ' +element.mese+' AND anno = ' +element.anno +' Then consuntivo::FLOAT End), 0 ) as  "'+anno+"_"+mese+'_consuntivo"'

}

}
var totalQuery = baseQuery + constructionQuery + fromQuery
console.log(totalQuery)
var children : (ColGroupDef<any> | ColDef<any>)[] = []
var annoConfronto = "" ; 
var totaleBudget = 0
var totaleConsuntivo = 0
var contatore = 0
this.insP
.select(totalQuery)
.subscribe(response =>{
  console.log(response)
  var risposta = JSON.parse(JSON.stringify(response)) 
  var rispostaRows = risposta.rows
  for (let element of rispostaRows)
    {   
      totaleBudget = 0
      totaleConsuntivo = 0
      console.log("ripetizione")
      for (let key  in element )
        {   
            if (key.split("_").length < 3 )
            { 
              if(contatore === 0 )
                { console.log("entrato")
                  this.columnDefs.push( {
                  headerName: 'costi',
                  children: [{ field: 'descrizione_costo' }]
                  }) 
                }
            continue
            }

            var anno = key.split("_")[0]
            var tipo = key.split("_")[2]
            var mese = key.split("_")[1]

            if(anno != annoConfronto && annoConfronto != "")
            {  
              console.log("test" , anno , annoConfronto , totaleBudget, totaleConsuntivo)
    
              if (contatore === 0 ) 
              {
              children.push({ field: "totale_conusntivo_" + annoConfronto,headerName : "totale_consuntivo", columnGroupShow: 'open' })
              children.push({ field: "totale_budget_" + annoConfronto,headerName : "totale_budget", columnGroupShow: 'open' })
        
              this.columnDefs.push( {
                headerName: annoConfronto,
                children: children
                }) 
              children = []
                }
            totaleBudget = 0
            totaleConsuntivo = 0
            annoConfronto = anno

            }
            else 
            {  
              if (contatore === 0)
                {
                   children.push({ field: key,headerName : tipo+"_" + mese, columnGroupShow: 'closed' })
                }
    
              annoConfronto = anno
              if (tipo === "consuntivo")
                {
                  totaleConsuntivo += element[key]
                  element["totale_conusntivo_" + annoConfronto] = totaleConsuntivo
                }
              if (tipo === "budget")
                {
                  totaleBudget += element[key]
                  element["totale_budget_" + annoConfronto] = totaleBudget
                }
    
            }
        }
     console.log(totaleBudget,totaleConsuntivo)
     console.log(rispostaRows)
     if (contatore === 0 ) 
      {
        children.push({ field: "totale_conusntivo_" + annoConfronto,headerName : "totale_consuntivo", columnGroupShow: 'open' })
        children.push({ field: "totale_budget_" + annoConfronto,headerName : "totale_budget", columnGroupShow: 'open' })
        
        this.columnDefs.push( {
        headerName: annoConfronto,
        children: children
        }) 
      children = []
      }
     contatore++  
}
this.rowData = rispostaRows
this.agGrid.api.setColumnDefs(this.columnDefs)



})

}) 
}




}





