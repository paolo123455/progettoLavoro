
import { Component, OnInit } from '@angular/core';
import { InsPService } from 'src/services/ins-p.service';
import { AgGridAngular } from 'ag-grid-angular'
import {  ViewChild } from '@angular/core';
import {FormBuilder, FormArray,FormControl,FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { CellClickedEvent, CellEditingStartedEvent, CellValueChangedEvent, ColDef, GetRowIdFunc, GridReadyEvent } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nrisore',
  templateUrl: './nrisore.component.html',
  styleUrls: ['./nrisore.component.css']
})
export class NrisoreComponent {

  constructor(
    private fb:FormBuilder,
    private insP : InsPService
  ){ }
 
//collegamento oggetto ag-grid 
@ViewChild(AgGridAngular) agGrid!: AgGridAngular;

//variabili per il funzionamento delle select: 
livelli: any[] = []
ruoli: any[] = []
practice : any[] = []
livelli2: any[] = []
ruoli2: any[] = []
practice2 : any[] = []
disabilitato = false;
showForm = false;
ruolor = new FormControl()
livellor = new FormControl()
practicer = new FormControl()
nome = ""
cognome = ""
email = ""
date : Date = new Date
ruolo : any[]= []
livello : any[] = []
practicet: any[] = []
data = ""

// oggetto form per gestione del form 
form!: FormGroup; 

// oggetto ag-grid che contiene le righe 
public rowData$!: Observable<any[]>;

//contiene i dati 
private dati : any = null

// oggetto ag-grid che contiene le colonne 
public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
};
public columnDefs : ColDef[] = [
  {
    cellRenderer: (params : any) => {return '<div><button type="button" class="btn btn-sm"><i class="bi bi-trash-fill" style="color:red"></i></button></div>'},
    maxWidth: 34,
    filter: false,
    suppressMovable: true,
    lockPosition: 'left',
    cellClass: 'button-cell'
  }
];


ngOnInit(): void {

  this.setup1()
  this.setup2()
  this.setup3()
  this.select()
  this.strucElaboration();
  this.form= this.fb.group({
    nome : new FormControl("",[ Validators.required,Validators.minLength(1)]),
    cognome : new FormControl("",[ Validators.required,Validators.minLength(1)]),
    email : new FormControl("",[ Validators.required,Validators.minLength(1)]),
    ruolo : '',
    livello : '',
    practice : '' ,
    data : '',
  });

   //parte di codice che intercetta le modifiche  dei form ed effettua i filtri sui dati
   this.form.valueChanges.subscribe(data => {

    
    // prendo i dati utili per il filtro nei form

    // normalizzo i dati a lista in caso il record nel form non fosse inserito
    // poicheè in caso di record non inserito il form prende '' e sarebbe difficile da gestire con un programma 
    // che si aspetta delle liste (form a selezione multipla)
    
    this.livello = data.livello 
    this.livello = this.livello === undefined  || this.livello === null || data.livello === '' ? [] : this.livello
    this.ruolo = data.ruolo
    this.ruolo = this.ruolo === undefined  || this.ruolo === null || data.ruolo === '' ? [] : this.ruolo
    
    this.practicet = data.practice
    this.practicet = this.practicet === undefined  || this.practicet === null || data.practice === '' ? [] : this.practicet
    this.nome = data.nome
    this.nome = this.nome === undefined || this.nome === null  ? "" : this.nome.toLowerCase()
    this.cognome = data.cognome
    this.cognome = this.cognome === undefined || this.cognome === null ? "" : this.cognome.toLowerCase()
    this.email = data.email
    this.email = this.email === undefined || this.email === null ? "" : this.email.toLowerCase()
    this.date = data.data
    
    this.disabilitato = this.form.valid && this.ruolo.length <= 1 && this.livello.length <= 1 && this.practicet.length <= 1 



    var nuoviDati = this.dati.filter
     (( item: {
                 descrizione_livello : string
                 descrizione_ruolo : string
                 descrizione : string
                 nome : string 
                 cognome : string 
                 email : string 

              
              }) =>  
                 {
                   { 
                     var flag2 = this.livello.length === 0 
                     var flag = false 
                     
                     var flag3 = this.ruolo.length ===  0   
                     var flag4 = this.practicet.length === 0 
                     for (var i in this.livello)
                     {
                        if (this.livello[i].descrizione2.includes(item.descrizione_livello))
                        {
                           flag2 = true 
                           break
                        }

                     }
                     flag = flag2

                     for (var i in this.ruolo)
                     {
                        if (this.ruolo[i].descrizione2.includes(item.descrizione_ruolo))
                        {
                           flag3 = true 
                           break
                        }

                     }
                     for (var i in this.practicet)
                     {
                        if (this.practicet[i].descrizione2.includes(item.descrizione))
                        {
                           flag4 = true 
                           break
                        }

                     }
                     
                     var flag5 = item.nome.toLowerCase().includes(this.nome) 
                     var flag6 = item.cognome.toLowerCase().includes(this.cognome) 
                     var flag7 = item.email.toLowerCase().includes(this.email) 

                     return flag2 && flag3 && flag4 && flag5 && flag6 && flag7
                   } 
                 })
       
       this.agGrid.api.setRowData(nuoviDati)
    })





  // parte di codice necessaria per il search dell'odl nel filtro 
  this.ruolor.valueChanges.subscribe(data => {
      
    var appoggio  = this.ruoli2.filter(( item: {
       descrizione2 : string
      }) =>   {
          return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
      })
  
   this.ruoli = appoggio

  })
  this.practicer.valueChanges.subscribe(data => {
      
    var appoggio  = this.practice2.filter(( item: {
       descrizione2 : string
      }) =>   {
          return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
      })
  
   this.practice = appoggio

  })
  this.livellor.valueChanges.subscribe(data => {
      
    var appoggio  = this.livelli2.filter(( item: {
       descrizione2 : string
      }) =>   {
          return (item.descrizione2 +"").toLowerCase().includes((""+data).toLowerCase())
      })
  
   this.livelli = appoggio

  })
 
  
}

