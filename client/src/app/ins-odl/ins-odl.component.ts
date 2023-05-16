
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
  selector: 'app-ins-odl',
  templateUrl: './ins-odl.component.html',
  styleUrls: ['./ins-odl.component.css']
})
export class InsOdlComponent {
  constructor(private fb:FormBuilder, private http: HttpClient, private insP : InsPService){ }
  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  tipologie: any[] = []
  progetti: any[] = []
  stati: any[] = []
  risorse: any[] = []
  risorse2: any[] = []
  practices: any [] = []
  disabilitato = false;
  
  
  
  

  ngOnInit(): void {
    
    
  
     
    this.form = this.fb.group({
      codice: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      descrizione : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      note : '', 
      budget : '',
      budgetPreg : '',
    })
    this.form2 = this.fb.group({
      stato: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      progetto:  new FormControl("",[ Validators.required,Validators.minLength(1)]),
      pm: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      practice : "",
      datei :  new FormControl("",[ Validators.required,Validators.minLength(1)]),
      datef :  new FormControl("",[ Validators.required,Validators.minLength(1)]),
  
    })
     var stato = ""
    var descrizionep =""
    var tipologia = ""
    var codice = ""
    var descrizione = ""
    var pm = ""
    var datei = ""
    var datef = ""
    var note = ""
    var budget = ""
    var budget_pregresso = ""
    var practice = ""
    

    this.form2.valueChanges.subscribe((data)=>{
     // console.log(this.form,this.form2)
      this.disabilitato = this.form.valid && this.form2.valid
    console.log(data)
    
    stato =  data.stato === undefined || data.stato === null  ? "" :data.stato.descrizione2  === undefined   || data.stato.descrizione2 === null ? "" :  data.stato.descrizione2
    stato = stato === undefined || stato === "undefined"  ? "" : stato
  
    descrizionep  =  data.progetto === undefined || data.progetto === null  ? "" :data.progetto.descrizione2 === undefined  || data.progetto.descrizione2 === null ? "" :  data.progetto.descrizione2.split(":")[0].split("-")[0]
    descrizionep = descrizionep === undefined || descrizionep === "undefined"  ? "" : descrizionep
    pm = data.pm === undefined || data.pm === null ? "" : data.pm.descrizione2 === undefined || data.pm.descrizione2 === null ? ""  :  data.pm.descrizione2.split(":")[1]
    pm = pm === undefined ? "" : pm
    var datid : Date  = new Date(data.datei);
    if (datid.toString() === "Invalid Date") datid = new Date("1970-1-1") 
    console.log(datid)
    datei = datid.getFullYear() === 1970  || datid === undefined ? "" : datid.getFullYear() + "-" + ( datid.getMonth()+1 < 10 ? 0 +""+(datid.getMonth()+1): datid.getMonth()+1) + "-" + (datid.getDate()+1< 10 ? 0 +""+datid.getDate(): datid.getDate())
     datid   = new Date(data.datef);
     if (datid.toString() === "Invalid Date") datid = new Date("1970-1-1") 
     console.log(datid)
    datef = datid.getFullYear() === 1970  || datid === undefined  ? "" : datid.getFullYear() + "-" + ( datid.getMonth()+1 < 10 ? 0 +""+(datid.getMonth()+1): datid.getMonth()+1) + "-" + (datid.getDate()+1< 10 ? 0 +""+datid.getDate(): datid.getDate())
    datei = datei === undefined ? "" : datei
    datef = datef === undefined ? "" : datef
    var datil : String =  data.practice === undefined || data.practice === null ? undefined :data.practice.descrizione2  === undefined ? "" : data.practice.descrizione2
    practice =  datil === undefined ? "" : datil.split(":")[0] ===  undefined ? "" :  datil.split(":")[0]
    console.log(datil , practice)
    console.log(datei, datef)
    console.log(this.dati)
    var filteredData = this.dati.filter((item: {
      dtinzio_odl : string
      dtfine_odl : string
      id_risorsa : string
      flag_stato: String;
      note: string;
      budget: string;
      descrizione_progetto: string;
      codice_odl: String;
      budget_pregresso : string
      descrizione_odl : string
      descrizione_practice : string

  
        }) =>
        item.flag_stato.includes(stato)  
      && (item.codice_odl+"").includes(codice)  
      && (item.descrizione_progetto+"").includes(descrizionep) 
      && (item.budget+"").includes(budget) 
      && (item.note+"").includes(note) 
      && (item.budget_pregresso+ "").includes(budget_pregresso) 
      && (item.descrizione_odl+ "").includes(descrizione) 
      && (item.id_risorsa + "").includes(pm)
      && (item.dtinzio_odl + "").includes(datei)
      && (item.dtfine_odl +"").includes(datef)
      && (item.descrizione_practice+"").includes(practice) 
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
    
    budget  =  data.budget === undefined || data.budget === null  ? "" :data.budget
    budget = budget === undefined || budget === "undefined"  ? "" : budget
    note =  data.note === undefined || data.note === null ? "" :data.note
    note = note === undefined || note === "undefined"  ? "" : note
    budget_pregresso = data.budgetPreg === undefined || data.budgetPreg == null ? "" : data.budgetPreg
    budget_pregresso = budget_pregresso === undefined || budget_pregresso === "undefined"  ? "" : budget_pregresso
    

    var filteredData = this.dati.filter((item: {
      dtinzio_odl : string
      dtfine_odl : string
      id_risorsa : string
      flag_stato: String;
      note: string;
      budget: string;
      descrizione_progetto: string;
      codice_odl: String;
      budget_pregresso : string
      descrizione_odl : string
      descrizione_practice : string

  
        }) =>
        item.flag_stato.includes(stato)  
      && (item.codice_odl+"").includes(codice)  
      && (item.descrizione_progetto+"").includes(descrizionep) 
      && (item.budget+"").includes(budget) 
      && (item.note+"").includes(note) 
      && (item.budget_pregresso+ "").includes(budget_pregresso) 
      && (item.descrizione_odl+ "").includes(descrizione) 
      && (item.id_risorsa + "").includes(pm)
      && (item.dtinzio_odl + "").includes(datei)
      && (item.dtfine_odl +"").includes(datef)
      && (item.descrizione_practice+"").includes(practice) 
      
    );
    this.agGrid.api.setRowData(filteredData)
  })
    this.select()
  
    this.setup1()
    this.setup2()
    this.setup3()
    this.setup4()
    this.setup5()
    this.strucElaboration()
   

    
   
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



  getRowId: GetRowIdFunc<any>  = params => params.data.id_odl

   // Example load data from sever
   onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  // Example of consuming Grid Event
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id_odl

     
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0)
   
    {
      this.delete("delete from  new_rilatt.odl where id_odl = " + this.id_touch)
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
  var query = "update new_rilatt.odl set " + colonna + " = '" + valore +"' where id_odl  = "+datiC.id_odl
  console.log(valore)  
  console.log(query)
  this.update(query)

  }
 

  setup1= () => {
    var query = "select valore as descrizione2  from new_rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='TIPOLOGIA' " 
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.tipologie= dati; console.log(this.tipologie)
   
    })

  }
  setup2= () => {
    var query = "select valore as descrizione2 from new_rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='FLAG_STATO'"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.stati = dati
    
    })
  }
  setup3= () => {
    var query = "select descrizione_progetto || '-' || codice || ':' || id_progetto as descrizione2 from new_rilatt.progetti"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.progetti = dati
  
    })
  }

  
  setup4= () => {
    var query = "select distinct   cognome || '-' || nome || ':' ||   r.id_risorsa as descrizione2 from new_rilatt.risorse r "
              +" inner join new_rilatt.odl r2  on  r.id_risorsa = r2.id_risorsa order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{
      console.log(response) ;
      var dati = JSON.parse(JSON.stringify(response)).rows;  
      this.risorse2=  [...new Map(dati.map((item: { [x: string]: any; }) =>
      [item["descrizione2"], item])).values()];
    
    })}

    setup5= () => {
      var query = "select distinct  descrizione_practice || ':' || id_practice  as descrizione2 from new_rilatt.practice order by descrizione2 " 
      this.insP.select(query).subscribe(response =>{
        console.log(response) ;
        var dati = JSON.parse(JSON.stringify(response)).rows; 
         this.practices = dati; console.log(this.practices)
        
        }
         
         )}

      
      
 
  select  = ()  => {var query = `
  select p.* , p2.descrizione_practice ,c.descrizione_progetto from new_rilatt.odl p 
  left join new_rilatt.progetti c on c.id_progetto = p.id_progetto 
  left join new_rilatt.practice p2 on p.id_practice = p2.id_practice
  
  `
      
 this.insP.select(query).subscribe(response =>{console.log(response) ;this.dati = JSON.parse(JSON.stringify(response)).rows; 

  this.agGrid.api.setRowData(this.dati)})

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



  strucElaboration = () => this.insP.structUndestanding("select * from new_rilatt.setting_colonne sc where maschera  = 'odl'  order by importanza"  ).subscribe(response =>{
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
          this.agGrid.api.applyTransaction({remove:[{id_odl : this.id_touch}]});
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
    var insert2 =  JSON.parse(JSON.stringify(this.form2.value))
    console.log(insert1,insert2)
    var codice = insert1.codice
    var descrizione = insert1.descrizione
   
    var  budget_pregresso = insert1.budgetPreg
    budget_pregresso = budget_pregresso === undefined || budget_pregresso === "" ? 0 : budget_pregresso
    var note = insert1.note
    var  progetto = insert2.progetto === undefined  || insert2.progetto === "" ? "" : insert2.progetto.descrizione2
    console.log(progetto)
    progetto = progetto === undefined || progetto === "" ? null :  progetto.split(":")[1]
    var budget = insert1.budget
    budget = budget === undefined || budget === "" ? 0 : budget
    var stato = insert2.stato.descrizione2

    var  pm = insert2.pm === undefined  || insert2.pm === "" ? "" : insert2.pm.descrizione2
    pm = pm === undefined || pm === "" ? null :  pm.split(":")[1]
    var  practice = insert2.practice === undefined  || insert2.practice === "" ? "" : insert2.practice.descrizione2
    practice = practice === undefined || practice === "" ? null :  practice.split(":")[1]
    var dat1 = new Date(this.form2.value.datei)
    dat1.setDate(dat1.getDate() +1)
    var datei = dat1.toUTCString()
    var dat2 = new Date(this.form2.value.datef)
    dat2.setDate(dat2.getDate() +1)
    var datef = dat2.toUTCString()
       
       
  
    

    var query = "insert into new_rilatt.odl (codice_odl, descrizione_odl, note , budget  , flag_stato  , budget_pregresso,id_progetto, id_risorsa , dtinzio_odl, dtfine_odl,id_practice) values ('"+codice+"','"+descrizione+"','"+note+"','"+budget+"','"+stato+"','"+budget_pregresso+"',"+progetto+","+pm+",'"+datei+"','"+datef+"',"+practice+" )  RETURNING id_odl"
    console.log(query)
    this.insP.select(query).subscribe(response =>{
      console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok")
      {     
             Swal.fire({  
                 icon: 'success',  
                 title: 'successo',  
                 text: 'inserimento odl avvenuto con successo',  
                   
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
          text: 'inserimento odl  andata in errore ',  
        })  
      }
    
    })

  } 

}
