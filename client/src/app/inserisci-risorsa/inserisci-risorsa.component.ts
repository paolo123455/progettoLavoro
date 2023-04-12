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
  selector: 'app-inserisci-risorsa',
  templateUrl: './inserisci-risorsa.component.html',
  styleUrls: ['./inserisci-risorsa-component.css']
})

 

export class InserisciRisorsaComponent implements OnInit {

   
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  formRL!: FormGroup; 
  myMap = new Map<string, string>();
  livelli: any[] = []
  ruoli: any[] = []
  
  
  

  ngOnInit(): void {
    
    
    this.form= this.fb.group({
      nome : new FormControl("",[ Validators.required,Validators.minLength(1)]),
      cognome : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      email : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
  
    })

    this.formRL = this.fb.group({
      ruolo : '',
      livello : '', 
      data : '', 
     
  
    })
    var nome = ""
    var cognome = ""
    var email = ""
    var ruolo : ""
    var livello : ""
    var dara : ""
    this.form.valueChanges.subscribe((data)=>{
    console.log(data)
    nome = data.nome
    nome = nome === undefined || nome === null  ? "" : nome
    cognome = data.cognome 
    cognome = cognome === undefined   || cognome === null ? "" : cognome
    email = data.email
    email = email === undefined    || email === null ? "" : email

    var filteredData = this.dati.filter((item: {
      email: any;
      cognome: String;
      nome: String; id_risorsa: any; }) => item.nome.includes(nome) && item.cognome.includes(cognome) && item.email.includes(email));
    this.agGrid.api.setRowData(filteredData)
  })
    this.test()
    this.testR()
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
  getRowId: GetRowIdFunc<any>  = params => params.data.id_risorsa  +""+ params.data.dtvalid_ruolo + params.data.dtvalid_livello;

  
 




   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_risorsa
     this.datvalid_livello  = "" + e.data.dtvalid_ruolo
     this.datvalid_ruolo  = ""+e.data.dtvalid_livello 
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    if (numeroC == 0)
    {
      this.delete("delete from  rilatt.risorse  where id_risorsa = " + this.id_touch)
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
  var query = "update rilatt.risorse set " + colonna + " = '" + valore +"' where id_risorsa = "+datiC.id_risorsa
  console.log(valore)  
  console.log(query)
  this.update(query)

  }
 

  setup1= () => {
    var query = "select distinct id_livello || ':' || descrizione as descrizione2 from rilatt.livello order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.livelli = dati; console.log(this.livelli)})

  }
  setup2= () => {
    var query = "select distinct  id_ruolo || ':' || descrizione as descrizione2 from rilatt.ruoli order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.ruoli = dati})
  }

  test = () : void => this.insP.test()

  testR = ()  => this.insP.testRest().subscribe(Response => console.log(Response))
 
  select  = ()  => {var query = "Select r.*, r2.dtvalid_ruolo , rl.dtvalid_livello , l.descrizione as livello , r3.descrizione  as ruoli from rilatt.risorse r " 
       +"left join rilatt.risorse_livello  rl  on  r.id_risorsa  = rl.id_risorsa " 
       +" left  join  rilatt.livello l  on l.id_livello  = rl.id_livello "
       + " left join rilatt.risorse_ruoli  r2  on  r.id_risorsa  = r2.id_risorsa "
       + " left  join  rilatt.ruoli r3   on r3.id_ruolo  = r2.id_ruolo order by r.nome "
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
        text: 'errore update dati',  
        
      })  
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select  importanza ,maschera,column_name , table_name , table_schema , editable  , visible from rilatt.setting_colonne   sc where (table_name  = 'ruoli'or table_name  = 'risorse' or table_name ='risorse_ruoli' or table_name ='risorse_livello' or table_name ='livello') and table_schema ='rilatt' and maschera = 'risorse' order by importanza "
  ).subscribe(response =>{
    console.log("ciao") ;  console.log(response)
    console.log(response)
    console.log("finito")
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
          this.agGrid.api.applyTransaction({remove:[{id_risorsa : this.id_touch , dtvalid_livello : this.datvalid_livello, dtvalid_ruolo : this.datvalid_ruolo}]});
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
    var insertRL =  JSON.parse(JSON.stringify(this.formRL.value))
    console.log(insertRL)
    console.log(insertD.email)
    var data = insertRL.data 
    data = data === undefined ? "" : data
    var ruolo = insertRL.ruolo === undefined  || insertRL.ruolo === null? "" : insertRL.ruolo.descrizione2 === undefined ? "" : insertRL.ruolo.descrizione2
    ruolo = ruolo === undefined ? "" : ruolo
    var livello = insertRL.livello === undefined  ||  insertRL.livello === null? "" : insertRL.livello.descrizione2 === undefined ? "" : insertRL.livello.descrizione2
    livello = livello === undefined ? "" : livello
    console.log(data)
    console.log(ruolo)
    console.log(livello)
    var falg1 = false 
    var flag2 = false 
    var flag3 = false

    var query = "insert into rilatt.risorse (nome , cognome , email) values ('"+insertD.nome+"','"+insertD.cognome+"','"+insertD.email+"' )  RETURNING id_risorsa"
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
             /*Swal.fire({  
                 icon: 'success',  
                 title: 'successo',  
                 text: 'inserimento utetnte avvenuto con successo',  
                   
             }) */ 
             falg1 = true
             var id_risorsa = risposta.rows[0].id_risorsa
             if(true)//!(insertRL.livello.descrizione2 === undefined || insertRL.livello.descrizione2 === ""))
             {
              var descrizioneU : String =livello
             
             
              var id_livello = descrizioneU.split(":")[0]
              console.log(id_livello)
            
              var query2 = "insert into rilatt.risorse_livello(id_risorsa, id_livello , dtvalid_livello) values ('"+id_risorsa+"','"+id_livello+"','"+insertRL.data+"' )"
              console.log(query2)
              this.insP.select(query2).subscribe(response =>{
              console.log(response)
              var risposta = JSON.parse(JSON.stringify(response)) 
              if(risposta.upd === "ok")
              {     
                    /* Swal.fire({  
                         icon: 'success',  
                         title: 'successo',  
                         text: 'inserimento livello avvenuto con successo',  
                           
                     }) */
                     flag2 = true 
                     this.select()
              }
              else 
              { console.log("errore")
                console.log(risposta)
               console.log(this.datiV)
                 
              
              /*  Swal.fire({  
                  icon: 'error',  
                  title: 'errore',  
                  text: 'inserimento livello errato!',  
                  footer: '<a>controlla i dati inseriti</a>'  
                })  */
              }
              if(true)//!(insertRL.ruolo.descrizione2 === undefined || insertRL.ruolo.descrizione2 === ""))
              {
                var descrizioneR : String = ruolo
                var id_ruolo = descrizioneR.split(":")[0]
                console.log(id_ruolo)
               var query3 = "insert into rilatt.risorse_ruoli(id_risorsa, id_ruolo , dtvalid_ruolo) values ('"+id_risorsa+"','"+id_ruolo+"','"+insertRL.data+"' )"
               
               console.log(query3)
               this.insP.select(query3).subscribe(response =>{
                console.log(response)
                var risposta = JSON.parse(JSON.stringify(response)) 
                if(risposta.upd === "ok")
                {     
                     /*  Swal.fire({  
                           icon: 'success',  
                           title: 'successo',  
                           text: 'inserimento ruolo avvenuto con successo',  
                             
                       }) */
                       flag3 = true
                       this.select()
                }
                else 
                { console.log("errore")
                  console.log(risposta)
                 console.log(this.datiV)
                   
                
                 /* Swal.fire({  
                    icon: 'error',  
                    title: 'errore',  
                    text: 'inserimento ruolo errato!',  
                    footer: '<a>controlla i dati inseriti</a>'  
                  })  */
                }
  
  
                
                if (falg1)
                {  
                  if (!flag2  && !flag3)
                  {
                   Swal.fire({  
                     icon: 'success',  
                     title: 'successo',  
                     text: "inserito correttamente  l'utente,  \n ruolo e livello non inseriti. ",  
                       
                 })
                 }
                   if (flag2  && flag3)
                   {
                    Swal.fire({  
                      icon: 'success',  
                      title: 'successo',  
                      text: 'inseriti correttamente utente, ruolo e livello. ',  
                        
                  })
                   }
                   else
                   {
                      if (flag2)
                      {
                        Swal.fire({  
                          icon: 'success',  
                          title: 'successo',  
                          text: 'inseriti correttamente utente e livello \n ruolo non inserito',  
                            
                      })
    
                      }
                      if (flag3)
                      {
                        Swal.fire({  
                          icon: 'success',  
                          title: 'successo',  
                          text: 'inseriti correttamente utente e ruolo \n livello non inserito',  
                            
                      })
                      }
                   }
                }
                   
                     
  
               })
              }
            
            
            
            
            })
             
            }
   

        
            this.form.reset()
            this.formRL.reset()
            this.select()
            
      }
      else 
      { console.log("errore")
        console.log(risposta)
       console.log(this.datiV)
         
      
        Swal.fire({  
          icon: 'error',  
          title: 'errore',  
          text: 'inserimento utente errato!',  
          footer: '<a>controlla i dati inseriti</a>'  
        })  
      }
    
    })

  } 

  
}
