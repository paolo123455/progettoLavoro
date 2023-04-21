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
  practice : any[] = []
  disabilitato = false;

  
  
  

  ngOnInit(): void {
    
    
    this.form= this.fb.group({
      nome : new FormControl("",[ Validators.required,Validators.minLength(1)]),
      cognome : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      email : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
  
    })

    this.formRL = this.fb.group({
      ruolo : '',
      livello : '',
      practice : '' ,
      data : '', 
     
  
    })
    var nome = ""
    var cognome = ""
    var email = ""
    var ruolo = ""
    var livello = ""
    var data = ""
    var practice = ""
  
    this.formRL.valueChanges.subscribe((data)=>{
      this.disabilitato = this.form.valid
      console.log(data)
      var ruoloD = data.ruolo
      ruolo = ruoloD  === undefined || ruoloD === null  ? "" : ruoloD.descrizione2
      ruolo = (ruolo+"").split(":")[0] === undefined ? "" : (ruolo+"").split(":")[0]
      ruolo = ruolo === undefined || ruolo  === "undefined"  ? "" : ruolo
      var livelloD = data.livello
      livello = livelloD  === undefined || livelloD === null  ? "" : livelloD.descrizione2 
      livello = (livello+"").split(":")[0] === undefined ? "" : (livello+"").split(":")[0]
      livello = livello === undefined || livello  === "undefined"  ? "" : livello
      var practiceD = data.practice
      practice = practiceD  === undefined || practiceD === null  ? "" : practiceD.descrizione2 
      practice = (practice+"").split(":")[0] === undefined ? "" : (practice+"").split(":")[0]
      practice = practice === undefined || practice  === "undefined"  ? "" : practice


     console.log(livello ,"--",ruolo,"--",practice)
      var filteredData = this.dati.filter((item: {
        practice: any;
        livello: any;
        ruoli: any;
        email: any;
        cognome: String;
        nome: String; id_risorsa: any; }) => 
        item.nome.includes(nome) 
        && item.cognome.includes(cognome) 
        && item.email.includes(email)
        && (item.ruoli +"").includes(ruolo)
        && (item.livello+"").includes(livello)
        && (item.practice+"").includes(practice));
      this.agGrid.api.setRowData(filteredData)
    })

    this.form.valueChanges.subscribe((data)=>{
      this.disabilitato = this.form.valid
    console.log(data)
    nome = data.nome
    nome = nome === undefined || nome === null  ? "" : nome
    cognome = data.cognome 
    cognome = cognome === undefined   || cognome === null ? "" : cognome
    email = data.email
    email = email === undefined    || email === null ? "" : email
    

    var filteredData = this.dati.filter((item: {
      practice: any;
      livello: any;
      ruoli: any;
      email: any;
      cognome: String;
      nome: String; id_risorsa: any; }) => 
      item.nome.includes(nome) 
      && item.cognome.includes(cognome) 
      && item.email.includes(email)
      && (item.ruoli +"").includes(ruolo)
      && (item.livello+"").includes(livello)
      && (item.practice+"").includes(practice));
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
    maxWidth: 60,
    cellRenderer: (params : any) => {return '<div> <button ><i class="bi bi-trash-fill" style = "color:red; weight:10px"></i></button></div>'}},
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
  private id_practice : String = ""
  
  
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;


  private tabella =  "risorse"
  getRowId: GetRowIdFunc<any>  = params => params.data.id_risorsa  +""+ ( params.data.dtvalid_ruolo === null ||  params.data.dtvalid_ruolo === undefined ?  "" :  params.data.dtvalid_ruolo +"rr"  )+ (params.data.dtvalid_livello === null ? "" :  params.data.dtvalid_livello  ) + (params.data.id_practice  === null ? "" :  params.data.id_practice) ;

  
 




   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.sizeColumnsToFit()
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    
    
    console.log('cellClicked', e);
    
    if (e.colDef.cellEditorParams != undefined)
    { 
      console.log(e.value)
      var lista : any [] = e.colDef.cellEditorParams.values
      console.log(lista)
      let index = lista.findIndex(value => (value+"").includes(e.value +":"));
      console.log(index)
      if (index === -1)
      {}
      else 
      {
      var appoggio = lista[0]
      lista[0] = lista[index]
      lista[index] = appoggio
      }
    }
    this.id_touch =  e.data.id_risorsa
     this.datvalid_livello  = "" + e.data.dtvalid_ruolo
     this.datvalid_ruolo  = ""+e.data.dtvalid_livello 
     this.id_practice = e.data.id_practice
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
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
  var query =""
  var flag = false
  if (colonna === "ruoli") 
  {  
    flag = true
    if (datiC.id_ruolo === null )  
    {
      Swal.fire({  
        icon: 'warning',  
        title: 'ettenzione',  
        text: 'non è presente alcun ruolo associato a questa persona, \n per inserire un nuovo ruolo bisogna andare alla pagina dedicata  '  
        
      })  
      this.select()
    

    }
    else{
    var valore = e.value
    valore = (valore+"").split(":")[1]
    query = "update rilatt.risorse_ruoli set id_ruolo = '" + valore +"' where id_risorsa = " +datiC.id_risorsa+" and  id_ruolo = "+datiC.id_ruolo
    }
  }
  if (colonna === "livello") 
  { 

    flag = true 
    if (datiC.id_livello === null )  
    {

      Swal.fire({  
        icon: 'warning',  
        title: 'ettenzione',  
        text: 'non è presente alcun livello associato a questa persona, \n per inserire un nuovo livello bisogna andare alla pagina dedicata  '  
        
      })  
      this.select()
    
    }
    else{

     
    var valore = e.value
    valore = (valore+"").split(":")[1]
    query = "update rilatt.risorse_livello set id_livello = '" + valore +"' where id_risorsa = " +datiC.id_risorsa+" and  id_livello = "+datiC.id_livello
    }
  }
  if (colonna === "practice") 
  { 

    flag = true
    if (datiC.id_practice === null )  
    {
      Swal.fire({  
        icon: 'warning',  
        title: 'ettenzione',  
        text: 'non è presente alcuna practice associata a questa persona, \n per inserire un nuovo practice bisogna andare alla pagina dedicata  '  
        
      })  
      this.select()
    }
    else{
    
        
    var valore = e.value
    valore = (valore+"").split(":")[1]
    query = "update rilatt.risorse_practice set id_practice = '" + valore +"' where id_risorsa  = " +datiC.id_risorsa+" and  id_practice = "+datiC.id_practice
    }
  
  }
  if(!flag)
  {
    var valore = e.value
     query = "update rilatt.risorse set " + colonna + " = '" + valore +"' where id_risorsa = "+datiC.id_risorsa
  }
  

  console.log(query)
  this.update(query)

  }
 

  setup1= () => {
    var query = "select distinct descrizione || ':' ||  id_livello  as descrizione2 from rilatt.livello order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.livelli = dati; console.log(this.livelli)
      this.setup2();
    })
    
  }
  setup2= () => {
    var query = "select distinct   descrizione || ':' ||  id_ruolo as descrizione2 from rilatt.ruoli order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.ruoli = dati
      this.setup3();
    })
  
  }

 setup3  = () => {
    var query = "select distinct   descrizione || ':' ||  id_practice as descrizione2 from rilatt.practice  order by descrizione2"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.practice = dati
      this.strucElaboration();
    })
  
  }


 
  select  = ()  => {var query = "Select distinct  r.*, pra2.* , r2.id_ruolo, r2.dtvalid_ruolo ,rl.id_livello, rl.dtvalid_livello , pra2.descrizione as practice,l.descrizione as livello , r3.descrizione  as ruoli from rilatt.risorse r " 
       +"left join rilatt.risorse_livello  rl  on  r.id_risorsa  = rl.id_risorsa " 
       +" left  join  rilatt.livello l  on l.id_livello  = rl.id_livello "
       + " left join rilatt.risorse_ruoli  r2  on  r.id_risorsa  = r2.id_risorsa "
       + " left  join  rilatt.ruoli r3   on r3.id_ruolo  = r2.id_ruolo "
       +"left join rilatt.risorse_practice pra on pra.id_risorsa = r.id_risorsa "
       +"left join rilatt.practice pra2 on pra.id_practice = pra2.id_practice order by r.nome  "
 this.insP.select(query).subscribe(response =>{console.log(response) ;this.dati = JSON.parse(JSON.stringify(response)).rows;  this.agGrid.api.setRowData(this.dati); })

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
        text: 'errore update dati per la query: \n' +query,  
        
      })  
    }
  
  })



  strucElaboration = () => this.insP.structUndestanding("select  importanza ,maschera,column_name , table_name , table_schema , editable  , visible from rilatt.setting_colonne   sc where table_schema ='rilatt' and maschera = 'risorse' order by importanza "
  ).subscribe(response =>{
    console.log("ciao") ;  console.log(response)
    console.log(response)
    console.log("finito")
    var responsej = JSON.parse(JSON.stringify(response))


    for( let element of  responsej.rows) {
      var list : any[] = []
      var flag = false
      console.log(element)
      if(element.table_name === "ruoli" && element.column_name === "descrizione")  
         {
          console.log("entrato")
          flag = true 
          list =    [...new Map(this.ruoli.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
          list.push(null)
          this.columnDefs.push({resizable: true, cellEditor: 'agSelectCellEditor',   cellEditorParams: { values:list},"field" : element.column_name === "descrizione" ? element.table_name : element.column_name, editable : element.editable, hide : !element.visible}) 
     
         } 
      
      if(element.table_name === "livello" && element.column_name === "descrizione")
            {  console.log("entrato")
        flag = true 
        list =    [...new Map(this.livelli.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null)
        this.columnDefs.push({ resizable: true,cellEditor: 'agSelectCellEditor', cellEditorParams: { values:list},"field" : element.column_name === "descrizione" ? element.table_name : element.column_name, editable : element.editable, hide : !element.visible}) 
   
       } 
       if(element.table_name === "practice" && element.column_name === "descrizione") 
      {   
        console.log("entrato")
        flag = true 
        
        list =    [...new Map(this.practice.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null)
        this.columnDefs.push({resizable: true , cellEditor: 'agSelectCellEditor', cellEditorParams: { values:list},"field" : element.column_name === "descrizione" ? element.table_name : element.column_name, editable : element.editable, hide : !element.visible}) 
      }
       if (!flag )
       {  console.log("entrato 2 ")

          this.columnDefs.push({resizable: true , "field" : element.column_name === "descrizione" ? element.table_name : element.column_name, editable : element.editable, hide : !element.visible}) 

       }
      console.log()
      console.log(list)


    
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
          this.agGrid.api.applyTransaction({remove:[{id_risorsa : this.id_touch , dtvalid_livello : this.datvalid_livello === "null" ? "" : this.datvalid_livello, dtvalid_ruolo : this.datvalid_ruolo === "null" ? "":this.datvalid_ruolo , id_practice : this.id_practice }]});
    }
    else 
    { console.log("errore")
    
       
      
      Swal.fire({  
        icon: 'error',  
        title: 'Oops...',  
        text: 'errore nel delete dal database  con codice :  ' + risposata.code,  
        
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
    var practice = insertRL.practice === undefined  ||  insertRL.practice === null? "" : insertRL.practice.descrizione2 === undefined ? "" : insertRL.practice.descrizione2
    practice = practice === undefined ? "" : practice
      
    console.log(data)
    console.log(ruolo)
    console.log(livello)
    var falg1 = false 
    var flag2 = false 
    var flag3 = false
    var flag4 = false 

    var query = "insert into rilatt.risorse (nome , cognome , email) values ('"+insertD.nome+"','"+insertD.cognome+"','"+insertD.email+"' )  RETURNING id_risorsa"
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
          
      
             falg1 = true
             var id_risorsa = risposta.rows[0].id_risorsa

              

             if(true)//!(insertRL.livello.descrizione2 === undefined || insertRL.livello.descrizione2 === ""))
             {
              var descrizioneU : String =livello
             
             
              var id_livello = descrizioneU.split(":")[1]
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
                var id_ruolo = descrizioneR.split(":")[1]
                console.log(id_ruolo)
               var query3 = "insert into rilatt.risorse_ruoli(id_risorsa, id_ruolo , dtvalid_ruolo) values ('"+id_risorsa+"','"+id_ruolo+"','"+insertRL.data+"' )"
               
               console.log(query3)
               this.insP.select(query3).subscribe(response =>{
                console.log(response)
                var risposta = JSON.parse(JSON.stringify(response)) 
                if(risposta.upd === "ok")
                {     
                    
                       flag3 = true
                      
                }
                else 
                { console.log("errore")
                  console.log(risposta)
                 console.log(this.datiV)
                   
                
              
                }   var descrizioneR : String = practice
                var id_practice = descrizioneR.split(":")[1]
                console.log(id_practice)
               var query4 = "insert into rilatt.risorse_practice(id_risorsa, id_practice , dtvalid_risorsa_practice) values ('"+id_risorsa+"','"+id_practice+"','"+insertRL.data+"' )"
               
               console.log(query4)
               this.insP.select(query4).subscribe(response =>{
                console.log(response)
                var risposta = JSON.parse(JSON.stringify(response))

                if(risposta.upd === "ok")
                {     
                    
                       flag4 = true
                      
                }
                else 
                { console.log("errore")
                  console.log(risposta)
                 console.log(this.datiV)
                   
                
              
                } 
                var messaggio = ""
                 if (flag4){  messaggio = "practice inserita "}
                 else{messaggio = "practice non inserita"}
                if (falg1)
                {  
                  if (!flag2  && !flag3)
                  {
                   Swal.fire({  
                     icon: 'success',  
                     title: 'successo',  
                     text: "inserito correttamente  l'utente,  \n ruolo e livello non inseriti. " +messaggio,  
                       
                 })
                 }
                
                
                  if (flag2  && flag3)
                {
                 Swal.fire({  
                   icon: 'success',  
                   title: 'successo',  
                   text: 'inseriti correttamente utente, ruolo e livello. ' + messaggio,  
                     
               })}
               this.select()
             }
                else
                {
                   if (flag2)
                   {  this.select()
                     Swal.fire({  
                       icon: 'success',  
                       title: 'successo',  
                       text: 'inseriti correttamente utente e livello \n ruolo non inserito' + messaggio,  
                         
                   })
 
                   }
                   if (flag3)
                   {  this.select()
                     Swal.fire({  
                       icon: 'success',  
                       title: 'successo',  
                       text: 'inseriti correttamente utente e ruolo \n livello non inserito' + messaggio,  
                         
                   })

                   }
                   this.select()
                }
              
              
              
              
              
              
              
              
              })
  
  
                
             
                     
  
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
