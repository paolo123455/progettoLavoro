
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
  selector: 'app-inserisci-nuova-commessa',
  templateUrl: './inserisci-nuova-commessa.component.html',
  styleUrls: ['./inserisci-nuova-commessa.component.css']
})
export class InserisciNuovaCommessaComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  tipologie: any[] = []
  stati: any[] = []
  risorse: any[] = []
  disabilitato = false;
  
  
  

  ngOnInit(): void {
    
    
  
     
    this.form = this.fb.group({
      codice: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      descrizione : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      effortTot : new FormControl("",[ Validators.required,Validators.pattern("^([0-9]+)$")]),
      effortPreg :new FormControl("",[ Validators.required,Validators.pattern("^([0-9]+)$")]),
      note : '', 
      budget : new FormControl("",[ Validators.required,Validators.pattern("^([0-9]+)$")]),
     
  
    })
    this.form2 = this.fb.group({
      stato: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      istituito : new FormControl(""),
      tipologia:  new FormControl("",[ Validators.required,Validators.minLength(1)]),
     
  
    })
     var stato = ""
     var istituito = ""
     var tipologia = ""
    var codice = ""
    var descrizione = ""
    var effort_pregresso =""
    var effort_totale =""
    var note = ""
    var budget = ""

    this.form2.valueChanges.subscribe((data)=>{
      console.log(this.form,this.form2)
      this.disabilitato = this.form.valid && this.form2.valid
    console.log(data)
    
    stato =  data.stato === undefined || data.stato.descrizione2 === null  ? "" :data.stato.descrizione2  === undefined ? "" :  data.stato.descrizione2
    
    tipologia  =  data.tipologia === undefined || data.tipologia.descrizione2 === null ? "" :data.tipologia.descrizione2 === undefined ? "" :  data.stato.descrizione2
    istituito = data.istituito === undefined || data.istituito == null ? false : data.istituito

    var filteredData = this.dati.filter((item: {
      flag_istituto: String;
      tipologia: String;
      flag_stato: String;
      effort_pregresso: string;
      effort_totale: string;
      note: string;
      budget: string;
      descrizione: string;
      codice: String;
  
        }) =>
        item.flag_stato.includes(stato)  
      && (item.tipologia + "").includes(tipologia) 
      && (item.flag_istituto+ "").includes(istituito) 
      && (item.codice+"").includes(codice)  
      && (item.descrizione+"").includes(descrizione) 
      && (item.budget+"").includes(budget) 
      && (item.note+"").includes(note) 
      && (item.effort_totale+ "").includes(effort_totale) 
      && (item.effort_pregresso+ "").includes(effort_pregresso) 
    );
    this.agGrid.api.setRowData(filteredData)
  })
    
  this.form.valueChanges.subscribe((data)=>{
    this.disabilitato = this.form.valid && this.form2.valid
    console.log(data)
    codice =  data.codice === undefined || data.codice === null  ? "" :data.codice
    descrizione  =  data.descrizione === undefined || data.descrizione === null  ? "" :data.descrizione
    budget  =  data.budget === undefined || data.budget === null  ? "" :data.budget
    note =  data.note === undefined || data.note === null ? "" :data.note
    effort_totale = data.effortTot === undefined || data.effortTot == null ? "" : data.effortTot
    effort_pregresso = data.effortPreg === undefined || data.effortPreg == null ? "" : data.effortPreg
    


    var filteredData = this.dati.filter((item: {
      flag_istituto: String;
      tipologia: String;
      flag_stato: String;
      effort_pregresso: string;
      effort_totale: string;
      note: string;
      budget: string;
      descrizione: string;
      codice: String;
  
        }) =>
        item.flag_stato.includes(stato)  
      && (item.tipologia + "").includes(tipologia) 
      && (item.flag_istituto+ "").includes(istituito) 
      && (item.codice+"").includes(codice)  
      && (item.descrizione+"").includes(descrizione) 
      && (item.budget+"").includes(budget) 
      && (item.note+"").includes(note) 
      && (item.effort_totale+ "").includes(effort_totale) 
      && (item.effort_pregresso+ "").includes(effort_pregresso) 
    );
    this.agGrid.api.setRowData(filteredData)
  })
    this.select()
    this.strucElaboration()
    this.setup1()
    this.setup2()

    
   
  }
    
  
    //email = new FormControl(null ,[Validators.required, Validators.maxLength(3)])
    //nome = new FormControl(null ,[Validators.required, Validators.maxLength(4)])
    //cognome = new FormControl(null ,[Validators.required, Validators.maxLength(5)])



  public columnDefs : ColDef[] = [
    {field: '' ,
    cellRenderer: (params : any) => {return '<div> <button ><i class="bi bi-trash-fill" style = "color:red"></i></button></div>'}},
   ];
  
 
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  
  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  private dati : any = null
  private datiV : any 
  private id_touch : String = ""
  private datvalid_livello : String = "" 
  private datvalid_ruolo : String = "" 
  
  
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;



  getRowId: GetRowIdFunc<any>  = params => params.data.id_progetto;

  
 




   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_progetto

     
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    if (numeroC === 0)
    {
      this.delete("delete from  rilatt.progetti where id_progetto = " + this.id_touch)
    }
  }

  onCellEditingStarted( e: CellEditingStartedEvent): void { 
    var vecchioV = e.value; // save this value by attaching it to button or some variable
    console.log('cellEditingStarted');
    console.log(e);
    var colonna = e.colDef.field
    this.datiV = JSON.parse(JSON.stringify(e.node.data))
    console.log(this.datiV)
    }
