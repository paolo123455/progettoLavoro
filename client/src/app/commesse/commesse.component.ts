import { Component, OnInit } from '@angular/core';
import { InsPService } from 'src/services/ins-p.service';
import { AgGridAngular } from 'ag-grid-angular'
import { ViewChild } from '@angular/core';
import { FormBuilder, FormArray,FormControl,FormGroup, Validators } from '@angular/forms'
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
  constructor(
    private fb:FormBuilder,
    private http: HttpClient,
    private insP : InsPService
  ){ }
  
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  tipologie: any[] = []
  clienti: any[] = []
  stati: any[] = []
  risorse: any[] = []
  disabilitato = false;
  showForm = false;

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  private dati : any = null
  private datiV : any 
  private id_touch : String = ""
  private datvalid_livello : String = "" 
  private datvalid_ruolo : String = "" 

	public columnDefs : ColDef[] = [{
		cellRenderer: (params : any) => {return '<div><button type="button" class="btn btn-sm"><i class="bi bi-trash-fill" style="color:red"></i></button></div>'},
		maxWidth: 34,
		filter: false,
		suppressMovable: true,
		lockPosition: 'left',
		cellClass: 'button-cell'
	}];
 
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  ngOnInit(): void {
    
    
  
     
    this.form = this.fb.group({
      codice: new FormControl("",[ Validators.required,Validators.minLength(1)]),
      descrizione : new FormControl("",[ Validators.required,Validators.minLength(1)]), 
      note : '', 
    
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

  
    
  this.form.valueChanges.subscribe((data)=>{
    this.disabilitato = this.form.valid
   
    codice =  data.codice === undefined || data.codice === null  ? "" :data.codice
    codice = codice === undefined || codice === "undefined"  ? "" : codice
    descrizione  =  data.descrizione === undefined || data.descrizione === null  ? "" :data.descrizione
    descrizione = descrizione === undefined || descrizione === "undefined"  ? "" : descrizione
    note =  data.note === undefined || data.note === null ? "" :data.note
    note = note === undefined || note === "undefined"  ? "" : note
 

    var filteredData = this.dati.filter((item: {
     
      descrizione : string;
      codice: string;
     
  
        }) =>
     
     (item.codice+"").toLowerCase().includes(codice.toLowerCase())  
      && (item.descrizione+"").toLowerCase().includes(descrizione.toLowerCase()) 
     
    );
    this.agGrid.api.setRowData(filteredData);
    this.resizeColumnWidth();
  })
    this.select()
    this.setup1()
   

    
   
  }

  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid?.columnApi.autoSizeAllColumns(false);
  }

  getRowId: GetRowIdFunc<any>  = params => params.data.id;

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  onCellClicked( e: CellClickedEvent): void {
    

    console.log('cellClicked', e);
    this.id_touch =  e.data.id

     
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    if (left === 0 && confirm('Eliminare definitivamente?')) {
      this.delete("delete from  cost_model.commesse where id = " + this.id_touch)
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
  var query = "update cost_model.commesse set " + colonna + " = '" + valore +"' where id = "+datiC.id
  console.log(valore)  
  console.log(query)
  this.update(query)

  }

  setup1= () => {
    var query = "select valore as descrizione2  from new_rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='TIPOLOGIA' " 
    this.insP.select(query).subscribe(response =>{
                      console.log(response) ;
                      var dati = JSON.parse(JSON.stringify(response)).rows; 
                      this.tipologie= dati; console.log(this.tipologie)
    this.setup2()
    })

  }
  setup2= () => {
    var query = "select valore as descrizione2 from new_rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='FLAG_STATO'"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.stati = dati
    
    this.strucElaboration()
    })
  }
 /* setup3= () => {
    var query = "select descrizione || '-' || codice || ':' || id as descrizione2 from cost_model.clienti"
    this.insP.select(query).subscribe(response =>{console.log(response) ;var dati = JSON.parse(JSON.stringify(response)).rows;  this.clienti = dati
  
    })
  }*/

  select  = ()  => {
    console.log("select")
     var query = "select * from cost_model.commesse"// p left join new_rilatt.clienti c on c.id_cliente = p.id_cliente "
      
 this.insP.select(query).subscribe(response =>{
  console.log(response) ;
  this.dati = JSON.parse(JSON.stringify(response)).rows; 
  
  this.agGrid.api.setRowData(this.dati)});
  this.resizeColumnWidth();
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
     this.columnDefs.push({
      "field" :  element.column_name,
      editable : element.editable,
      hide : !element.visible,
      resizable: true,
    }) 
    
    };

    this.agGrid.api.setColumnDefs(this.columnDefs);
    this.agGrid.columnApi.autoSizeAllColumns();
    this.resizeColumnWidth();
  })

  delete =  (query : String)   => this.insP.select(query).subscribe(response =>{
    console.log(response)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok")
    {
          console.log("delete  andato a buon fine "+ this.id_touch)
          this.agGrid.api.applyTransaction({remove:[{id : this.id_touch}]});
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
   
    console.log(insert1)
    var codice = insert1.codice
    var descrizione = insert1.descrizione
    
    

    var query = "insert into public.commesse (codice, descrizione) values ('"+codice+"','"+descrizione+"' ) "
    console.log(query)
    this.insP.select_cost_modelDB(query).subscribe(response =>{
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
          
            this.select()
      }
      else 
      { console.log("errore")
        console.log(risposta)
        console.log(this.datiV)
         
      
        Swal.fire({  
          icon: 'error',  
          title: 'errore',  
          text: 'inserimento commessa  andato in errore con codice : ' + risposta.code,  
        })  
      }
    
    })

  } 

}
