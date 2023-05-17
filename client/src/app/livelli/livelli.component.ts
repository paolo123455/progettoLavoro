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
  selector: 'app-livelli',
  templateUrl: './livelli.component.html',
  styleUrls: ['./livelli.component.css']
})
export class LivelliComponent {
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
  private datiV : any;
  private id_touch : String = "";
  private datvalid_livello : String = "";
  private datvalid_ruolo : String = "";
  private tabella =  "risorse";
  
  ngOnInit(): void {
    this.form = this.fb.group({
      risorsa:  new FormControl("",[ Validators.required,Validators.minLength(1)]),
      livello :  new FormControl("",[ Validators.required,Validators.minLength(1)]),
      data :  new FormControl("",[ Validators.required,Validators.minLength(1)]),
    });
    this.form.valueChanges.subscribe((data)=>{
      this.disabilitato = this.form.valid;
      console.log(data);
      var datis : String = data.risorsa === undefined || data.risorsa === null ? undefined :data.risorsa.descrizione2;
      var datil : String = data.livello === undefined || data.livello === null ? undefined :data.livello.descrizione2;
      var datid : Date  = new Date(data.data);
      console.log(datil);
      if (datid.toString() === "Invalid Date") datid = new Date("1970-1-1");
      console.log(datid);
      var date : String  = datid.getFullYear() === 1970
        || datid === undefined ? "" : datid.getFullYear() + "-" + ( datid.getMonth()+1 < 10 ? 0 +""+(datid.getMonth()+1): datid.getMonth()+1) + "-" + (datid.getDate()+1< 10 ? 0 +""+datid.getDate(): datid.getDate());
      var datid2 = datid
      datid2.setDate(datid2.getDate() -1);
      this.olDate  = datid2.getFullYear() <=1970
        || datid2 === undefined ? "" : datid2.getFullYear() + "-" + ( datid2.getMonth()+1 < 10 ? 0 +""+(datid2.getMonth()+1): datid2.getMonth()+1) + "-" + (datid2.getDate()+1< 10 ? 0 +""+datid2.getDate(): datid2.getDate());
      date = date === undefined ? "" : date;
      var risn =  datis === undefined ? "" : datis.split(":")[0].split("-")[1];
      risn = risn === undefined ? "" : risn;
      var risc = datis === undefined ? "" : datis.split(":")[0].split("-")[0];
      risc = risc === undefined ? "" : risc;
    
      var livello =  datil === undefined ? "" : datil.split(":")[0];
      livello = livello === undefined ? "" : livello;
      console.log(risn,risc,"-",date, "-",livello);
      var filteredData = this.dati.filter((item: {
        dtinizio_livello: any;
        livello: any;
        email: any;
        cognome: String;
        nome: String; id_risorsa: any;
      }) =>
        item.nome.toLowerCase().includes((risn+"").toLowerCase())
        && item.livello.toLowerCase().includes((livello+"").toLowerCase())
        && item.cognome.toLowerCase().includes((risc+"").toLowerCase())
        && item.dtinizio_livello.toLowerCase().includes((date+"").toLowerCase())
      );
      this.agGrid.api.setRowData(filteredData);
      this.resizeColumnWidth();
    });
    this.test();
    this.testR();
    this.select();
    this.strucElaboration();
    this.setup1();
    this.setup2();
  }
  
  getRowId: GetRowIdFunc<any>  = params => params.data.id_risorsa_livello;

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
    console.log('cellClicked', e);
    this.id_touch = e.data.id_risorsa_livello;
    var id_risora = e.data.id_risorsa;
    var attivo = e.data.attivo;
    console.log(this.id_touch);
    var numeroC = e.column.getInstanceId();
    console.log(numeroC);
    var left = e.column.getLeft();
    console.log(left);
    
