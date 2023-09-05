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
// la presenza di liste come listaCommesseTotali sono essenziali alla gestione delle form select 
// poichè le varie form select possono fitrarsi tra loro e serve un backup dei dati totali 
// per esempio se selezione odl ANAC la lista risorse conterrà solo le risorse associate a quell'odl.

semaforoTriggerFiltro = false 

//mstraTabella Ag-grid
showTable = false

//valori delle formSelect: 
odlScelto:any[] = []
commessaScelta:any[] = []
clienteScelto:any[] =  []
parcticeScelta:any[] = []


// contiene i dati della prima schermata
datiCostModel : any[] = []
datiCostModelFiltrati : any[] = []


// inizializzazione oggeto formGroup che contiente tutte le form della pagina pr i filtri
form!: FormGroup;

// inizializzazione oggeto formGroup che contiente tutte le form della pagina pr i dati cost_model
formDati!: FormGroup;

// form control per gestire il serach nelle form-select
commessar = new FormControl()
odlr = new FormControl()
clienter = new FormControl()
practicer = new FormControl()

// boolean che permette o meno di visualizzare il form 
showForm = false; 

//lista che contiene i dati 'correnti' nel senso che questi dati sono soggetti ai filtri dell'utente
risorse: any[] = []
commesse: any[] = []
odls: any[] = []
practices: any[] = [] 
clienti: any[] = [] 

mesi : string[] = [ "Gennaio", "Febbraio", "Marzo" , "Aprile" , "Maggio" , "Giugno" , "Luglio" , "Agosto", "Settembre" , "Ottobre", "Novembre" , "Dicembre"]


//queste liste non sono soggette ai filtri dell'utente 

// lista usata per gestire il filtraggio nella from select degli odl
datiOdlTotali : any = []
datiOdlFiltrati : any = []

// lista usata per gestire il filtraggio nella from select delle commesse 
datiCommesseTotali : any = []
datiCommesseFiltrate : any = []

// lista usata per gestire il filtraggio nella from select dei clienti
datiClientiTotali : any = []
datiClientiFiltrati : any = []

// lista usata per gestire il filtraggio nella from select delle practice
datiPracticeTotali : any = []
datiPrcaticeFiltrate : any = []

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



this.selectDatiOdl()

this.form = this.fb.group({
commessa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
odl: new FormControl("",[ Validators.required,Validators.minLength(1)]),
practice: new FormControl("",[ Validators.required,Validators.minLength(1)]),
cliente: new FormControl("",[ Validators.required,Validators.minLength(1)])
})

this.formDati = this.fb.group({
  odlDati : new  FormControl(),
  descrizioneDati   : new  FormControl(),
  dataInizioIpo : new  FormControl(),
  dataFineIpo : new  FormControl(),
  dataInizioCon  : new  FormControl(),
  dataFineCon  : new  FormControl(),
  responsabile  : new  FormControl(),
  manager : new  FormControl(),

})


this.setupGestioneFiltriForm()
this.setupGestioneForm()



}


selectDatiOdl  = ()  => {
var query = `
    select cm.descrizione as descrizioneOdl, cm.id as id_odl, 
    tc.descrizione as descrizioneTipoCosto, tc.id as id_tipoCosto, 
    p.descrizione as descrizionePractice, p.id as id_practice,
    c2.descrizione as descrizioneCommessa, c2.id as id_commessa,
    c.descrizione as descrizioneCliente, c.id as id_cliente, * 
    from cost_model.cost_model cm  
    inner join cost_model.clienti c  on cm.id_cliente  = c.id  
    inner join cost_model.commesse c2  on c2.id = cm.id_commessa  
    inner join cost_model.practice p  on p.id = cm.id_practice 
    inner join cost_model.dettaglio_cost_model dcm  on dcm.id_cost_model = cm.id
    inner join cost_model.tipi_costi tc  on tc.id  = dcm.id_tipo_costo 
    `

this.insP
.select(query)
.subscribe(response =>{
console.log(response)
var risposta = JSON.parse(JSON.stringify(response)) 
var rispostaRows = risposta.rows
console.log(rispostaRows)
this.datiCostModel = rispostaRows


// popolo la lista delle commesse che verrà mostrata tra le opzioni nel form 
this.commesse =  [...new Set(risposta.rows.map((item:any) =>
    item.descrizionecommessa +"_-_"+item.id_commessa)).values()]
    .map((item:any) => item.split("_-_"))

//riempio la lista che non può essere filtrata con scopop di backup
this.datiCommesseTotali = this.commesse
this.datiCommesseFiltrate = this.commesse

// popolo la lista degli odl che verrà mostrata tra le opzioni nel form 
this.odls =  [...new Set(rispostaRows.map((item:any) =>
    item.descrizioneodl+"_-_"+item.id_odl)).values()]
    .map((item:any) => item.split("_-_"))

//riempio la lista che non può essere filtrata con scopop di backup
this.datiOdlFiltrati = this.odls
this.datiOdlTotali = this.odls

// popolo la lista dei clienti che verrà mostrata tra le opzioni nel form 
this.clienti =  [...new Set(rispostaRows.map((item:any) =>
    item.descrizionecliente+"_-_"+item.id_cliente)).values()]
    .map((item:any) => item.split("_-_"))

//riempio la lista che non può essere filtrata con scopop di backup
this.datiClientiFiltrati = this.clienti
this.datiClientiTotali = this.clienti

// popolo la lista delle practice che verrà mostrat tra le opzioni nel form 
this.practices =  [...new Set(rispostaRows.map((item:any) =>
    item.descrizionepractice+"_-_"+item.id_practice)).values()]
    .map((item:any) => item.split("_-_"))

//riempio la lista che non può essere filtrata con scopop di backup
this.datiPracticeTotali = this.practices
this.datiPrcaticeFiltrate = this.practices



})
}