onCellValueChanged( e: CellValueChangedEvent): void {
 console.log(e);
  var datiC = e.data
  console.log(datiC)
  var colonna = e.colDef.field
  console.log(colonna)
  var valore = e.value
  var query = "update rilatt.progetti set " + colonna + " = '" + valore +"' where id_progetto = "+datiC.id_progetto
  console.log(valore)  
  console.log(query)
  this.update(query)

  }
 

  setup1= () => {
    var query = "select valore as descrizione2  from rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='TIPOLOGIA' " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.tipologie= dati; console.log(this.tipologie)})

  }
  setup2= () => {
    var query = "select valore as descrizione2 from rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='FLAG_STATO'"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.stati = dati})
  }

  test = () : void => this.insP.test()

  testR = ()  => this.insP.testRest().subscribe(Response => console.log(Response))
 
  select  = ()  => {var query = "select *, descrizione as progetti from rilatt.progetti "
      
 this.insP.select(query).subscribe(response =>{console.log(response) ;this.dati = JSON.parse(JSON.stringify(response)).rows;  this.agGrid.api.setRowData(this.dati)})

}
 
  update = (query : String)   => this.insP.select(query).subscribe(response =>{
    console.log(response)
    var risposta = JSON.parse(JSON.stringify(response)) 
    if(risposta.upd === "ok")
    {
          console.log("update andato a buon fine")
    }
    else 
    { console.log("errore")
     console.log(this.datiV)
       
      this.agGrid.api.applyTransaction({update:[this.datiV]});
      Swal.fire({  
        icon: 'error',  
        title: 'errore',  
        text: 'update andato in errore, codice: '+ risposta.code,  
       
      })  
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select * from rilatt.setting_colonne sc where maschera  = 'progetti' and table_name  = 'progetti' order by importanza"  ).subscribe(response =>{
    console.log(response)
    console.log(response)
 
    var responsej = JSON.parse(JSON.stringify(response))
    for( let element of  responsej.rows) {
      console.log(element)
     this.columnDefs.push({"field" : element.column_name === "descrizione" ? element.table_name : element.column_name, editable : element.editable, hide : !element.visible}) 
     this.myMap.set(element.column_name === "descrizione" ? element.table_name : element.column_name, element.table_name)
    };
    console.log(this.myMap)
    this.agGrid.api.setColumnDefs(this.columnDefs)
    

  
  })



  delete =  (query : String)   => this.insP.select(query).subscribe(response =>{
    console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("delete  andato a buon fine "+ this.id_touch)
          this.agGrid.api.applyTransaction({remove:[{id_progetto : this.id_touch}]});
    }
    else 
    { console.log("errore")
    
       
      
      Swal.fire({  
        icon: 'error',  
        title: 'Oops...',  
        text: 'errore delete',  
        footer: '<a href>Why do I have this issue?</a>'  
      })  
    }
  
  })





  inserisciRiga = () : void => {

    var insert1 =  JSON.parse(JSON.stringify(this.form.value))
    var insert2 =  JSON.parse(JSON.stringify(this.form2.value))
    console.log(insert1,insert2)
    var codice = insert1.codice
    var descrizione = insert1.descrizione
    var effort_totale = insert1.effortTot
    var effort_pregresso = insert1.effortPreg
    var note = insert1.note
    var budget = insert1.budget
    var stato = insert2.stato.descrizione2
    var tipologia = insert2.tipologia.descrizione2
    var istituito = insert2.istituito === "" || insert2.istituito === undefined ? false :  insert2.istituito 
       
  
    

    var query = "insert into rilatt.progetti (codice, descrizione, note ,effort_totale , effort_pregresso, budget  , flag_stato , flag_istituto , tipologia) values ('"+codice+"','"+descrizione+"','"+note+"','"+effort_totale+"','"+effort_pregresso+"','"+budget+"','"+stato+"',"+istituito+",'"+tipologia+"' )  RETURNING id_progetto"
    console.log(query)
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
             Swal.fire({  
                 icon: 'success',  
                 title: 'successo',  
                 text: 'inserimento commessa  avvenuto con successo',  
                   
             }) 
           
             
            
            this.form.reset()
            this.form2.reset()
            this.select()
      }
      else 
      { console.log("errore")
        console.log(risposta)
       console.log(this.datiV)
         
      
        Swal.fire({  
          icon: 'error',  
          title: 'errore',  
          text: 'inserimento commessa a utente andata in errore ',  
          footer: '<a>controlla i dati inseriti</a>'  
        })  
      }
    
    })

  } 

}
