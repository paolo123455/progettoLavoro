
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
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent {
  constructor(
    private fb:FormBuilder,
    private http: HttpClient,
    private insP : InsPService
  ){}

  form!: FormGroup; 
  form2!: FormGroup; 
  myMap = new Map<string, string>();
  tipologie: any[] = [];
  stati: any[] = [];
  risorse: any[] = [];
  showForm = false;

  // Prima colonna con il pulsante "Elimina"
  // Deve essere necessariamente la prima colonna
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

  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  private dati : any = null;
  private datiV : any;
  private id_touch : String = "";
  private datvalid_livello : String = "";
  private datvalid_ruolo : String = "";

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  ngOnInit(): void {
    this.form = this.fb.group({
      practice: new FormControl("",[ Validators.required,Validators.minLength(1)])
    })
  
    this.form.valueChanges.subscribe((data)=>{
      var practice = data.practice === undefined || data.practice== null ? "" : data.practice
      var filteredData = this.dati.filter((item: {
          descrizione_practice: string;
        }) => (item.descrizione_practice+"").toLowerCase().includes(practice.toLowerCase())
      );
      this.agGrid.api.setRowData(filteredData);
      this.resizeColumnWidth();
    });
    this.select();
    this.strucElaboration();
  }

  strucElaboration = () => this.insP
    .structUndestanding("select * from new_rilatt.setting_colonne sc where maschera = 'practice' order by importanza")
    .subscribe(response =>{
      console.log(response);
      console.log(response);

      var responsej = JSON.parse(JSON.stringify(response));
      for( let element of  responsej.rows) {
        console.log(element)
        this.columnDefs.push({
          "field" :  element.column_name,
          editable : element.editable,
          hide :     !element.visible,
          resizable: true,
        });
      };
      console.log(this.myMap);
      this.agGrid.api.setColumnDefs(this.columnDefs);
      this.resizeColumnWidth();
    });

  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid.columnApi.autoSizeAllColumns(false);
  }

  getRowId: GetRowIdFunc<any>  = params => params.data.id_practice;

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay()
    this.rowData$ = new Observable<any[]>
  }

  onCellClicked( e: CellClickedEvent): void {
    // console.log('cellClicked', e);
    this.id_touch =  e.data.id_practice
    // console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    // console.log(numeroC)
    var left = e.column.getLeft()
    // console.log(left)
    if (left === 0 && confirm('Eliminare definitivamente?')) {
      this.delete("delete from new_rilatt.practice where id_practice = " + this.id_touch);
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
    // console.log(e);
    var datiC = e.data;
    // console.log(datiC);
    var colonna =  e.colDef.field;
    // console.log(colonna , (colonna+"") === 'practice');
    var valore = e.value;
    var query = "update new_rilatt.practice set " +  colonna + " = '" + valore +"' where id_practice = "+datiC.id_practice;
    // console.log(valore);
    // console.log(query);
    this.update(query);
  }
 
  select = ()  => {
    var query = "select *, descrizione_practice from new_rilatt.practice ";
    this.insP.select(query).subscribe(response =>{
      // console.log(response)
      console.log(response);
      this.dati = JSON.parse(JSON.stringify(response)).rows;
      this.agGrid.api.setRowData(this.dati);
      this.resizeColumnWidth();
    });
  }
 
  update = (query : String) => {
    this.insP.select(query).subscribe(response => {
      // console.log(response)
      var risposta = JSON.parse(JSON.stringify(response));
      if(risposta.upd === "ok") {
        console.log("Update avvenuto con successo");
      } else {
        console.log("errore");
        console.log(risposta);
        console.log(this.datiV);
        this.agGrid.api.applyTransaction({update:[this.datiV]});
        Swal.fire({  
          icon:  'error',  
          title: 'errore',  
          text:  'Si è verificato un errore. ',  
        })  
      }
    });
  }

  delete = (query : String) => {
    this.insP.select(query).subscribe(response => {
      // console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok") {
        this.agGrid.api.applyTransaction({remove:[{id_practice : this.id_touch}]});
      } else {
        console.log("errore");
        console.log(risposta);
        console.log(this.datiV);
        Swal.fire({  
          icon:  'error',  
          title: 'errore',  
          text:  'Si è verificato un errore.'
        });
      }
    });
  }

  inserisciRiga = () : void => {
    var insert1 =  JSON.parse(JSON.stringify(this.form.value));
    var practice = insert1.practice;
    var query = "insert into new_rilatt.practice (descrizione_practice) values ('"+practice+"' )  RETURNING id_practice";
    this.insP.select(query).subscribe(response => {
      // console.log(response)
      var risposta = JSON.parse(JSON.stringify(response)) 
      if(risposta.upd === "ok") {     
        Swal.fire({  
          icon:  'success',  
          title: 'successo',  
          text:  'Inserimento practice avvenuto con successo!',     
        });
        this.form.reset();
        this.select();
      } else {
        console.log("errore");
        console.log(risposta);
        console.log(this.datiV);
         
        Swal.fire({  
          icon:  'error',  
          title: 'errore',  
          text:  'Si è verificato un errore.'
        });
      }
    });
  } 

}
