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
  selector: 'app-risorse',
  templateUrl: './risorse.component.html',
  styleUrls: ['./risorse-component.css']
})

export class RisorseComponent implements OnInit {
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
  practice : any[] = []
  disabilitato = false;
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
  private dati : any = null
  private datiV : any 
  private id_touch : String = ""
  private datvalid_livello : String = "" 
  private datvalid_ruolo : String = "" 
  private id_practice : String = ""
  private id_ruolo : String = ""
  private id_risorsa_livello : String = ""
  private tabella =  "risorse"

  ngOnInit(): void {
    this.form= this.fb.group({
      nome : new FormControl("",[ Validators.required,Validators.minLength(1)]),
      cognome : new FormControl("",[ Validators.required,Validators.minLength(1)]),
      email : new FormControl("",[ Validators.required,Validators.minLength(1)]),
    });
    this.formRL = this.fb.group({
      ruolo : '',
      livello : '',
      practice : '' ,
      data : '',
    });
    var nome = "";
    var cognome = "";
    var email = "";
    var ruolo = "";
    var livello = "";
    var data = "";
    var practice = "";
  
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
        item.nome.includes((nome+"")) 
        && item.cognome.includes((cognome+"")) 
        && item.email.includes((email+""))
        && (item.ruoli +"").includes((ruolo+""))
        && (item.livello+"").includes((livello+""))
        && (item.practice+"").includes((practice+"")));
      this.agGrid.api.setRowData(filteredData)
    });

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
        item.nome.toLowerCase().includes((nome+"").toLowerCase()) 
        && item.cognome.toLowerCase().includes((cognome+"").toLowerCase()) 
        && item.email.toLowerCase().includes((email+"").toLowerCase())
        && (item.ruoli +"").toLowerCase().includes((ruolo+"").toLowerCase())
        && (item.livello+"").toLowerCase().includes((livello+"").toLowerCase())
        && (item.practice+"").toLowerCase().includes((practice+"").toLowerCase()));
      this.agGrid.api.setRowData(filteredData)
      this.resizeColumnWidth();
    });
    this.select();
    this.setup1();
  }

  setup1= () => {
    var query = "select distinct descrizione_livello || ':' ||  id_livello  as descrizione2 from new_rilatt.livello order by descrizione2 ";
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.livelli = dati;
      console.log(this.livelli);
      this.setup2();
    });
  }
  setup2= () => {
    var query = "select distinct   descrizione_ruolo || ':' ||  id_ruolo as descrizione2 from new_rilatt.ruoli order by descrizione2";
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.ruoli = dati;
      this.setup3();
    });
  }
  setup3  = () => {
    var query = "select distinct descrizione_practice || ':' ||  id_practice as descrizione2 from new_rilatt.practice  order by descrizione2";
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var dati = JSON.parse(JSON.stringify(response)).rows;
      this.practice = dati;
      this.strucElaboration();
    });
  }

  resizeColumnWidth(){
    // ridimensiona le colonne (larghezza) basandosi sul contenuto
    // il parametro della funzione è skipHeader (considera o meno la lunghezza dell'header)
    this.agGrid.columnApi.autoSizeAllColumns(false);
  }

  getRowId: GetRowIdFunc<any>  = params => (params.data.id_risorsa === null ? "aa" : params.data.id_risorsa ) +"-" + (params.data.id_risorsa_livello  === null ? "bb" : params.data.id_risorsa_livello )+"-"+(params.data.id_practice  === null ?"cc" : params.data.id_practice) +"-"+ (params.data.id_ruolo  === null ? "ee" : params.data.id_ruolo);

  onGridReady(params: GridReadyEvent) {
    this.agGrid.api.sizeColumnsToFit()
    this.agGrid.api.showNoRowsOverlay()
    //this.agGrid.getRowId   =  params =>{return params.data.id_risorsa}
    this.rowData$ = new Observable<any[]>
  }
 
  onCellClicked( e: CellClickedEvent): void {
    console.log('cellClicked', e);
    if (e.colDef.cellEditorParams != undefined) { 
      console.log(e.value);
      var lista : any [] = e.colDef.cellEditorParams.values;
      console.log(lista);
      let index = lista.findIndex(value => (value+"").includes(e.value +":"));
      console.log(index);
      if (index === -1) {
      } else {
        var appoggio = lista[0];
        lista[0] = lista[index];
        lista[index] = appoggio;
      }
    }
    
    this.id_touch =  e.data.id_risorsa
     this.datvalid_livello  = "" + e.data.dtvalid_ruolo
     this.datvalid_ruolo  = ""+e.data.dtvalid_livello 
     this.id_practice = e.data.id_practice
     this.id_ruolo = e.data.id_ruolo
     this.id_risorsa_livello = e.data.id_risorsa_livello
    console.log(this.id_touch) 
    var numeroC = e.column.getInstanceId()
    console.log(numeroC)
    var left = e.column.getLeft()
    console.log(left)
    var id_risorsa = e.data.id_risorsa 
    if (left === 0 && confirm('Eliminare definitivamente?'))
    {
       this.insP.select("select * from new_rilatt.attivita_risorsa where id_risorsa = " + id_risorsa).subscribe(Response => {
      var jsonR = JSON.parse(JSON.stringify(Response))
      console.log(Response)
      console.log(jsonR.rowCount)
      if (jsonR.rowCount === 0)
      { 
        console.log("caso non update")
        this.delete("delete from  new_rilatt.risorse_livello where id_risorsa = " + id_risorsa ,"1")

       

        
      }
      else
      {
        Swal.fire({  
          icon: 'error',  
          title: 'Oops...',  
          text: 'impossibile eliminare questa risorsa poichè essa è presente ancora nel registro attività ',  
          
        })  
      }
   
       })
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
    if (colonna === "descrizione_livello") {
      flag = true
      if (datiC.id_livello === null ) {
        Swal.fire({  
          icon: 'warning',  
          title: 'Attenzione',  
          text: 'Non è presente alcun ruolo associato a questa persona, \n per inserire un nuovo ruolo bisogna andare alla pagina dedicata'
        });
        this.select();
      } else {
        var valore = e.value;
        valore = (valore+"").split(":")[1];
        query = "update new_rilatt.risorse_livello set id_livello = '" + valore +"' where id_risorsa = " +datiC.id_risorsa+" and  id_livello = "+datiC.id_livello;
      }
    }
    if (colonna === "descrizione_ruolo") {  
      flag = true;
      var valore = e.value;
      valore = (valore+"").split(":")[1];
      query = "update new_rilatt.risorse set id_ruolo = '" + valore +"' where id_risorsa = " +datiC.id_risorsa;
    }
    if (colonna === "descrizione_practice") {  
      flag = true;
      var valore = e.value;
      valore = (valore+"").split(":")[1];
      query = "update new_rilatt.risorse set id_practice = '" + valore +"' where id_risorsa = " +datiC.id_risorsa;
    }
    if(!flag) {
      var valore = e.value;
      query = "update new_rilatt.risorse set " + colonna + " = '" + valore +"' where id_risorsa = "+datiC.id_risorsa;
    }
  
    console.log(query);
    this.update(query);
  }
 
  select = () => {
    var query = "Select distinct  r.* ,rl.id_risorsa_livello,rl.id_livello, rl.dtinizio_livello,  rl.dtfine_livello, pra2.descrizione_practice,l.descrizione_livello  , r3.descrizione_ruolo   from new_rilatt.risorse r " 
       +"left join new_rilatt.risorse_livello  rl  on  r.id_risorsa  = rl.id_risorsa and attivo = true  " 
       +" left  join  new_rilatt.livello l  on l.id_livello  = rl.id_livello "
       +" left  join  new_rilatt.ruoli r3   on r3.id_ruolo  = r.id_ruolo "
       +"left join new_rilatt.practice pra2 on r.id_practice = pra2.id_practice  order by r.nome  ";
    this.insP.select(query).subscribe(response =>{
      console.log(response) ;
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
        icon:  'error',  
        title: 'errore',  
        text:  'Si è verificato un errore. ',  
      });
    }
  });

  strucElaboration = () => this.insP.structUndestanding(
    "select  importanza ,maschera,column_name , table_name , table_schema , editable  , visible from new_rilatt.setting_colonne   sc where  maschera = 'risorse' order by importanza "
  ).subscribe(response =>{
    console.log(response);
    console.log("finito");
    var responsej = JSON.parse(JSON.stringify(response));

    for( let element of  responsej.rows) {
      var list : any[] = [];
      var flag = false;
      console.log(element);
      if(element.column_name === "descrizione_livello") {
        console.log("entrato");
        flag = true;
        list = [...new Map(this.livelli.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null);
        this.columnDefs.push({
          resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values:list},
          "field" : element.column_name , editable : element.editable, hide : !element.visible
        });
      } 
      
      if(element.column_name === "descrizione_ruolo") {
        console.log("entrato");
        flag = true;
        list = [...new Map(this.ruoli.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null);
        this.columnDefs.push({
          resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values:list},
          "field" : element.column_name,
          editable : element.editable, hide : !element.visible
        });
      } 
      if(element.table_name === "practice" && element.column_name === "descrizione_practice") {   
        console.log("entrato");
        flag = true;
        list = [...new Map(this.practice.map((item: { [x: string]: any; }) =>[item["descrizione2"], item["descrizione2"]])).values()]; 
        list.push(null);
        this.columnDefs.push({
          resizable: true,
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: { values:list},
          "field" : element.column_name === "descrizione" ? element.table_name : element.column_name,
          editable : element.editable, hide : !element.visible
        });
      }
      if (!flag) {
        console.log("entrato 2 ");
        this.columnDefs.push({
          resizable: true,
          "field" : element.column_name === "descrizione" ? element.table_name : element.column_name,
          editable : element.editable, hide : !element.visible
        });
      }
      console.log();
      console.log(list);
      this.resizeColumnWidth();
    };
    this.agGrid.api.setColumnDefs(this.columnDefs);
    this.agGrid.columnApi.autoSizeAllColumns();
  });

  delete = (query : String , numero : string) => this.insP.select(query).subscribe(response =>{
    console.log(response)
    console.log(this.id_risorsa_livello)
    var risposata = JSON.parse(JSON.stringify(response)) 
    if(risposata.upd === "ok") {
      console.log("delete  andato a buon fine "+ this.id_touch);
      if(numero === "1") {
        this.delete("delete from  new_rilatt.risorse  where id_risorsa = " +  this.id_touch, "2");
        this.agGrid.api.applyTransaction({
          remove: [{id_risorsa : this.id_touch ,  id_risorsa_livello : this.id_risorsa_livello, id_ruolo : this.id_ruolo,id_practice :  this.id_practice}]
        });
      }
    } else {
      console.log("errore");
      Swal.fire({  
        icon:  'error',  
        title: 'errore',  
        text:  'Si è verificato un errore. ',  
      });
    }
  });

  inserisciRiga = () : void => {
    var insertD =  JSON.parse(JSON.stringify(this.form.value));
    var insertRL =  JSON.parse(JSON.stringify(this.formRL.value));
    console.log(insertRL);
    console.log(insertD.email);
    var data = insertRL.data;
    data = data === undefined ? "" : data;
    var ruolo = insertRL.ruolo === undefined
      || insertRL.ruolo === null? "" : insertRL.ruolo.descrizione2 === undefined ? "" : insertRL.ruolo.descrizione2;
    ruolo = ruolo === undefined ? "" : ruolo
    var livello = insertRL.livello === undefined
      || insertRL.livello === null? "" : insertRL.livello.descrizione2 === undefined ? "" : insertRL.livello.descrizione2;
    livello = livello === undefined ? "" : livello
    var practice = insertRL.practice === undefined
      || insertRL.practice === null? "" : insertRL.practice.descrizione2 === undefined ? "" : insertRL.practice.descrizione2;
    practice = practice === undefined ? "" : practice;
    var descrizioneR : String = ruolo;
    var id_ruolo : string | null = descrizioneR.split(":")[1];
    var descrizioneR : String = practice;
    var id_practice : string | null = descrizioneR.split(":")[1];
    id_practice = id_practice === undefined ? null : id_practice;
    id_ruolo = id_ruolo === undefined ? null : id_ruolo;
    console.log(data);
    console.log(ruolo);
    console.log(livello);
    var falg1 = false;
    var flag2 = false;
    var flag3 = false;
    var flag4 = false;

    var query = "insert into new_rilatt.risorse (nome , cognome , email ,id_ruolo , id_practice ) values ('"+insertD.nome+"','"+insertD.cognome+"','"+insertD.email+"',"+id_ruolo+","+id_practice+" )  RETURNING id_risorsa";
    this.insP.select(query).subscribe(response =>{
      console.log(response);
      var risposta = JSON.parse(JSON.stringify(response));
      if(risposta.upd === "ok") {     
        falg1 = true;
        var id_risorsa = risposta.rows[0].id_risorsa;
        if(true) {//!(insertRL.livello.descrizione2 === undefined || insertRL.livello.descrizione2 === ""))
          var descrizioneU : String = livello;
          var id_livello = descrizioneU.split(":")[1];
          console.log(id_livello);
          if(id_livello != undefined) {
            var query2 = "insert into new_rilatt.risorse_livello(id_risorsa, id_livello , dtinizio_livello, attivo) values ('"+id_risorsa+"','"+id_livello+"','"+insertRL.data+"',"+true+" )"
            console.log(query2)
            this.insP.select(query2).subscribe(response =>{
              console.log(response)
              var risposta = JSON.parse(JSON.stringify(response)) 
              if(risposta.upd === "ok") {
                flag2 = true;
                this.select();
              } else {
                console.log("errore");
                console.log(risposta);
                console.log(this.datiV);
                Swal.fire({
                  icon:  'error',  
                  title: 'errore',  
                  text:  'Si è verificato un errore.',  
                });
              }
            });
          }
        }
        this.form.reset();
        this.formRL.reset();
        this.select();
      } else {
        console.log("errore");
        console.log(risposta);
        console.log(this.datiV);
        Swal.fire({
          icon:  'error',  
          title: 'errore',  
          text:  'Si è verificato un errore.',  
        });
      }
    });
  } 
}