
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
  selector: 'app-practice-risorsa',
  templateUrl: './practice-risorsa.component.html',
  styleUrls: ['./practice-risorsa.component.css']
})
export class PracticeRisorsaComponent {

  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  formRL!: FormGroup; 
  myMap = new Map<string, string>();
  livelli: any[] = []
  ruoli: any[] = []
  risorse: any[] = []
  practices: any[] = []
  
  
  

  ngOnInit(): void {
    
    
  

    this.form = this.fb.group({
      risorsa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      practice : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      data : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
     
  
    })
    this.form.valueChanges.subscribe((data)=>{
    
    console.log(data)
    var datis : String =  data.risorsa === undefined || data.risorsa === null  ? undefined :data.risorsa.descrizione2 === undefined ? "" : data.risorsa.descrizione2
    var datil : String =  data.practice === undefined || data.practice === null ? undefined :data.practice.descrizione2  === undefined ? "" : data.practice.descrizione2
    var datid : Date  = new Date(data.data);
    console.log(datil)
    if (datid.toString() === "Invalid Date") datid = new Date("1970-1-1") 
    console.log(datid)
    var date : String  = datid.getFullYear() === 1970  || datid === undefined ? "" : datid.getFullYear() + "-" + ( datid.getMonth()+1 < 10 ? 0 +""+(datid.getMonth()+1): datid.getMonth()+1) + "-" + (datid.getDate()< 10 ? 0 +""+datid.getDate(): datid.getDate())
    date = date === undefined ? "" : date
    var risn =  datis === undefined ||  datis ===  "" ? "" : datis.split(":")[0].split("-")[1] ===  undefined ? "" : datis.split(":")[0].split("-")[1]
    var risc = datis === undefined ||  datis ===  "" ? "" : datis.split(":")[0].split("-")[0]  ===  undefined ? "" :  datis.split(":")[0].split("-")[0]
   var practice =  datil === undefined ? "" : datil.split(":")[1] ===  undefined ? "" :  datil.split(":")[0]
    console.log(risn,risc,"-",date, "-",practice)
    console.log(this.dati)
    var filteredData = this.dati.filter((item: {
      dtvalid_risorsa_practice: any;
      practice: String;
      email: any;
      cognome: String;
      nome: String; id_risorsa: any; }) => 
      item.nome.includes(risn) 
       && item.practice.includes(practice) 
       && item.cognome.includes(risc)
        && item.dtvalid_risorsa_practice.includes(date) 
       );
    this.agGrid.api.setRowData(filteredData)
  })
  
    this.select()
    this.strucElaboration()
    this.setup1()
    this.setup2()

    
   
  }
    
  



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


  private tabella =  "risorse"
  getRowId: GetRowIdFunc<any>  = params => params.data.id_risorse_practice;

   




   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_risorse_practice
  
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
    {
      this.delete("delete from  new_rilatt.risorse_practice where id_risorse_practice = " + this.id_touch)
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


  }
 

  setup1= () => {
    var query = "select distinct  descrizione || ':' || id_practice  as descrizione2 from new_rilatt.practice order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.practices = dati; console.log(this.practices)})

  }
  setup2= () => {
    var query = "select distinct  cognome  || '-' || nome || ':' || id_risorsa   as descrizione2 from new_rilatt.risorse order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.risorse = dati})
  }

  test = () : void => this.insP.test()

  testR = ()  => this.insP.testRest().subscribe(Response => console.log(Response))
 
  select  = ()  => {var query = "select *, descrizione as practice from new_rilatt.risorse_practice rp "+ 
                                "inner join new_rilatt.risorse r on r.id_risorsa = rp.id_risorsa " + 
                                "inner join new_rilatt.practice p on p.id_practice  = rp.id_practice"
      
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
        title: 'Oops...',  
        text: 'Something went wrong!',  
        footer: '<a href>Why do I have this issue?</a>'  
      })  
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select * from new_rilatt.setting_colonne where maschera  = 'risorse_practice'  order by importanza  "
  ).subscribe(response =>{
    console.log("ciao") ;  console.log(response)
    console.log(response)
    console.log("finito")
    var responsej = JSON.parse(JSON.stringify(response))
    for( let element of  responsej.rows) {
      console.log(element)
     this.columnDefs.push({"field" : element.column_name === "descrizione" ? "practice" : element.column_name, editable : element.editable, hide : !element.visible}) 
     this.myMap.set(element.column_name === "descrizione" ? "practice" : element.column_name, element.table_name)
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
          this.agGrid.api.applyTransaction({remove:[{id_risorse_practice : this.id_touch}]});
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

    var insertD =  JSON.parse(JSON.stringify(this.form.value))
   

    var data = insertD.data 
    var descrizioneU : String = insertD.practice.descrizione2      
    var id_practice = descrizioneU.split(":")[1]
    console.log(id_practice)
    var descrizioneR : String = insertD.risorsa.descrizione2      
    var id_risorsa = descrizioneR.split(":")[1]
    console.log(id_risorsa)

    var query = "insert into new_rilatt.risorse_practice (id_risorsa, id_practice, dtvalid_risorsa_practice) values ('"+id_risorsa+"','"+id_practice+"','"+data+"' )  RETURNING id_risorsa"
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
             Swal.fire({  
                 icon: 'success',  
                 title: 'successo',  
                 text: 'inserimento practice ad utente avvenuto con successo',  
                   
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
          text: 'inserimento practice ad  utente errato!',  
          footer: '<a>controlla i dati inseriti</a>'  
        })  
      }
    
    })

  } 


} 