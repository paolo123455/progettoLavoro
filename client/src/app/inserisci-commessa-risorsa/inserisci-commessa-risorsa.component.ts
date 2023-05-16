
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
  selector: 'app-inserisci-commessa-risorsa',
  templateUrl: './inserisci-commessa-risorsa.component.html',
  styleUrls: ['./inserisci-commessa-risorsa.component.css']
})
export class InserisciCommessaRisorsaComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  risorse: any[] = []
  commesse: any[] = []
  odls: any[] = []
  mesi : Number[] = [1,2,3,4,5,6,7,8,9,10,11,12]
  anni: Number[] = [2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050,2051,2052,2053,2054,2055]
  disabilitato = false;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  getRowId: GetRowIdFunc<any>  = params => params.data.id_attivita;
  
  

  ngOnInit(): void {
    
    
  
    
    this.form = this.fb.group({
      risorsa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      commessa: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      odl: ''

    })
    this.form2 = this.fb.group({
      anno: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      mese :  new FormControl("",[ Validators.required,Validators.minLength(1)]),
      giornate:  '',
      budget : '' 
     
  
    })
    var anno : string = ""
    var mese : string = ""
    var budget : boolean = false
    var giornate : string = ""
    var codice : string = ""
    var descrizione : string = ""
    var nome : string = ""
    var cognome : string = ""
    var email : string = ""
    var odl: string = ""
    
    this.form2.valueChanges.subscribe((data)=>{
      this.disabilitato = this.form.valid && this.form2.valid
      console.log(this.form.valid)
    
      console.log(data)
       anno  =  data.anno === undefined || data.anno === null  ?"" :data.anno
       mese =  data.mese === undefined || data.mese === null ? "" :data.mese
    
     
  
   
     budget  =  data.budget === undefined || data.budget === '' || data.budget === null  ? false :data.budget
     budget = budget === undefined ? false : budget
      giornate =  data.giornate === undefined || data.giornate === null  ? "" :data.giornate
      giornate = giornate === undefined || giornate === null ? "" : giornate
     console.log(budget)
     console.log(this.dati)
  
      var filteredData = this.dati.filter((item: {
        mese: String;
        flag_budget : String;
        giornate : String;
        anno: String;
        descrizione_progetto: any;
        descrizione_odl: any;
        codice: any;
        dtvalid_ruolo: any;
         ruoli: any;
        cognome: String;
        nome: String; id_risorsa: any;

        }) => 
        (item.anno+"").includes(anno)
        && (item.mese+"").includes(mese)
        && (item.flag_budget+"").includes(budget+"")
        && (item.giornate+"").includes(giornate)
        &&item.nome.includes(nome)
        && item.cognome.includes(cognome)
        && item.codice.includes(codice)
        && (item.descrizione_odl+"").includes(odl)
        && item.descrizione_progetto.includes(descrizione)

          );
      this.agGrid.api.setRowData(filteredData)
    })


    
    this.form.valueChanges.subscribe((data)=>{
    this.disabilitato = this.form.valid && this.form2.valid
    console.log(this.form.valid)
    console.log(this.form.valid && this.form2.valid)
    
    console.log(data)
    var datio: String =  data.odl === undefined || data.odl === null  ? undefined :data.odl.descrizione2
    var datic: String =  data.commessa === undefined || data.commessa === null  ? undefined :data.commessa.descrizione2
    var datir : String =  data.risorsa === undefined || data.risorsa === null ? undefined :data.risorsa.descrizione2
    
    console.log(datic , datir)
    odl =  datio === undefined ? "" : datio.split(":")[0].split("--")[0]
    odl = odl === undefined ? "" : odl
    codice =  datic === undefined ? "" : datic.split(":")[0].split("--")[1]
    codice = codice === undefined ? "" : codice
    descrizione =  datic === undefined ? "" : datic.split(":")[0].split("--")[0]
    descrizione = descrizione === undefined ? "" : descrizione
    console.log(codice ,"/", descrizione)
    
    nome = datir === undefined ? "" : datir.split(":")[0].split("-")[1]  === undefined ? "" : datir.split(":")[0].split("-")[1]
  
    nome = nome === undefined || nome === "undefined" || nome === null ? "" : nome
    cognome = datir === undefined ? "" : datir.split(":")[0].split("-")[0]  === undefined ? "" : datir.split(":")[0].split("-")[0]
    cognome = cognome === undefined || cognome === "undefined" || cognome === null ? "" : cognome
   // email = datir === undefined ? "" : datir.split(":")[0].split("-")[2]  === undefined ? "" : datir.split(":")[0].split("-")[2]
   // email = email === undefined || email === "undefined" || email === null ? "" : email
   
    

    var filteredData = this.dati.filter((item: {
      mese: String;
      flag_budget : String;
      giornate : String;
      anno: String;
      descrizione_odl : any;
      descrizione_progetto: any;
      codice: any;
      dtvalid_ruolo: any;
       ruoli: any;
      cognome: String;
      nome: String; id_risorsa: any; }) => 
      (item.anno+"").includes(anno)
        && (item.mese+"").includes(mese)
        && (item.flag_budget+"").includes(budget+"")
        && (item.giornate+"").includes(giornate)
        &&item.nome.includes(nome)
        && item.cognome.includes(cognome)
        && item.codice.includes(codice)
        && (item.descrizione_odl+"").includes(odl)
        && item.descrizione_progetto.includes(descrizione))
 
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


   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_attivita

     
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var valore = e.column.getColId
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
    {
      this.delete("delete from  new_rilatt.attivita_risorsa where id_attivita = " + this.id_touch)
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
 /*console.log(e);
  var datiC = e.data
  console.log(datiC)
  var colonna = e.colDef.field
  console.log(colonna)
  var valore = e.value
  var query = "update new_rilatt.progetti set " + colonna + " = '" + valore +"' where id_progetto = "+datiC.id_progetto
  console.log(valore)  
  console.log(query)
  this.update(query)*/

  }
 

  setup1= () => {
    var query = "select distinct   cognome || '-' || nome || '-' || ':' ||   id_risorsa as descrizione2 from new_rilatt.risorse order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.risorse= dati; console.log(this.risorse)
      this.setup2()
    })

  }
  setup2= () => {
    var query = "select   descrizione_progetto || '--'  ||codice || ':' || id_progetto   as descrizione2 from new_rilatt.progetti order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.commesse = dati
      this.setup3()
      this.strucElaboration()
    })
  }  
  setup3= () => {
    var query = "select   descrizione_odl || '--'  ||codice_odl || ':' || id_odl  as descrizione2 from new_rilatt.odl order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.odls = dati
    
    })
  }



  select  = ()  => {var query = "select *  from new_rilatt.attivita_risorsa ar inner join new_rilatt.risorse r on r.id_risorsa = ar.id_risorsa " +
                                "inner join new_rilatt.progetti  p on p.id_progetto = ar.id_progetto left join new_rilatt.odl o on ar.id_odl = o.id_odl  "
      
 this.insP.select(query).subscribe(response =>{console.log(response) ;this.dati = JSON.parse(JSON.stringify(response)).rows;  this.agGrid.api.setRowData(this.dati)
  var  filteredData = this.dati.filter((item: {
    flag_budget: String;
      }) =>
    
     (item.flag_budget+ "").includes("false") 

  );
  this.agGrid.api.setRowData(filteredData)})


 
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
        title: 'ERRORE',  
        text: 'errore di update, codice : '+ risposata.code
        
      })  
      this.select()
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select * from new_rilatt.setting_colonne sc where maschera  = 'attivita_risorsa'  order by importanza"  ).subscribe(response =>{
    console.log(response)
    console.log(response)
 
    var responsej = JSON.parse(JSON.stringify(response))
    for( let element of  responsej.rows) {
      console.log(element)
     this.columnDefs.push({"field" :  element.column_name, editable : element.editable, hide : !element.visible}) 

    };

    
    //this.agGrid.api.setColumnDefs(this.columnDefs)
    this.agGrid.api.setColumnDefs(this.columnDefs)
    

  
  })



  delete =  (query : String)   => this.insP.select(query ).subscribe(response =>{
    console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("delete  andato a buon fine "+ this.id_touch)
          this.agGrid.api.applyTransaction({remove:[{id_attivita : this.id_touch}]});
    }
    else 
    { console.log("errore")
    
       
      
      Swal.fire({  
        icon: 'error',  
        title: 'errore',  
        text: 'errore in delete, codice : ' + risposata.code
      
      })  
    }
  
  })





  inserisciRiga = () : void => {

    var insert1 =  JSON.parse(JSON.stringify(this.form.value))
    var insert2 =  JSON.parse(JSON.stringify(this.form2.value))
    console.log(insert1,insert2)
    var id_progetto = insert1.commessa.descrizione2 === undefined ? "" : insert1.commessa.descrizione2.split(":")[1]
    var id_risorsa =  insert1.risorsa.descrizione2 === undefined ? "" :  insert1.risorsa.descrizione2.split(":")[1] 
    
    var id_odl = insert1.odl.descrizione2 === undefined ? null : insert1.odl.descrizione2.split(":")[1]
    var giornate = insert2.giornate 
    giornate = giornate === undefined || giornate === null || giornate === '' ? "0" : giornate
    console.log(giornate)
    var flag_attivita  = false
    var flag_budget = insert2.budget === "" || insert2.budget === undefined ? false : insert2.budget
    var anno = insert2.anno
    var mese = insert2.mese
    var flag = false
    var flag2 = false
    var queryc = "SELECT new_rilatt.fnc_controllo_rendicontazione("+id_progetto+", "+id_risorsa+","+anno+","+mese+","+giornate+","+id_odl+");"
    console.log(queryc)
    this.insP.select(queryc).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      console.log(risposta.rows)
      var messaggio = risposta.rows[0].fnc_controllo_rendicontazione
      console.log(messaggio)
      var tipoMessaggio : String= messaggio.split("=")[0]
      console.log(tipoMessaggio)
      var msg =  messaggio.split("=")[1]
      console.log(msg)
      if(tipoMessaggio =="OK" )
      {    
        flag = true 

        }
        if(tipoMessaggio == "WR" )
        {    
          flag = true 
          flag2 = true
          
          
          console.log("WR")
         
  
          }
          if(tipoMessaggio  == "KO" )
             {    
                  flag = false
                  Swal.fire({  
                    icon: 'error',  
                    title: 'errore',  
                    text: msg + ", il record non verrà inserito",  
                      
                }) 
               } 



               if (!flag)
               {
                     
               }
               else {
           
               
               var query = "insert into new_rilatt.attivita_risorsa ( id_risorsa, id_progetto ,giornate  ,flag_attivita, flag_budget  , anno , mese , id_odl) values ('"+id_risorsa+"','"+id_progetto+"','"+giornate+"',"+flag_attivita+","+flag_budget+",'"+anno+"','"+mese+"',"+id_odl+" )  RETURNING id_progetto"
               console.log(query)
               this.insP.select(query).subscribe(response =>{
                 console.log(response)
                 var risposta = JSON.parse(JSON.stringify(response)) 
                 if(risposta.upd === "ok")
                 {   
                   console.log(flag2)
                  if(!flag2){
                             Swal.fire({  
                            icon: 'success',  
                            title: 'successo',  
                            text: 'inserimento commessa a risorsa  avvenuto con successo',  
                              
                             }) 
                        }
                       else
                       {
                        Swal.fire({  
                          icon: 'warning',  
                          title: 'warning',  
                          text: msg + ", il record è stato inserito ugualmente ",  
                            
                      }) 
                       } 
                        
                        
                       
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
                     text: 'inserimento commessa a utente andata in errore, codice : ' + risposta.code,  
                
                   })  
                 }
               
               })
           
              }
  })
     

}

}
