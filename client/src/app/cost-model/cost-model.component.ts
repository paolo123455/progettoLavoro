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
import { Data } from '@angular/router';

@Component({
  selector: 'app-cost-model',
  templateUrl: './cost-model.component.html',
  styleUrls: ['./cost-model.component.css']
})
export class CostModelComponent {
  
  constructor(
    private fb:FormBuilder,
    private http: HttpClient,
    private insP : InsPService
  ){ }

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  form!: FormGroup; 
  formRL!: FormGroup; 
  myMap = new Map<string, string>();
  livelli: any[] = []
  ruoli: any[] = []
  risorse: any[] = []
  disabilitato = false;
  olDate : String = ""
  showForm = false;
    
  public columnDefs : ColDef[] = [
    {
      cellRenderer: (params : any) => {return '<div><button type="button" class="btn btn-sm"><i class="bi bi-trash-fill" style="color:red"></i></button></div>'},
      maxWidth: 34,
      filter: false,
      suppressMovable: true,
      lockPosition: 'left',
      cellClass: 'button-cell'
    }
  ];
  
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  
  // Data that gets displayed in the grid
  public rowData$!: Observable<any[]>;
  private dati : any = null;

  
  ngOnInit(): void {
    
  
    this.select();
    this.strucElaboration();


  }
  
  getRowId: GetRowIdFunc<any>  = params => params.data.livello;

  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid.columnApi.autoSizeAllColumns(false);
  }

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api.showNoRowsOverlay();
    this.rowData$ = new Observable<any[]>;
  }
 
  onCellClicked( e: CellClickedEvent): void {
    }

  onCellEditingStarted( e: CellEditingStartedEvent): void { 
   /* var vecchioV = e.value; // save this value by attaching it to button or some variable
    console.log('cellEditingStarted');
    console.log(e);
    var colonna = e.colDef.field;
    this.datiV = JSON.parse(JSON.stringify(e.node.data));
    console.log(this.datiV); */
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
 

  
  
  

 
  select = () => {
   
    this.insP.get_cost_model("1").subscribe(response =>{
      console.log(response);
      this.dati = JSON.parse(JSON.stringify(response)).rows;
      this.agGrid.api.setRowData(this.dati);
      this.resizeColumnWidth();
    });
  }
 

  strucElaboration = () => this.insP.structUndestanding("select  * from new_rilatt.setting_colonne  where  maschera  = 'cost_model' order by importanza ")
  .subscribe(response =>{
    console.log(response);
    console.log("finito");
    var responsej = JSON.parse(JSON.stringify(response));
    for( let element of responsej.rows) {
      console.log(element);
      this.columnDefs.push({
        "field" : element.column_name === "descrizione" ? element.table_name : element.column_name,
        editable : element.editable,
        hide : !element.visible,
        resizable: true,
      });
      this.myMap.set(element.column_name === "descrizione" ? element.table_name : element.column_name, element.table_name);
    };
    console.log(this.myMap);
    this.agGrid.api.setColumnDefs(this.columnDefs);
    this.resizeColumnWidth();
  });




}
