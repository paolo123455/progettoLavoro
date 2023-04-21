
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
  selector: 'app-nuova-practice',
  templateUrl: './nuova-practice.component.html',
  styleUrls: ['./nuova-practice.component.css']
})
export class NuovaPracticeComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  tipologie: any[] = []
  stati: any[] = []
  risorse: any[] = []
  
  
  

  ngOnInit(): void {
    
    
  

    this.form = this.fb.group({
      practice: new FormControl("",[ Validators.required,Validators.minLength(1)])
    })
  

  this.form.valueChanges.subscribe((data)=>{
    
  
    var practice = data.practice === undefined || data.practice== null ? "" : data.practice
    console.log(practice)

    console.log(this.dati)
    var filteredData = this.dati.filter((item: {
      practice: string;
     
  
        }) => (item.practice+"").includes(practice)  
     
    );
    this.agGrid.api.setRowData(filteredData)
  })
    this.select()
    this.strucElaboration()
   // this.setup1()
   // this.setup2()

    
   
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



  getRowId: GetRowIdFunc<any>  = params => params.data.id_practice;

  
 




   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_practice

     
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
    {
      this.delete("delete from  rilatt.practice where id_practice = " + this.id_touch)
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
  var colonna = e.colDef.field === 'practice' ? "descrizione" : e.colDef.field
  console.log(colonna , (colonna+"") === 'practice')
  var valore = e.value
  var query = "update rilatt.practice set " +  colonna + " = '" + valore +"' where id_practice = "+datiC.id_practice
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
 
  select  = ()  => {var query = "select *, descrizione as practice from rilatt.practice "
      
 this.insP.select(query).subscribe(response =>{console.log(response) ;this.dati = JSON.parse(JSON.stringify(response)).rows;  this.agGrid.api.setRowData(this.dati)})

}
 
  update = (query : String)   => this.insP.select(query).subscribe(response =>{
    console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
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
        text: 'update fallito ',  
    
      })  
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select * from rilatt.setting_colonne sc where maschera  = 'practice'  order by importanza"  ).subscribe(response =>{
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
          this.agGrid.api.applyTransaction({remove:[{id_practice : this.id_touch}]});
    }
    else 
    { console.log("errore")
    
       
      
      Swal.fire({  
        icon: 'error',  
        title: 'errore',  
        text: 'errore delete',  
       
      })  
    }
  
  })





  inserisciRiga = () : void => {

    var insert1 =  JSON.parse(JSON.stringify(this.form.value))
   
    console.log(insert1)
    var practice = insert1.practice
   
       
  
    

    var query = "insert into rilatt.practice (descrizione) values ('"+practice+"' )  RETURNING id_practice"
    console.log(query)
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
             Swal.fire({  
                 icon: 'success',  
                 title: 'successo',  
                 text: 'inserimento practice  avvenuto con successo',  
                   
             }) 
           
             
            
            this.form.reset()
            
            this.select()
      }
      else 
      { console.log("errore")
        console.log(risposta)
       console.log(this.datiV)
         
      
        Swal.fire({  
          icon: 'error',  
          title: 'errore',  
          text: 'inserimento practice andata in errore ',  
          footer: '<a>controlla i dati inseriti</a>'  
        })  
      }
    
    })

  } 

}
