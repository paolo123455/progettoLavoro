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
  selector: 'app-ruoli',
  templateUrl: './ruoli.component.html',
  styleUrls: ['./ruoli.component.css']
})
export class RuoliComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  formRL!: FormGroup; 
  myMap = new Map<string, string>();
  livelli: any[] = []
  ruoli: any[] = []
  risorse: any[] = []
  showForm = false;
  
  
  

  ngOnInit(): void {
    
    
  

    this.form = this.fb.group({
      risorsa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      ruolo : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      data : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
     
  
    })
    this.form.valueChanges.subscribe((data)=>{
    
    console.log(data)
    var datis : String =  data.risorsa === undefined || data.risorsa === null  ? undefined :data.risorsa.descrizione2
    var datil : String =  data.ruolo === undefined || data.ruolo === null ? undefined :data.ruolo.descrizione2
    var datid : Date  = new Date(data.data);
    console.log(datil)
    if (datid.toString() === "Invalid Date") datid = new Date("1970-1-1") 
    console.log(datid)
    var date : String  = datid.getFullYear() === 1970  || datid === undefined ? "" : datid.getFullYear() + "-" + ( datid.getMonth()+1 < 10 ? 0 +""+(datid.getMonth()+1): datid.getMonth()+1) + "-" + (datid.getDate()< 10 ? 0 +""+datid.getDate(): datid.getDate())
    data = data === undefined ? "" : data
    var risn =  datis === undefined ? "" : datis.split(":")[0].split("-")[1]
    risn = risn === undefined ? "" : risn
    var risc = datis === undefined ? "" : datis.split(":")[0].split("-")[0] 
    risc = risc === undefined ? "" : risc
   
    var ruolo =  datil === undefined ? "" : datil.split(":")[0]
    ruolo = ruolo === undefined ? "" : ruolo
    console.log(risn,risc,"-",date, "-",ruolo)
    var filteredData = this.dati.filter((item: {
      dtvalid_ruolo: any;
       ruoli: any;
      email: any;
      cognome: String;
      nome: String; id_risorsa: any; }) => item.nome.includes(risn)  
      && item.ruoli.includes(ruolo) 
      && item.cognome.includes(risc) 
      && item.dtvalid_ruolo.includes(date )
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


  private tabella =  "risorse"
  getRowId: GetRowIdFunc<any>  = params => params.data.id_risorsa_ruolo;

  
 




   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_risorsa_ruolo

     this.datvalid_ruolo  = ""+e.data.dtvalid_ruolo
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
    {
      this.delete("delete from  new_rilatt.risorse_ruoli where id_risorsa_ruolo = " + this.id_touch)
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
 /*  var datiC = e.data
  console.log(datiC)
  var colonna = e.colDef.field
  console.log(colonna)
  var valore = e.value
  var query = "update new_rilatt.risorse set " + colonna + " = '" + valore +"' where id_risorsa = "+datiC.id_risorsa
  console.log(valore)  
  console.log(query)
  this.update(query)*/

  }
 

  setup1= () => {
    var query = "select distinct descrizione || ':' || id_ruolo  as descrizione2 from new_rilatt.ruoli order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.ruoli= dati; console.log(this.livelli)})

  }
  setup2= () => {
    var query = "select distinct  cognome   || '-' || nome || ':'|| id_risorsa  as descrizione2 from new_rilatt.risorse order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.risorse = dati})
  }

  test = () : void => this.insP.test()

  testR = ()  => this.insP.testRest().subscribe(Response => console.log(Response))
 
  select  = ()  => {var query = "Select r.*, rl.id_ruolo, rl.id_risorsa_ruolo,  to_char( dtvalid_ruolo, 'YYYY-MM-DD') as dtvalid_ruolo , l.descrizione as ruoli from new_rilatt.risorse r " 
       +"inner join new_rilatt.risorse_ruoli  rl  on  r.id_risorsa  = rl.id_risorsa " 
       +"inner  join  new_rilatt.ruoli l  on l.id_ruolo  = rl.id_ruolo "
      
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
        text: 'errore in update',  
         
      })  
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select  * from new_rilatt.setting_colonne   sc where  table_schema ='new_rilatt' and maschera  = 'risorse_ruoli' order by importanza"  ).subscribe(response =>{
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
          this.agGrid.api.applyTransaction({remove:[{id_risorsa_ruolo : this.id_touch}]});
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

    var insertD =  JSON.parse(JSON.stringify(this.form.value))
   

    var data = insertD.data 
    var descrizioneU : String = insertD.ruolo.descrizione2      
    var id_ruolo = descrizioneU.split(":")[1]
    console.log(id_ruolo)
    var descrizioneR : String = insertD.risorsa.descrizione2      
    var id_risorsa = descrizioneR.split(":")[1]
    console.log(id_risorsa)

    var query = "insert into new_rilatt.risorse_ruoli (id_risorsa, id_ruolo, dtvalid_ruolo) values ('"+id_risorsa+"','"+id_ruolo+"','"+data+"' )  RETURNING id_ruolo"
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
             Swal.fire({  
                 icon: 'success',  
                 title: 'successo',  
                 text: 'inserimento ruolo ad utente avvenuto con successo',  
                   
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
          text: 'inserimento ruolo ad  utente errato!',  
          footer: '<a>controlla i dati inseriti</a>'  
        })  
      }
    
    })

  } 

}