// funzioni di setup per la gstione delle select
setup1= () => {
  var query = "select distinct descrizione_ruolo  as descrizione2 , id_ruolo as id from new_rilatt.ruoli order by descrizione2 ";
  this.insP.select(query).subscribe(response =>{
    var dati = JSON.parse(JSON.stringify(response)).rows;
    this.ruoli = dati;
    this.ruoli2 = dati; 

  });
}
setup2= () => {
  var query = "select distinct descrizione_livello  as descrizione2 , id_livello as id from new_rilatt.livelli order by descrizione2 ";
  this.insP.select(query).subscribe(response =>{
    var dati = JSON.parse(JSON.stringify(response)).rows;
    this.livelli = dati;
    this.livelli2 = dati

  });
}

setup3= () => {
  var query = "select distinct descrizione  as descrizione2 , id  from cost_model.practice order by descrizione2 ";
  this.insP.select(query).subscribe(response =>{
    var dati = JSON.parse(JSON.stringify(response)).rows;
    this.practice = dati;
    this.practice2 = dati

  });
}


/* 
funzioni per la gestione degli eventi  di ag-grid
*/ 
onCellClicked( e: CellClickedEvent): void {
 
}


  onCellEditingStarted( e: CellEditingStartedEvent): void { 
 
  }
  onCellValueChanged( e: CellValueChangedEvent): void {}


  onGridReady(params: GridReadyEvent) {

  }

 // funzione per gestione id ag-grid
  getRowId: GetRowIdFunc<any>  = params => (params.data.id_risorsa + "-" + params.data.id_livello + "-" + params.data.dtinizio_livello);

  inserisciRiga = () : void => {
   
    var practice = this.practicet[0] === undefined ? null : this.practicet[0].id
    var ruolo = this.ruolo[0] === undefined ? null : this.ruolo[0].id
    var livello = this.livello[0] === undefined ? null : this.livello[0].id
   
    var flag2 = false
    var falg1 = false;
 
    var query = "insert into new_rilatt.risorse (nome , cognome , email ,id_ruolo , id_practice ) values ('"+this.nome+"','"+this.cognome+"','"+this.email+"',"+ruolo+","+practice+" )  RETURNING id_risorsa";
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var risposta = JSON.parse(JSON.stringify(response));
      if(risposta.upd === "ok") {     
        falg1 = true;
        var id_risorsa = risposta.rows[0].id_risorsa;
        if(true) {//!(insertRL.livello.descrizione2 === undefined || insertRL.livello.descrizione2 === ""))
          var descrizioneU : String = livello;
          
          console.log(this.date)
          if(livello != null && this.date != null && this.date != undefined  && this.date.toString() != '') {
            var query2 = "insert into new_rilatt.risorse_livello(id_risorsa, id_livello , dtinizio_livello, attivo) values ('"+id_risorsa+"','"+livello+"','"+( this.date === null || this.data ===  undefined ? null : this.date.toUTCString())+"',"+true+" )"
            console.log(query2)
            this.insP.select(query2).subscribe(response =>{
              console.log(response)
              var risposta = JSON.parse(JSON.stringify(response)) 
              if(risposta.upd === "ok") {
                flag2 = true;
                this.select();
              } else {
                console.log("errore");
                console.log(risposta);
               
                Swal.fire({
                  icon:  'error',  
                  title: 'errore',  
                  text:  'Si è verificato un errore.',  
                });
              }
            });
          }
        }
        this.form.reset();
       
        this.select();
      } else {
        
       
        Swal.fire({
          icon:  'error',  
          title: 'errore',  
          text:  'Si è verificato un errore.',  
        });
      }
    });
  
   

 

   

  }



  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid.columnApi.autoSizeAllColumns(false);
  }

  select = () => {
    var query = "Select distinct  r.* ,rl.id_risorsa_livello,rl.id_livello, rl.dtinizio_livello,  rl.dtfine_livello, pra2.descrizione,l.descrizione_livello  , r3.descrizione_ruolo   from new_rilatt.risorse r " 
       +"left join new_rilatt.risorse_livello  rl  on  r.id_risorsa  = rl.id_risorsa and attivo = true  " 
       +" left  join  new_rilatt.livelli l  on l.id_livello  = rl.id_livello "
       +" left  join  new_rilatt.ruoli r3   on r3.id_ruolo  = r.id_ruolo "
       +"left join cost_model.practice pra2 on r.id_practice = pra2.id  order by r.nome  ";
    this.insP.select(query).subscribe(response =>{
      console.log(response) ;
      this.dati = JSON.parse(JSON.stringify(response)).rows;  
      this.agGrid.api.setRowData(this.dati);
      this.resizeColumnWidth();
    });
  }
  


  // funzione per la gestione della struttura della maschera (colonne della tabella)
  strucElaboration = () => this.insP.structUndestanding(
    "select  * from new_rilatt.setting_colonne   sc where  maschera = 'risorse' order by importanza "
  ).subscribe(response =>{
   
    var responsej = JSON.parse(JSON.stringify(response));

    for( let element of  responsej.rows) {
      var list : any[] = [];
      var flag = false;
      if(element.column_name === "descrizione_livello") {
        console.log("entrato");
        flag = true;
        list = [...new Map(this.livelli.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null);
        this.columnDefs.push({
          resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values:list},
          "field" : element.column_name , editable : element.editable, hide : !element.visible
        });
      } 
      
      if(element.column_name === "descrizione_ruolo") {
        console.log("entrato");
        flag = true;
        list = [...new Map(this.ruoli.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null);
        this.columnDefs.push({
          resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values:list},
          "field" : element.column_name,
          editable : element.editable, hide : !element.visible
        });
      } 
      if( element.column_name === "descrizione") {   
        console.log("entrato");
        flag = true;
        list = [...new Map(this.practice.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null);
        this.columnDefs.push({
          resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values:list},
          "field" : element.column_name,
          editable : element.editable, hide : !element.visible
        });
      }
      if (!flag) {
       
        this.columnDefs.push({
          resizable: true,
          "field" : element.column_name === "descrizione" ? element.table_name : element.column_name,
          editable : element.editable, hide : !element.visible
        });
      }
    
      this.resizeColumnWidth();
    };
    this.agGrid.api.setColumnDefs(this.columnDefs);
    this.agGrid.columnApi.autoSizeAllColumns();
  });


}