    if (left === 0 && confirm('Eliminare definitivamente?')) {
      if(attivo) {
        this.insP.select("select * from new_rilatt.attivita_risorsa where id_risorsa = " + id_risora).subscribe(Response => {
          var jsonR = JSON.parse(JSON.stringify(Response));
          console.log(Response);
          console.log(jsonR.rowCount);
          if (jsonR.rowCount === 0) { 
            console.log("caso non update");
            this.delete("delete from  new_rilatt.risorse_livello where id_risorsa_livello = " + this.id_touch);
          } else {
            this.insP.select("select * from new_rilatt.risorse_livello  where id_risorsa = " + id_risora).subscribe(Response => {
              var jsonR = JSON.parse(JSON.stringify(Response));
              if (jsonR.rowCount > 1) {
                this.delete("delete from new_rilatt.risorse_livello where id_risorsa_livello = " + this.id_touch);
                console.log("caso update");
                setTimeout(() => {
                  this.update(`update new_rilatt.risorse_livello set dtfine_livello = null, attivo = true    
                    where id_risorsa = `+id_risora+` and dtinizio_livello = (select max(dtinizio_livello) as max_age 
                    from new_rilatt.risorse_livello where attivo = false and id_risorsa = `+id_risora+` limit 1);`)
                },0);
              } else {
                Swal.fire({
                  icon: 'error',  
                  title: 'Oops...',  
                  text: 'impossibile eliminare il livello a questa risorsa poichè essa è presente ancora nel registro attività',
                });
              }
            });
          }
        });
      } else {   
        Swal.fire({
          icon: 'error',  
          title: 'Oops...',  
          text: 'impossibile eliminare un livello non attivo',
        });
      }
    }   
  }

  onCellEditingStarted( e: CellEditingStartedEvent): void { 
    var vecchioV = e.value; // save this value by attaching it to button or some variable
    console.log('cellEditingStarted');
    console.log(e);
    var colonna = e.colDef.field;
    this.datiV = JSON.parse(JSON.stringify(e.node.data));
    console.log(this.datiV);
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
    var query = "select distinct  descrizione_livello || ':' || id_livello  as descrizione2 from new_rilatt.livello order by descrizione2 " 
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.livelli = dati;
      console.log(this.livelli)}
    );
  }
  setup2= () => {
    var query = "select distinct  cognome || '-'  || nome || ':' || id_risorsa  as descrizione2 from new_rilatt.risorse order by descrizione2"
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.risorse = dati;
    });
  }
  
  test = () : void => this.insP.test();
  testR = () => this.insP.testRest().subscribe(Response => console.log(Response));
 
  select = () => {
    var query = "Select r.*,rl.attivo, rl.id_risorsa_livello, to_char( dtfine_livello, 'YYYY-MM-DD') as dtfine_livello ,to_char( dtinizio_livello, 'YYYY-MM-DD') as dtinizio_livello , l.descrizione_livello as livello from new_rilatt.risorse r " 
       +"inner join new_rilatt.risorse_livello  rl  on  r.id_risorsa  = rl.id_risorsa " 
       +"inner  join  new_rilatt.livello l  on l.id_livello  = rl.id_livello ";
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      this.dati = JSON.parse(JSON.stringify(response)).rows;
      this.agGrid.api.setRowData(this.dati);
      this.resizeColumnWidth();
    });
  }
 
  update = (query : String) => this.insP.select(query).subscribe(response =>{
    console.log(response);
    var risposata = JSON.parse(JSON.stringify(response));
    if(risposata.upd === "ok") {
      console.log("update andato a buon fine");
    } else {
      console.log("errore");
      console.log(this.datiV);
      this.agGrid.api.applyTransaction({update:[this.datiV]});
      Swal.fire({
        icon: 'error',  
        title: 'Oops...',  
        text: 'Something went wrong!',  
        footer: '<a href>Why do I have this issue?</a>'  
      });
    }
  });

  strucElaboration = () => this.insP.structUndestanding("select  * from new_rilatt.setting_colonne  where  maschera  = 'risorse_livello' order by importanza ")
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

  delete = (query : String) => this.insP.select(query).subscribe(response =>{
    console.log(response);
    var risposata = JSON.parse(JSON.stringify(response));
    if(risposata.upd === "ok") {
      console.log("delete  andato a buon fine "+ this.id_touch);
      this.agGrid.api.applyTransaction({remove:[{id_risorsa_livello : this.id_touch}]});
      this.select();
      this.form.reset();
    } else {
      console.log("errore");
      Swal.fire({
        icon: 'error',  
        title: 'Oops...',  
        text: 'errore delete',  
      });
    }
  });

  inserisciRiga = () : void => {
    console.log(this.form.value);
    var dat2 = new Date(this.form.value.data);
    console.log(dat2);
    var insertD =  JSON.parse(JSON.stringify(this.form.value));
    console.log(insertD);
    dat2.setDate(dat2.getDate() +1);
    //var data = new Date(data2);
    var data = dat2.toUTCString();
    console.log(data);
    var datap = dat2.getFullYear() + "-" + ( dat2.getMonth()+1 < 10 ? 0 +""+(dat2.getMonth()+1): dat2.getMonth()+1) + "-" + (dat2.getDate()+1< 10 ? 0 +""+dat2.getDate(): dat2.getDate());
    var descrizioneU : String = insertD.livello.descrizione2;
    var id_livello = descrizioneU.split(":")[1];
    console.log(id_livello);
    var descrizioneR : String = insertD.risorsa.descrizione2;
    var id_risorsa = descrizioneR.split(":")[1];
    console.log(id_risorsa);
    console.log(insertD);
    console.log(this.olDate);
    var query3 = "SELECT new_rilatt.fnc_check_livello("+id_risorsa+", '"+data+"') as risultato;";
    this.insP.select(query3).subscribe(response =>{
      console.log(response);
      var risposta = JSON.parse(JSON.stringify(response));
      if(risposta.rows[0].risultato.includes("KO")) {
        Swal.fire({
          icon: 'error',  
          title: 'errore',  
          text: 'data errata per inserimento livello',    
        });
      } else {
        var query2 = "update new_rilatt.risorse_livello  set attivo = false , dtfine_livello  = '" +this.olDate+"' where attivo is true and id_risorsa =  " +id_risorsa;
        this.insP.select(query2).subscribe(response =>{
          console.log(response);
          var risposta = JSON.parse(JSON.stringify(response));
          if(risposta.upd === "ok") {
            Swal.fire({
                  icon: 'success',  
                  title: 'successo',  
                  text: 'inserimento livello ad utente avvenuto con successo',
            });
            this.form.reset();
            this.select();
          } else {
            console.log("errore");
            console.log(risposta);
            console.log(this.datiV);
            Swal.fire({  
              icon: 'error',  
              title: 'errore',  
              text: 'update vecchio livello andato in errore!',
            });
          }
          var query = "insert into new_rilatt.risorse_livello (id_risorsa, id_livello, dtinizio_livello, attivo) values ('"+id_risorsa+"','"+id_livello+"','"+ data+"', true )  RETURNING id_risorsa";
          this.insP.select(query).subscribe(response =>{
            console.log(response)
            var risposta = JSON.parse(JSON.stringify(response)) 
            if(risposta.upd === "ok") {     
              Swal.fire({ 
                icon: 'success',  
                title: 'successo',  
                text: 'inserimento livello ad utente avvenuto con successo',
              });
              this.form.reset();
              this.select();
            } else {
              console.log("errore");
              console.log(risposta);
              console.log(this.datiV);
              Swal.fire({
                icon: 'error',
                title: 'errore',
                text: 'inserimento livello ad  utente errato!',
              });
            }
          });
        });
      }
    });
  }
}