selectTabella  = ()  => {

/* questa funzione  serve a determinare  la struttura della tabella cost_model, essa risulta dinamica per il semplice 
  fatto che va ggiunta come colonna ogni mese-anno presente nel dettaglio_costmodel. 
  Quindi la struttura della tabella è strettamente dinamica, 
  per soddisfare questo requisito viene utilizzato un meccanismo a doppia query.
  La prima query  (`select distinct anno,mese from cost_model.dettaglio_cost_model dcm2 order by anno `)
  permette di prendere tutte le coppie anno-mese presenti nel dettaglio_costmodel, 
  successivamente queste coppie vengono utilizzate per creare la seconda query  
  successivamente i risultati della seconda query vengono iterati per costrutire il columnDefs ag-grid*/

var id_commessa = this.commessaScelta.length === 2 ?  this.commessaScelta[1]+"" : ""
var id_practice = this.parcticeScelta.length === 2 ?  this.parcticeScelta[1]+"" : ""
var id_cliente = this.clienteScelto.length === 2 ? this.clienteScelto[1]+"" : ""
var id_odl = this.odlScelto.length === 2 ? this.odlScelto[1]+"" : ""
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
          where c2.id  = '`+id_commessa +`' 
          and c.id =  '`+id_cliente+`' 
          and p.id = '`+id_practice+ `' 
          and cm.id = '`+id_odl+ `'
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


eseguiFiltroDati = () => {
if (this.semaforoTriggerFiltro) 
{
  this.semaforoTriggerFiltro = false 
  console.log("semaforo")
  return 
}

if(this.clienteScelto.length < 2 || this.commessaScelta.length <2 || this.parcticeScelta.length < 2 || this.odlScelto.length < 2 )
{   
    this.formDati.reset()
    this.showTable = false
    return 
}

console.log(this.datiCostModelFiltrati)
this.formDati.controls["odlDati"].setValue(this.datiCostModelFiltrati[0].odl)
this.formDati.controls["descrizioneDati"].setValue(this.datiCostModelFiltrati[0].descrizioneodl)
this.formDati.controls["dataInizioIpo"].setValue(this.datiCostModelFiltrati[0].data_inizio_ipotizzata)
this.formDati.controls["dataFineIpo"].setValue(this.datiCostModelFiltrati[0].data_fine_ipotizzata)
this.formDati.controls["dataInizioCon"].setValue(this.datiCostModelFiltrati[0].data_inizio_contrattuale)
this.formDati.controls["dataFineCon"].setValue(this.datiCostModelFiltrati[0].data_fine_contrattuale)
this.formDati.controls["responsabile"].setValue(this.datiCostModelFiltrati[0].responsabile_vendita)
this.formDati.controls["manager"].setValue(this.datiCostModelFiltrati[0].project_manager)
this.showTable = true
this.selectTabella()

}

eseguiFiltroFiltri = () => {

if (this.semaforoTriggerFiltro) 
{
  console.log("semaforo")
  return 
}



var id_commessa = this.commessaScelta.length === 2 ?  this.commessaScelta[1]+"" : ""
var id_practice = this.parcticeScelta.length === 2 ?  this.parcticeScelta[1]+"" : ""
var id_cliente = this.clienteScelto.length === 2 ? this.clienteScelto[1]+"" : ""
var id_odl = this.odlScelto.length === 2 ? this.odlScelto[1]+"" : ""

console.log(id_cliente,id_commessa,id_practice,id_odl)

var datifiltrati = this.datiCostModel.filter((item) => {
  
  return ((item.id_commessa+"") === id_commessa || id_commessa === "") && 
  ((item.id_cliente+"") === id_cliente || id_cliente === "") &&
  ((item.id_odl+"") === id_odl || id_odl === "") &&
  ((item.id_practice+"") === id_practice || id_practice === "") 
  
})

this.datiCostModelFiltrati = datifiltrati

this.commesse =  [...new Set(datifiltrati.map((item:any) =>
  item.descrizionecommessa +"_-_"+item.id_commessa)).values()]
  .map((item:any) => item.split("_-_"))

//riempio la lista  filtrata 
this.datiCommesseFiltrate = this.commesse

// popolo la lista degli odl che verrà mostrata tra le opzioni nel form 
this.odls =  [...new Set(datifiltrati.map((item:any) =>
  item.descrizioneodl+"_-_"+item.id_odl)).values()]
  .map((item:any) => item.split("_-_"))

//riempio la lista filtrata 
this.datiOdlFiltrati = this.odls

// popolo la lista dei clienti che verrà mostrata tra le opzioni nel form 
this.clienti =  [...new Set(datifiltrati.map((item:any) =>
  item.descrizionecliente+"_-_"+item.id_cliente)).values()]
  .map((item:any) => item.split("_-_"))

//riempio la lista filtrata 
this.datiClientiFiltrati = this.clienti


// popolo la lista delle practice che verrà mostrat tra le opzioni nel form 
this.practices =  [...new Set(datifiltrati.map((item:any) =>
  item.descrizionepractice+"_-_"+item.id_practice)).values()]
  .map((item:any) => item.split("_-_"))

//riempio la lista filtrata 
this.datiPrcaticeFiltrate = this.practices


console.log(this.commesse[0],this.form.controls["commessa"].value   )
console.log(this.clienti[0],this.form.controls["cliente"].value )
console.log(this.odls[0],this.form.controls["odl"].value )
console.log(this.practices[0],this.form.controls["practice"].value, JSON.stringify(this.practices[0] ) === JSON.stringify(this.form.controls["practice"].value)  )

if(this.commesse[0] != this.form.controls["commessa"].value && this.listCompare(this.form.controls["commessa"].value , this.commesse[0]))
{ 
this.semaforoTriggerFiltro = true
this.form.controls["commessa"].setValue(this.commesse[0])
console.log("entrato in commesse")
}

if(this.clienti[0] != this.form.controls["cliente"].value && this.listCompare(this.form.controls["cliente"].value , this.clienti[0]))
{ 
this.semaforoTriggerFiltro = true
this.form.controls["cliente"].setValue(this.clienti[0])
console.log("entrato in clienti")
}

if(this.odls[0] != this.form.controls["odl"].value && this.listCompare(this.form.controls["odl"].value , this.odls[0]))
{ 
this.semaforoTriggerFiltro = true
this.form.controls["odl"].setValue(this.odls[0])
console.log("entrato in odl")
}

if(this.practices[0] != this.form.controls["practice"].value && this.listCompare(this.form.controls["practice"].value , this.practices[0]))
{ 
this.semaforoTriggerFiltro = true
this.form.controls["practice"].setValue(this.practices[0])
console.log("entrato in practice")
}



}



listCompare = (a :any ,b :any ) => {

  return JSON.stringify(a) === JSON.stringify(b)

}
setupGestioneForm  = ()  => { 
  


this.form.valueChanges.subscribe((data) => {
      
      this.clienteScelto = data.cliente === undefined  || data.cliente === "" ? [] : data.cliente
      this.commessaScelta = data.commessa === undefined || data.commessa === "" ? [] : data.commessa
      this.parcticeScelta = data.practice === undefined || data.practice === "" ? [] : data.practice
      this.odlScelto = data.odl === undefined || data.odl === "" ? [] : data.odl
      this.eseguiFiltroFiltri()
      this.eseguiFiltroDati()
      

      })

}

setupGestioneFiltriForm = () => {

//pezzo di codice che prmette la gestione dei filtri sulla select form delle commesse
this.commessar.valueChanges.subscribe(data => {
    
  var appoggio  = this.datiCommesseFiltrate.filter((item : string) =>   {
        
          return item[0].toLowerCase().includes((""+data).toLowerCase())
    })

  this.commesse = appoggio
  })

//pezzo di codice che prmette la gestione dei filtri sulla select form delgli odl
this.odlr.valueChanges.subscribe(data => {
    
  var appoggio  = this.datiOdlFiltrati.filter((item : string) =>   {
        
          return item[0].toLowerCase().includes((""+data).toLowerCase())
    })

  this.odls = appoggio
  })

//pezzo di codice che prmette la gestione dei filtri sulla select form dei clienti
this.clienter.valueChanges.subscribe(data => {
    
  var appoggio  = this.datiClientiFiltrati.filter((item : string) =>   {
        
          return item[0].toLowerCase().includes((""+data).toLowerCase())
    })

  this.clienti = appoggio
  })


//pezzo di codice che prmette la gestione dei filtri sulla select form delle practice
this.practicer.valueChanges.subscribe(data => {
    
    var appoggio  = this.datiPrcaticeFiltrate.filter((item : string) =>   {
          
            return item[0].toLowerCase().includes((""+data).toLowerCase())
      })
  
    this.practices = appoggio
    })
}

}





