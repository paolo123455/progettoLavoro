
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
  selector: 'app-commesse',
  templateUrl: './commesse.component.html',
  styleUrls: ['./commesse.component.css']
})
export class CommesseComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  tipologie: any[] = []
  clienti: any[] = []
  stati: any[] = []
  risorse: any[] = []
  disabilitato = false;
  
  
  

  ngOnInit(): void {
    
    
  
     
    this.form = this.fb.group({
      codice: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      descrizione : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      note : '', 
    
    })
    this.form2 = this.fb.group({
      istituito : new FormControl(""),
      cliente:  new FormControl("",[ Validators.required,Validators.minLength(1)]),
     
  
    })
     var stato = ""
     var istituito = false
     var tipologia = ""
    var codice = ""
    var descrizione = ""
    var effort_pregresso =""
    var effort_totale =""
    var note = ""
    var budget = ""
    var budget_pregresso = ""
    var cliente = ""

    this.form2.valueChanges.subscribe((data)=>{
      console.log(this.form,this.form2)
      this.disabilitato = this.form.valid && this.form2.valid
    console.log(data)
    
   /* stato =  data.stato === undefined || data.stato === null  ? "" :data.stato.descrizione2  === undefined   || data.stato.descrizione2 === null ? "" :  data.stato.descrizione2
    stato = stato === undefined || stato === "undefined"  ? "" : stato
    tipologia  =  data.tipologia === undefined || data.tipologia === null ? "" :data.tipologia.descrizione2 === undefined  || data.tipologia.descrizione2 === null ? "" :  data.tipologia.descrizione2
    tipologia = tipologia === undefined || tipologia === "undefined"  ? "" : tipologia
     
    */
    istituito = data.istituito === undefined || data.istituito == null ? false : data.istituito
    istituito = istituito === undefined   ? false : istituito
    cliente  =  data.cliente === undefined || data.cliente === null ? "" :data.cliente.descrizione2 === undefined  || data.cliente.descrizione2 === null ? "" :  data.cliente.descrizione2.split(":")[0].split("-")[0]
    cliente = cliente === undefined || cliente === "undefined"  ? "" : cliente
   

    var filteredData = this.dati.filter((item: {
      flag_istituto: String;
      note: string;
      descrizione_codice: string;
      codice: String;
      descrizione_cliente : string

  
        }) =>
       (item.flag_istituto+ "").includes(istituito+"") 
      && (item.codice+"").includes(codice)  
      && (item.descrizione_codice+"").includes(descrizione) 
      && (item.note+"").includes(note) 
      && (item.descrizione_cliente+ "").includes(cliente) 
    );
    this.agGrid.api.setRowData(filteredData)
  })
    
  this.form.valueChanges.subscribe((data)=>{
    this.disabilitato = this.form.valid && this.form2.valid
    console.log(data)
    codice =  data.codice === undefined || data.codice === null  ? "" :data.codice
    codice = codice === undefined || codice === "undefined"  ? "" : codice
    descrizione  =  data.descrizione === undefined || data.descrizione === null  ? "" :data.descrizione
    descrizione = descrizione === undefined || descrizione === "undefined"  ? "" : descrizione
    note =  data.note === undefined || data.note === null ? "" :data.note
    note = note === undefined || note === "undefined"  ? "" : note
  /*  effort_totale = data.effortTot === undefined || data.effortTot == null ? "" : data.effortTot
    effort_totale = effort_totale === undefined || effort_totale === "undefined"  ? "" : effort_totale
    effort_pregresso = data.effortPreg === undefined || data.effortPreg == null ? "" : data.effortPreg
    effort_pregresso = effort_pregresso === undefined || effort_pregresso === "undefined"  ? "" : effort_pregresso
    budget_pregresso = data.budgetPreg === undefined || data.budgetPreg == null ? "" : data.budgetPreg
    budget_pregresso = budget_pregresso === undefined || budget_pregresso === "undefined"  ? "" : budget_pregresso
    budget  =  data.budget === undefined || data.budget === null  ? "" :data.budget
    budget = budget === undefined || budget === "undefined"  ? "" : budget
    */

    var filteredData = this.dati.filter((item: {
      flag_istituto: String;
      descrizione_progetto: string;
      codice: string;
      descrizione_cliente : string
  
        }) =>
      (item.flag_istituto+ "").includes(istituito+"") 
      && (item.codice+"").includes(codice)  
      && (item.descrizione_progetto+"").includes(descrizione) 
      && (item.descrizione_cliente+ "").includes(cliente) 
    );
    this.agGrid.api.setRowData(filteredData)
  })
    this.select()
  
    this.setup1()
   

    
   
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
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
   
    {
      this.delete("delete from  new_rilatt.progetti where id_progetto = " + this.id_touch)
    }
  }

  onCellEditingStarted( e: CellEditingStartedEvent): void { 
    var vecchioV = e.value; // save this value by attaching it to button or some variable
    console.log('cellEditingStarted');
  //  console.log(e);
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
  var query = "update new_rilatt.progetti set " + colonna + " = '" + valore +"' where id_progetto = "+datiC.id_progetto
  console.log(valore)  
  console.log(query)
  this.update(query)

  }
 

  setup1= () => {
    var query = "select valore as descrizione2  from new_rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='TIPOLOGIA' " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.tipologie= dati; console.log(this.tipologie)
    this.setup2()
    })

  }
  setup2= () => {
    var query = "select valore as descrizione2 from new_rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='FLAG_STATO'"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.stati = dati
    this.setup3()
      this.strucElaboration()
    })
  }
  setup3= () => {
    var query = "select descrizione_cliente || '-' || codice_cliente || ':' || id_cliente as descrizione2 from new_rilatt.clienti"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.clienti = dati
  
    })
  }


 
  select  = ()  => {var query = "select * from new_rilatt.progetti p left join new_rilatt.clienti c on c.id_cliente = p.id_cliente "
      
 this.insP.select(query).subscribe(response =>{console.log(response) ;this.dati = JSON.parse(JSON.stringify(response)).rows; 
  var  filteredData = this.dati.filter((item: {
    flag_istituto: String;
      }) =>
    
     (item.flag_istituto+ "").includes("false") 

  );
  this.agGrid.api.setRowData(filteredData)})

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



  strucElaboration = () => this.insP.structUndestanding("select * from new_rilatt.setting_colonne sc where maschera  = 'progetti' and table_name  = 'progetti' order by importanza"  ).subscribe(response =>{
    console.log(response)
    console.log(response)
 
    var responsej = JSON.parse(JSON.stringify(response))
    for( let element of  responsej.rows) {
      console.log(element)
     this.columnDefs.push({"field" :  element.column_name, editable : element.editable, hide : !element.visible}) 
    
    };

    this.agGrid.api.setColumnDefs(this.columnDefs)
    this.agGrid.columnApi.autoSizeAllColumns()
    

  
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
   // var effort_totale = insert1.effortTot
   // effort_totale = effort_totale === undefined || effort_totale === "" ? 0 : effort_totale
   // var effort_pregresso = insert1.effortPreg
   // effort_pregresso = effort_pregresso === undefined || effort_pregresso === "" ? 0 : effort_pregresso
   // var  budget_pregresso = insert1.budgetPreg
   // budget_pregresso = budget_pregresso === undefined || budget_pregresso === "" ? 0 : budget_pregresso
    var note = insert1.note
    var  cliente = insert2.cliente === undefined  || insert2.cliente === "" ? "" : insert2.cliente.descrizione2
    console.log(cliente)
    cliente = cliente === undefined || cliente === "" ? null :  cliente.split(":")[1]
    //var budget = insert1.budget
    //budget = budget === undefined || budget === "" ? 0 : budget
   // var stato = insert2.stato.descrizione2
   // var tipologia = insert2.tipologia.descrizione2
    var istituito = insert2.istituito === "" || insert2.istituito === undefined ? false :  insert2.istituito 
       
  
    

    var query = "insert into new_rilatt.progetti (codice, descrizione_progetto, note,  flag_istituto ,id_cliente) values ('"+codice+"','"+descrizione+"','"+note+"',"+istituito+","+cliente+" )  RETURNING id_progetto"
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
        })  
      }
    
    })

  } 

}
